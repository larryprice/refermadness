package controllers

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/larryprice/refermadness/models"
	"github.com/larryprice/refermadness/utils"
	"io/ioutil"
	"net/http"
	"net/url"
	"gopkg.in/mgo.v2/bson"
)

type AuthenticationController interface {
	Register(*mux.Router)
}

type AuthenticationControllerImpl struct {
	clientID     string
	clientSecret string
	scheme       string

	session  utils.SessionManager
	database utils.DatabaseAccessor
}

func NewAuthenticationController(clientID, clientSecret string, isDevelopment bool,
	session utils.SessionManager, database utils.DatabaseAccessor) *AuthenticationControllerImpl {
	scheme := "http"
	if !isDevelopment {
		scheme += "s"
	}
	return &AuthenticationControllerImpl{
		clientID:     clientID,
		clientSecret: clientSecret,
		scheme:       scheme,
		session:      session,
		database:     database,
	}
}

func (ac *AuthenticationControllerImpl) Register(router *mux.Router) {
	router.HandleFunc("/login", ac.login)
	router.HandleFunc("/logout", ac.logout)
	router.HandleFunc("/oauth2callback", ac.oauth2)
	router.HandleFunc("/account/switch", ac.switchAccounts)
}

func (ac *AuthenticationControllerImpl) login(w http.ResponseWriter, r *http.Request) {
	if returnURL := r.FormValue("returnURL"); returnURL != "" {
		ac.session.Set(r, "RedirectAfterLogin", returnURL)
	}

	http.Redirect(w, r, "https://accounts.google.com/o/oauth2/auth?scope=email&redirect_uri="+
		ac.scheme+"%3A%2F%2F"+r.Host+"%2foauth2callback"+"&response_type=code&client_id="+ac.clientID,
		http.StatusTemporaryRedirect)
}

func (ac *AuthenticationControllerImpl) oauth2(w http.ResponseWriter, r *http.Request) {
	redirectTo := "/"
	if returnURL := ac.session.Get(r, "RedirectAfterLogin"); returnURL != "" {
		ac.session.Delete(r, "RedirectAfterLogin")
		redirectTo = returnURL
	}

	if r.FormValue("error") != "" {
		fmt.Println("Error in OAuth", r.FormValue("error"))
		http.Redirect(w, r, redirectTo, http.StatusFound)
		return
	}

	// send token request
	resp, err := http.PostForm("https://www.googleapis.com/oauth2/v3/token",
		url.Values{"code": {r.FormValue("code")}, "grant_type": {"authorization_code"}, "redirect_uri": {ac.scheme + "://" + r.Host + "/oauth2callback"},
			"client_id": {ac.clientID}, "client_secret": {ac.clientSecret}})

	if resp.StatusCode != http.StatusOK || err != nil {
		fmt.Println("Error in OAuth Access Token request", resp.StatusCode, err)
		http.Redirect(w, r, redirectTo, http.StatusFound)
		return
	}

	var result map[string]interface{}
	body, _ := ioutil.ReadAll(resp.Body)
	json.Unmarshal(body, &result)
	token, _ := jwt.Parse(result["id_token"].(string), func(token *jwt.Token) (interface{}, error) {
		return result["access_token"], nil
	})

	if r.FormValue("state") != "updating" {
		ac.findOrCreateUser(token.Claims["email"].(string), result["access_token"].(string), r)	
	} else {
		ac.switchUserAccount(token.Claims["email"].(string), result["access_token"].(string), r)
	}

	http.Redirect(w, r, redirectTo, http.StatusFound)
}

func (ac *AuthenticationControllerImpl) findOrCreateUser(email, accessToken string, r *http.Request) {
	user := new(models.User)
	db := ac.database.Get(r)
	if user.FindByEmail(email, db); user.ID.Valid() {
		user.Update(email, accessToken, db)
	} else {
		user = models.NewUser(email, accessToken)
		user.Save(db)
	}
	ac.session.Set(r, "UserID", user.ID.Hex())
}

func (ac *AuthenticationControllerImpl) switchUserAccount(email, accessToken string, r *http.Request) {
	user := new(models.User)
	db := ac.database.Get(r)
	if user.FindByID(bson.ObjectIdHex(ac.session.Get(r, "UserID")), db); user.ID.Valid() {
		user.Update(email, accessToken, db)
		return
	}

	// error!
	// apparently we couldn't find the currently logged in user in the system
	ac.session.Delete(r, "UserID")
}

func (ac *AuthenticationControllerImpl) logout(w http.ResponseWriter, r *http.Request) {
	ac.session.Delete(r, "UserID")
	http.Redirect(w, r, "/", http.StatusFound)
}

func (ac *AuthenticationControllerImpl) switchAccounts(w http.ResponseWriter, r *http.Request) {
	ac.session.Set(r, "RedirectAfterLogin", "/account")

	http.Redirect(w, r, "https://accounts.google.com/o/oauth2/auth?scope=email&state=updating&redirect_uri="+
		ac.scheme+"%3A%2F%2F"+r.Host+"%2foauth2callback"+"&response_type=code&client_id="+ac.clientID,
		http.StatusTemporaryRedirect)
}