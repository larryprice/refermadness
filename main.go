package main

import (
	"fmt"
	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
	"html/template"
	"net/http"
	"net/url"
	"os"
)

type service struct {
	Name        string
	ID          string
	URL         string
	Description string
}

func main() {
	n := negroni.Classic()
	router := mux.NewRouter()
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("views/layout.html", "views/index.html")
		t.Execute(w, nil)
	})
	router.HandleFunc("/legal", func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("views/layout.html", "views/legal.html")
		t.Execute(w, nil)
	})
	router.HandleFunc("/search", func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("views/layout.html", "views/search.html")
		t.Execute(w, nil)
	})
	router.HandleFunc("/account", func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("views/layout.html", "views/account.html")
		t.Execute(w, nil)
	})
	router.HandleFunc("/service/create", func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("views/layout.html", "views/create-service.html")
		t.Execute(w, nil)
	})
	router.HandleFunc("/service/{id}", func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("views/layout.html", "views/service.html")
		t.Execute(w, nil)
	})
	router.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		redirectURI := r.Host
		if r.URL.Scheme == "" {
			redirectURI = "http%3A%2F%2F" + redirectURI + "%2foauth2callback"
		} else {
			redirectURI = "https%3A%2F%2F" + redirectURI + "%2foauth2callback"
		}
		http.Redirect(w, r,
			"https://accounts.google.com/o/oauth2/auth?scope=email%20profile&redirect_uri="+
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
		fmt.Println(resp, err)
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
	})

	r := render.New()

	api := router.PathPrefix("/api").Subrouter()
	api.HandleFunc("/services/{id}", func(resp http.ResponseWriter, req *http.Request) {
		r.JSON(resp, http.StatusOK, map[string]string{
			"hello": "json",
		})
	}).Methods("GET")

	n.UseHandler(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	n.Run(":" + port)
}
