package controllers

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/larryprice/refermadness/models"
	"github.com/larryprice/refermadness/utils"
	"gopkg.in/mgo.v2/bson"
	"gopkg.in/unrolled/render.v1"
	"io/ioutil"
	"net/http"
)

type ReferralCodeControllerImpl struct {
	currentUser utils.CurrentUserAccessor
	renderer    *render.Render
	database    utils.DatabaseAccessor
}

func NewReferralCodeController(currentUser utils.CurrentUserAccessor, renderer *render.Render,
	database utils.DatabaseAccessor) *ReferralCodeControllerImpl {
	return &ReferralCodeControllerImpl{
		currentUser: currentUser,
		renderer:    renderer,
		database:    database,
	}
}

func (rc *ReferralCodeControllerImpl) Register(router *mux.Router) {
	router.HandleFunc("/codes", rc.create).Methods("POST")
}

func (rc *ReferralCodeControllerImpl) create(w http.ResponseWriter, r *http.Request) {
	body, _ := ioutil.ReadAll(r.Body)
	var values map[string]string
	json.Unmarshal(body, &values)
	code := values["code"]
	if code == "" {
		// this is actually a delete!
		// not handled currently
		rc.renderer.JSON(w, http.StatusBadRequest, map[string]string{
			"error": "Delete requested - not handled",
		})
		return
	}

	// verify serviceID
	rawServiceID := values["serviceId"]
	if !bson.IsObjectIdHex(rawServiceID) {
		rc.renderer.JSON(w, http.StatusBadRequest, map[string]string{
			"error": "Bad service ID",
		})
		return
	}

	db := rc.database.Get(r)
	service := new(models.Service)
	serviceID := bson.ObjectIdHex(rawServiceID)
	if err := service.FindByID(serviceID, db); err != nil || !service.ID.Valid() {
		rc.renderer.JSON(w, http.StatusBadRequest, map[string]string{
			"error": "Bad service request",
		})
		return
	}

	userID := rc.currentUser.Get(r).ID
	refCode := new(models.ReferralCode)
	if refCode.FindByUserAndService(userID, serviceID, db); refCode.ID.Valid() {
		if err := refCode.Edit(code, db); err != nil {
			rc.renderer.JSON(w, http.StatusBadRequest, map[string]string{
				"error": err.Error(),
			})
			return
		}
	} else {
		refCode = models.NewReferralCode(code, rc.currentUser.Get(r).ID, service.ID)
		if err := refCode.Save(db); err != nil {
			rc.renderer.JSON(w, http.StatusBadRequest, map[string]string{
				"error": err.Error(),
			})
			return
		}
	}

	rc.renderer.JSON(w, http.StatusCreated, refCode)
}
