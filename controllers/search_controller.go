package controllers

import (
  "encoding/json"
  "errors"
  "github.com/gorilla/mux"
  "github.com/larryprice/refermadness/models"
  "github.com/larryprice/refermadness/utils"
  "gopkg.in/unrolled/render.v1"
  "html/template"
  "net/http"
  "strings"

  // "fmt"
)

type SearchControllerImpl struct {
  currentUser utils.CurrentUserAccessor
  basePage    utils.BasePageCreator
  renderer    *render.Render
  database    utils.DatabaseAccessor
}

func NewSearchController(currentUser utils.CurrentUserAccessor, basePage utils.BasePageCreator,
  renderer *render.Render, database utils.DatabaseAccessor) *SearchControllerImpl {
  return &SearchControllerImpl{
    currentUser: currentUser,
    basePage:    basePage,
    renderer:    renderer,
    database:    database,
  }
}

func (sc *SearchControllerImpl) Register(router *mux.Router) {
  router.HandleFunc("/search", sc.search)
}

type searchPage struct {
  utils.BasePage
  ResultString string
}

func (sc *SearchControllerImpl) search(w http.ResponseWriter, r *http.Request) {
  data, err := sc.get(w, r)

  if len(r.Header["Content-Type"]) == 1 && strings.Contains(r.Header["Content-Type"][0], "application/json") {
    if err != nil {
      sc.renderer.JSON(w, http.StatusBadRequest, map[string]string{
        "error": err.Error(),
      })
      return
    }
    sc.renderer.JSON(w, http.StatusOK, data)
    return
  }

  resultString, _ := json.Marshal(data)
  t, _ := template.ParseFiles("views/layout.html", "views/search.html")
  t.Execute(w, searchPage{sc.basePage.Get(r), string(resultString)})
}

func (sc *SearchControllerImpl) get(w http.ResponseWriter, r *http.Request) (*models.Services, error) {
  services := new(models.Services)
  query := r.FormValue("q")
  if query == "" {
    return services, nil
  }

  if err := services.FindRelevant(query, sc.database.Get(r)); err != nil {
    return nil, errors.New("Database error: " + err.Error())
  }

  return services, nil
}
