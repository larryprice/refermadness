package controllers

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
)

func Create(router *mux.Router) {
	router.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		redirectURI := r.Host
		if r.URL.Scheme == "" {
			redirectURI = "http%3A%2F%2F" + redirectURI + "%2foauth2callback"
		} else {
			redirectURI = "https%3A%2F%2F" + redirectURI + "%2foauth2callback"
		}
		http.Redirect(w, r,
			"https://accounts.google.com/o/oauth2/auth?scope=email&redirect_uri="+
				redirectURI+"&response_type=code&client_id="+os.Getenv("GOOGLE_OAUTH2_CLIENT_ID"),
			http.StatusTemporaryRedirect)
	})
	router.HandleFunc("/oauth2callback", func(w http.ResponseWriter, r *http.Request) {
		if r.FormValue("error") != "" {
			fmt.Println("Error in OAuth", r.FormValue("error"))
			// redirect to wherever we came from with error message
		}
		redirectURI := r.Host
		if r.URL.Scheme == "" {
			redirectURI = "http://" + redirectURI + "/oauth2callback"
		} else {
			redirectURI = "https://" + redirectURI + "/oauth2callback"
		}
		// send token request
		resp, err := http.PostForm("https://www.googleapis.com/oauth2/v3/token",
			url.Values{"code": {r.FormValue("code")}, "grant_type": {"authorization_code"}, "redirect_uri": {redirectURI},
				"client_id": {os.Getenv("GOOGLE_OAUTH2_CLIENT_ID")}, "client_secret": {os.Getenv("GOOGLE_OAUTH2_CLIENT_SECRET")}})

		var result map[string]interface{}
		body, err := ioutil.ReadAll(resp.Body)
		json.Unmarshal(body, &result)
		token, _ := jwt.Parse(result["id_token"].(string), func(token *jwt.Token) (interface{}, error) {
			return result["access_token"], nil
		})
		fmt.Println(token.Claims["email"], err, resp.StatusCode)

		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
	})
}
