package controllers

import (
	"encoding/json"
	"errors"
	"github.com/gorilla/mux"
	"github.com/larryprice/refermadness/models"
	"github.com/larryprice/refermadness/utils"
	"gopkg.in/mgo.v2/bson"
	"gopkg.in/unrolled/render.v1"
	"html/template"
	"net/http"
	"strings"
)

type ServiceControllerImpl struct {
	currentUser utils.CurrentUserAccessor
	basePage    utils.BasePageCreator
	renderer    *render.Render
	database    utils.DatabaseAccessor
}

func NewServiceController(currentUser utils.CurrentUserAccessor, basePage utils.BasePageCreator,
	renderer *render.Render, database utils.DatabaseAccessor) *ServiceControllerImpl {
	return &ServiceControllerImpl{
		currentUser: currentUser,
		basePage:    basePage,
		renderer:    renderer,
		database:    database,
	}
}

func (sc *ServiceControllerImpl) Register(router *mux.Router) {
	router.HandleFunc("/service/popular", sc.popular)
	router.HandleFunc("/service/recent", sc.recent)
	router.HandleFunc("/service/{id}", sc.single)
}

func (sc *ServiceControllerImpl) popular(w http.ResponseWriter, r *http.Request) {
	services := new(models.Services)
	if err := services.FindMostPopular(3, sc.database.Get(r)); err != nil {
		sc.renderer.JSON(w, http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
		return
	}

	sc.renderer.JSON(w, http.StatusOK, services)
}

func (sc *ServiceControllerImpl) recent(w http.ResponseWriter, r *http.Request) {
	services := new(models.Services)
	if err := services.FindMostRecent(3, sc.database.Get(r)); err != nil {
		sc.renderer.JSON(w, http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
		return
	}

	sc.renderer.JSON(w, http.StatusOK, services)
}

type serviceResult struct {
	*models.Service
	RandomCode *models.ReferralCode
	UserCode   *models.ReferralCode
}

type servicePage struct {
	utils.BasePage
	ResultString string
}

func (sc *ServiceControllerImpl) single(w http.ResponseWriter, r *http.Request) {
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
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	resultString, _ := json.Marshal(data)
	t, _ := template.ParseFiles("views/layout.html", "views/service.html")
	t.Execute(w, servicePage{sc.basePage.Get(r), string(resultString)})
}

func (sc *ServiceControllerImpl) get(w http.ResponseWriter, r *http.Request) (serviceResult, error) {
	if !bson.IsObjectIdHex(mux.Vars(r)["id"]) {
		return serviceResult{}, errors.New("Not a valid ID.")
	}
	service := new(models.Service)
	db := sc.database.Get(r)
	if err := service.FindByID(bson.ObjectIdHex(mux.Vars(r)["id"]), db); !service.ID.Valid() || err != nil {
		return serviceResult{}, errors.New("No such service.")
	}
	defer service.WasSelected(db)

	refCode := new(models.ReferralCode)
	if err := refCode.FindRandom(service.ID, db); err != nil {
		return serviceResult{}, errors.New("Internal error.")
	}
	defer refCode.WasViewed(db)

	userRefCode := new(models.ReferralCode)
	if user := sc.currentUser.Get(r); user != nil {
		userRefCode.FindByUserAndService(sc.currentUser.Get(r).ID, service.ID, db)
	}

	return serviceResult{service, refCode, userRefCode}, nil
}
