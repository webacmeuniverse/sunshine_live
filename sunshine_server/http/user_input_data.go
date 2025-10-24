package http

import (
	"encoding/json"
	"fmt"
	"net/http"
	"path"
	"strconv"

	"acme.universe/sunshine/sunshine/controller"
	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"github.com/gorilla/sessions"
)

type userInputData struct {
	ss sessions.Store
	st stores.Store
	c  *controller.UserInputData
}

func newUserInputData(env *services.Env) *userInputData {
	uc := controller.NewUserInputData(env)

	return &userInputData{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Update existing userInputData item.
func (uid *userInputData) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := uid.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// Create new userInputData item.
func (uid *userInputData) create(w http.ResponseWriter, r *http.Request) {
	doc, err := uid.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// Get existing userInputData item.
func (uid *userInputData) get(w http.ResponseWriter, r *http.Request) {
	doc, _, err := uid.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	w.Header().Add("Location", path.Join(r.URL.String(), models.UserInputData{}.Kind()))

	json.NewEncoder(w).Encode(doc)
}

// List all ess-calc-menu-items.
func (uid *userInputData) list(w http.ResponseWriter, r *http.Request) {
	docs, deps, n, err := uid.c.List(r.Context(), ParseFilter(r.URL.Query()), r.URL.Query())

	w.Header().Set(countHeader, strconv.Itoa(n))

	fmt.Printf("%d user inputs found.\n", len(docs))

	encode(w, docs, deps, err)
}

// add sub menu item to menu
func (uid *userInputData) delUserInputData(w http.ResponseWriter, r *http.Request) {
	id := mustExtractUUID(r)
	if err := uid.c.DeleteUserInputData(r.Context(), id); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted User Input Data ID: " + id.String()}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
