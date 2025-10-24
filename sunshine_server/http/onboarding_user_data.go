package http

import (
	"encoding/json"
	"net/http"
	"path"
	"strconv"

	"acme.universe/sunshine/sunshine/controller"
	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"github.com/gorilla/sessions"
)

type onboardingUserData struct {
	ss sessions.Store
	st stores.Store
	c  *controller.OnboardingUserData
}

func newOnboardingUserData(env *services.Env) *onboardingUserData {
	oc := controller.NewOnboardingUserData(env)

	return &onboardingUserData{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  oc,
	}
}

// Update existing userInputData item.
func (oud *onboardingUserData) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := oud.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// Create new userInputData item.
func (oud *onboardingUserData) create(w http.ResponseWriter, r *http.Request) {
	doc, err := oud.c.Create(r.Context(), r.Body)
	if err != nil {
		// writeError(w, r, err)
		msg := ErrResponse{Error: err.Error()}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(msg)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// Get existing userInputData item.
func (oud *onboardingUserData) get(w http.ResponseWriter, r *http.Request) {
	doc, _, err := oud.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	// doc1 := urb.addCalcItems(*doc)

	w.Header().Add("Location", path.Join(r.URL.String(), models.OnboardingUserData{}.Kind()))

	json.NewEncoder(w).Encode(doc)
}

func (oud *onboardingUserData) check(w http.ResponseWriter, r *http.Request) {
	user, _, err := oud.c.CheckUser(r.Context(), r.URL.Query())
	if err != nil {
		writeError(w, r, err)
	}
	w.Header().Add("Location", path.Join(r.URL.String(), "user/check"))
	if user == nil {
		noUser := DeleteSuccess{Message: "There's no user with that email in the database"}
		json.NewEncoder(w).Encode(noUser)
		return
	}
	json.NewEncoder(w).Encode(user)
}

// List all ess-calc-menu-items. get params from uri
func (oud *onboardingUserData) list(w http.ResponseWriter, r *http.Request) {
	docs, deps, n, err := oud.c.List(r.Context(), ParseFilter(r.URL.Query()), r.URL.Query())

	w.Header().Set(countHeader, strconv.Itoa(n))

	encode(w, docs, deps, err)
}

// List all ess-calc-menu-items. get params from uri
func (oud *onboardingUserData) listInputs(w http.ResponseWriter, r *http.Request) {
	doc, err := oud.c.ListInputs(r.Context(), ParseFilter(r.URL.Query()), mustExtractUUID(r))

	if err != nil {
		writeError(w, r, err)
	}

	w.Header().Add("Location", path.Join(r.URL.String(), models.OnboardingUserData{}.Kind()))

	json.NewEncoder(w).Encode(doc)
}

// add sub menu item to menu
func (oud *onboardingUserData) delOnboardingUserData(w http.ResponseWriter, r *http.Request) {
	id := mustExtractUUID(r)
	if err := oud.c.DeleteOnboardingUserData(r.Context(), id); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Onboarding User Data ID: " + id.String()}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
