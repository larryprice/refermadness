package controllers

import (
  "github.com/gorilla/mux"
  "github.com/larryprice/refermadness/utils"
  "github.com/larryprice/refermadness/models"
  "html/template"
  "net/http"
  "gopkg.in/unrolled/render.v1"
  "encoding/json"
  "gopkg.in/mgo.v2/bson"
  "errors"
)

type ServiceControllerImpl struct {
  currentUser utils.CurrentUserAccessor
  basePage utils.BasePageCreator
  renderer *render.Render
  database utils.DatabaseAccessor
}

func NewServiceController(currentUser utils.CurrentUserAccessor, basePage utils.BasePageCreator,
    renderer *render.Render, database utils.DatabaseAccessor) *ServiceControllerImpl {
  return &ServiceControllerImpl{
    currentUser: currentUser,
    basePage: basePage,
    renderer: renderer,
    database: database,
  }
}

func (sc *ServiceControllerImpl) Register(router *mux.Router) {
  router.HandleFunc("/service/{id}", sc.single)
}

type result struct {
  *models.Service
  Code    string
}

type servicePage struct {
  utils.BasePage
  ResultString string
}

func (sc *ServiceControllerImpl) single(w http.ResponseWriter, r *http.Request) {
  data, err := sc.get(w, r)

  if len(r.Header["Content-Type"]) == 1 && r.Header["Content-Type"][0] == "application/json" {
    if err != nil {
      sc.renderer.JSON(w, http.StatusBadRequest, map[string]string{
        "error": err.Error(),
      })
      return
    }
    sc.renderer.JSON(w, http.StatusCreated, data)
    return
  }

  resultString, _ := json.Marshal(data)
  t, _ := template.ParseFiles("views/layout.html", "views/service.html")
  t.Execute(w, servicePage{sc.basePage.Get(r), string(resultString)}) 
}

func (sc *ServiceControllerImpl) get(w http.ResponseWriter, r *http.Request) (result, error) {
  if !bson.IsObjectIdHex(mux.Vars(r)["id"]) {
    return result{}, errors.New("Not a valid ID.")
  }
  service := new(models.Service)
  if service.FindByID(bson.ObjectIdHex(mux.Vars(r)["id"]), sc.database.Get(r)); !service.ID.Valid() {
    return result{}, errors.New("No such service.")
  }
  return result{service, ""}, nil
}