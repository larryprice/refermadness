package web

import (
	"github.com/codegangsta/negroni"
	"github.com/goincremental/negroni-sessions"
	"github.com/goincremental/negroni-sessions/cookiestore"
	"github.com/gorilla/mux"
	"github.com/larryprice/refermadness/controllers"
	"github.com/larryprice/refermadness/utils"
	"github.com/larryprice/refermadness/web/middleware"
	"html/template"
	"net/http"
)

type Server struct {
	*negroni.Negroni
}

type Page struct {
	LoggedIn bool
}

func NewServer(dba utils.DatabaseAccessor, cua utils.CurrentUserAccessor,
	             clientID, clientSecret, sessionSecret string, isDevelopment bool) *Server {
	s := Server{negroni.Classic()}
	session := utils.NewSessionManager()

	router := mux.NewRouter()
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("views/layout.html", "views/index.html")
		t.Execute(w, Page{LoggedIn: cua.Get(r) != nil})
	})
	router.HandleFunc("/legal", func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("views/layout.html", "views/legal.html")
		t.Execute(w, Page{LoggedIn: cua.Get(r) != nil})
	})
	router.HandleFunc("/account", func(w http.ResponseWriter, r *http.Request) {
		if cua.Get(r) != nil {
			t, _ := template.ParseFiles("views/layout.html", "views/account.html")
			t.Execute(w, Page{LoggedIn: true})
		} else {
			http.Error(w, "Users must be logged in to view the account page.", http.StatusUnauthorized)
		}
	})
	router.HandleFunc("/search", func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("views/layout.html", "views/search.html")
		t.Execute(w, Page{LoggedIn: cua.Get(r) != nil})
	})
	router.HandleFunc("/service/create", func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("views/layout.html", "views/create-service.html")
		t.Execute(w, Page{LoggedIn: cua.Get(r) != nil})
	})
	router.HandleFunc("/service/{id}", func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("views/layout.html", "views/service.html")
		t.Execute(w, Page{LoggedIn: cua.Get(r) != nil})
	})
	authenticationController := controllers.NewAuthenticationController(clientID, clientSecret, isDevelopment, session, dba)
	authenticationController.Register(router)

	s.Use(sessions.Sessions("refermadness", cookiestore.New([]byte(sessionSecret))))
	s.Use(middleware.NewDatabase(dba).Middleware())
	s.Use(middleware.NewAuthenticator(dba, session, cua).Middleware())
	s.UseHandler(router)

	return &s
}
