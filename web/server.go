package web

import (
	"github.com/codegangsta/negroni"
	"github.com/goincremental/negroni-sessions"
	"github.com/goincremental/negroni-sessions/cookiestore"
	"github.com/gorilla/mux"
	"github.com/larryprice/refermadness/controllers"
	"github.com/larryprice/refermadness/utils"
	"github.com/larryprice/refermadness/web/middleware"
	"github.com/unrolled/secure"
	"gopkg.in/unrolled/render.v1"
	"html/template"
	"net/http"
)

type Server struct {
	*negroni.Negroni
}

func NewServer(dba utils.DatabaseAccessor, cua utils.CurrentUserAccessor, clientID, clientSecret,
	sessionSecret string, isDevelopment bool, gaKey string) *Server {
	s := Server{negroni.Classic()}
	session := utils.NewSessionManager()
	basePage := utils.NewBasePageCreator(cua, gaKey)
	renderer := render.New()

	router := mux.NewRouter()
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("views/layout.html", "views/index.html")
		t.Execute(w, basePage.Get(r))
	})
	router.HandleFunc("/legal", func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("views/layout.html", "views/legal.html")
		t.Execute(w, basePage.Get(r))
	})
	router.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		t, _ := template.ParseFiles("views/layout.html", "views/404.html")
		t.Execute(w, basePage.Get(r))
	})

	accountController := controllers.NewAccountController(clientID, clientSecret, isDevelopment, session, dba, cua, basePage, renderer)
	accountController.Register(router)
	createServiceController := controllers.NewCreateServiceController(cua, basePage, renderer, dba)
	createServiceController.Register(router)
	serviceController := controllers.NewServiceController(cua, basePage, renderer, dba)
	serviceController.Register(router)
	codeController := controllers.NewReferralCodeController(cua, renderer, dba)
	codeController.Register(router)
	searchController := controllers.NewSearchController(cua, basePage, renderer, dba)
	searchController.Register(router)

	s.Use(negroni.HandlerFunc(secure.New(secure.Options{
		AllowedHosts:       []string{"www.refer-madness.com", "refer-madness.com"},
		ContentTypeNosniff: true,
		BrowserXssFilter:   true,
		FrameDeny:          true,
		IsDevelopment:      isDevelopment,
	}).HandlerFuncWithNext))
	s.Use(sessions.Sessions("refermadness", cookiestore.New([]byte(sessionSecret))))
	s.Use(middleware.NewDatabase(dba).Middleware())
	s.Use(middleware.NewAuthenticator(dba, session, cua).Middleware())
	s.UseHandler(router)

	return &s
}
