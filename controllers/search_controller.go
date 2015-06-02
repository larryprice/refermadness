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

	"strconv"
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

type searchResult struct {
	*models.Services
	Total int
}

func (sc *SearchControllerImpl) get(w http.ResponseWriter, r *http.Request) (searchResult, error) {
	services := new(models.Services)
	query := r.FormValue("q")
	if query == "" {
		return searchResult{services, 0}, nil
	}

	var limit int
	var err error

	if limit, err = strconv.Atoi(r.FormValue("limit")); err != nil {
		limit = 11
	}

	if limit > 50 {
		limit = 50
	}

	var skip int
	if skip, err = strconv.Atoi(r.FormValue("skip")); err != nil {
		skip = 0
	}

	var total int
	if total, err = services.FindRelevant(query, limit, skip, sc.database.Get(r)); err != nil {
		return searchResult{}, errors.New("Database error: " + err.Error())
	}

	return searchResult{services, total}, nil
}
