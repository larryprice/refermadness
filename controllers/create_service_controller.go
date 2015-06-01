package controllers

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/larryprice/refermadness/models"
	"github.com/larryprice/refermadness/utils"
	"gopkg.in/unrolled/render.v1"
	"html/template"
	"io/ioutil"
	"net/http"
)

type CreateServiceControllerImpl struct {
	currentUser utils.CurrentUserAccessor
	basePage    utils.BasePageCreator
	renderer    *render.Render
	database    utils.DatabaseAccessor
}

func NewCreateServiceController(currentUser utils.CurrentUserAccessor, basePage utils.BasePageCreator,
	renderer *render.Render, database utils.DatabaseAccessor) *CreateServiceControllerImpl {
	return &CreateServiceControllerImpl{
		currentUser: currentUser,
		basePage:    basePage,
		renderer:    renderer,
		database:    database,
	}
}

func (sc *CreateServiceControllerImpl) Register(router *mux.Router) {
	router.HandleFunc("/service/create", sc.view).Methods("GET")
	router.HandleFunc("/service/create", sc.create).Methods("POST")
}

func (sc *CreateServiceControllerImpl) view(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("views/layout.html", "views/create-service.html")
	t.Execute(w, sc.basePage.Get(r))
}

func (sc *CreateServiceControllerImpl) create(w http.ResponseWriter, r *http.Request) {
	var serviceData map[string]string
	body, _ := ioutil.ReadAll(r.Body)
	if err := json.Unmarshal(body, &serviceData); err != nil {
		sc.renderer.JSON(w, http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
		return
	}

	if serviceData["name"] == "" || serviceData["description"] == "" || serviceData["url"] == "" {
		sc.renderer.JSON(w, http.StatusBadRequest, map[string]string{
			"error": "All fields must be filled out.",
		})
		return
	}

	service := models.NewService(serviceData["name"], serviceData["description"], serviceData["url"], sc.currentUser.Get(r).ID)
	service.Save(sc.database.Get(r))
	sc.renderer.JSON(w, http.StatusCreated, service)
}
