package controllers

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/larryprice/refermadness/models"
	"github.com/larryprice/refermadness/utils"
	"html/template"
	"io/ioutil"
	"net/http"
	"net/url"
)

type AccountController interface {
	Register(*mux.Router)
}

type AccountControllerImpl struct {
	clientID     string
	clientSecret string
	scheme       string

	session     utils.SessionManager
	database    utils.DatabaseAccessor
	currentUser utils.CurrentUserAccessor
}

func NewAccountController(clientID, clientSecret string, isDevelopment bool, session utils.SessionManager,
	database utils.DatabaseAccessor, currentUser utils.CurrentUserAccessor) *AccountControllerImpl {
	scheme := "http"
	if !isDevelopment {
		scheme += "s"
	}
	return &AccountControllerImpl{
		clientID:     clientID,
		clientSecret: clientSecret,
		scheme:       scheme,
		session:      session,
		database:     database,
		currentUser:  currentUser,
	}
}

func (ac *AccountControllerImpl) Register(router *mux.Router) {
	// auth
	router.HandleFunc("/login", ac.login)
	router.HandleFunc("/logout", ac.logout)
	router.HandleFunc("/oauth2callback", ac.oauth2)

	// account
	router.HandleFunc("/account", ac.account)
	router.HandleFunc("/account/switch", ac.switchAccounts)
	router.HandleFunc("/account/delete", ac.deleteAccount)
}

func (ac *AccountControllerImpl) login(w http.ResponseWriter, r *http.Request) {
	if returnURL := r.FormValue("returnURL"); returnURL != "" {
		ac.session.Set(r, "RedirectAfterLogin", returnURL)
	}

	http.Redirect(w, r, "https://accounts.google.com/o/oauth2/auth?scope=email&redirect_uri="+
		ac.scheme+"%3A%2F%2F"+r.Host+"%2foauth2callback"+"&response_type=code&client_id="+ac.clientID,
		http.StatusTemporaryRedirect)
}

func (ac *AccountControllerImpl) oauth2(w http.ResponseWriter, r *http.Request) {
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

func (ac *AccountControllerImpl) findOrCreateUser(email, accessToken string, r *http.Request) {
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

func (ac *AccountControllerImpl) switchUserAccount(email, accessToken string, r *http.Request) {
	if user := ac.currentUser.Get(r); user != nil {
		user.Update(email, accessToken, ac.database.Get(r))
		return
	}

	// error!
	// apparently we couldn't find the currently logged in user in the system
	ac.session.Delete(r, "UserID")
}

func (ac *AccountControllerImpl) logout(w http.ResponseWriter, r *http.Request) {
	ac.session.Delete(r, "UserID")
	http.Redirect(w, r, "/", http.StatusFound)
}

func (ac *AccountControllerImpl) switchAccounts(w http.ResponseWriter, r *http.Request) {
	ac.session.Set(r, "RedirectAfterLogin", "/account")

	http.Redirect(w, r, "https://accounts.google.com/o/oauth2/auth?scope=email&state=updating&redirect_uri="+
		ac.scheme+"%3A%2F%2F"+r.Host+"%2foauth2callback"+"&response_type=code&client_id="+ac.clientID,
		http.StatusTemporaryRedirect)
}

func (ac *AccountControllerImpl) deleteAccount(w http.ResponseWriter, r *http.Request) {
	if user := ac.currentUser.Get(r); user != nil {
		user.Delete(ac.database.Get(r))
	}
	ac.session.Delete(r, "UserID")
	http.Redirect(w, r, "/", http.StatusFound)
}

type AccountPage struct {
	LoggedIn bool
	User     *models.User
}

func (ac *AccountControllerImpl) account(w http.ResponseWriter, r *http.Request) {
	if user := ac.currentUser.Get(r); user != nil {
		t, _ := template.ParseFiles("views/layout.html", "views/account.html")
		t.Execute(w, AccountPage{LoggedIn: true, User: user})
	} else {
		http.Error(w, "Users must be logged in to view the account page.", http.StatusUnauthorized)
	}
}
