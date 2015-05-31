package controllers

import (
  "github.com/gorilla/mux"
  "github.com/larryprice/refermadness/utils"
  "html/template"
  "net/http"
)

type ServiceControllerImpl struct {
  currentUser utils.CurrentUserAccessor
  basePage utils.BasePageCreator
}

func NewServiceController(currentUser utils.CurrentUserAccessor, basePage utils.BasePageCreator) *ServiceControllerImpl {
  return &ServiceControllerImpl{
    currentUser: currentUser,
    basePage: basePage,
  }
}

func (sc *ServiceControllerImpl) Register(router *mux.Router) {
  router.HandleFunc("/service/create", func(w http.ResponseWriter, r *http.Request) {
    t, _ := template.ParseFiles("views/layout.html", "views/create-service.html")
    t.Execute(w, sc.basePage.Get(r))
  })
  router.HandleFunc("/service/{id}", func(w http.ResponseWriter, r *http.Request) {
    t, _ := template.ParseFiles("views/layout.html", "views/service.html")
    t.Execute(w, sc.basePage.Get(r))
  })
}
