package controllers

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/larryprice/refermadness/models"
	"github.com/larryprice/refermadness/utils"
	"gopkg.in/mgo.v2"
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
	router.HandleFunc("/codes/random", rc.random).Methods("GET")
	router.HandleFunc("/codes/{id}/report", rc.report).Methods("GET")
}

func (rc *ReferralCodeControllerImpl) create(w http.ResponseWriter, r *http.Request) {
	body, _ := ioutil.ReadAll(r.Body)
	var values map[string]string
	json.Unmarshal(body, &values)

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
	code := values["code"]
	refCode := new(models.ReferralCode)
	if refCode.FindByUserAndService(userID, serviceID, db); refCode.ID.Valid() {
		if code == "" {
			analytics := new(models.Analytics)
			defer analytics.AddDeletedReferralCode(refCode, db)
			defer refCode.Delete(db)

			rc.renderer.JSON(w, http.StatusOK, nil)
			return
		}

		if err := refCode.Edit(code, db); err != nil {
			rc.renderer.JSON(w, http.StatusBadRequest, map[string]string{
				"error": err.Error(),
			})
			return
		}
	} else {
		if code == "" {
			rc.renderer.JSON(w, http.StatusBadRequest, map[string]string{
				"error": "Empty referral code not allowed",
			})
			return
		}
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

func (rc *ReferralCodeControllerImpl) random(w http.ResponseWriter, r *http.Request) {
	serviceID := r.FormValue("sid")
	if !bson.IsObjectIdHex(serviceID) {
		rc.renderer.JSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid service ID."})
		return
	}

	if refCode := rc.randomCode(bson.ObjectIdHex(serviceID), rc.database.Get(r), w); refCode.ID.Valid() {
		rc.renderer.JSON(w, http.StatusOK, refCode)
	}
}

func (rc *ReferralCodeControllerImpl) randomCode(serviceID bson.ObjectId, db *mgo.Database, w http.ResponseWriter) *models.ReferralCode {
	refCode := new(models.ReferralCode)

	service := new(models.Service)
	if err := service.FindByID(serviceID, db); err != nil {
		rc.renderer.JSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return refCode
	}
	if !service.ID.Valid() {
		rc.renderer.JSON(w, http.StatusBadRequest, map[string]string{"error": "No such service."})
		return refCode
	}

	if err := refCode.FindRandom(service.ID, db); err != nil {
		rc.renderer.JSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return refCode
	}
	defer refCode.WasViewed(db)

	return refCode
}

func (rc *ReferralCodeControllerImpl) report(w http.ResponseWriter, r *http.Request) {
	u := rc.currentUser.Get(r)
	if u == nil {
		rc.renderer.JSON(w, http.StatusUnauthorized, map[string]string{"error": "Must be logged in to report invalid codes"})
		return
	}

	if !bson.IsObjectIdHex(mux.Vars(r)["id"]) {
		rc.renderer.JSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid BSON ID"})
		return
	}
	code := new(models.ReferralCode)
	db := rc.database.Get(r)
	if err := code.FindByID(bson.ObjectIdHex(mux.Vars(r)["id"]), db); err != nil {
		rc.renderer.JSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	if !code.ID.Valid() {
		rc.renderer.JSON(w, http.StatusBadRequest, map[string]string{"error": "No such referral code"})
		return
	}

	if u.ID == code.UserID {
		rc.renderer.JSON(w, http.StatusBadRequest, map[string]string{"error": "Don't report your own code, silly"})
		return
	}

	defer code.WasReported(u.ID, db)

	flag := models.NewReferralCodeFlag(code.ID, u.ID)
	defer flag.Save(db)

	if newCode := rc.randomCode(code.ServiceID, db, w); newCode.ID.Valid() {
		rc.renderer.JSON(w, http.StatusOK, newCode)
	}
}
