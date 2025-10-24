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

	"github.com/google/uuid"
	"github.com/gorilla/sessions"
)

type placeholder struct {
	ss sessions.Store
	st stores.Store
	c  *controller.Placeholder
}

func newPlaceholder(env *services.Env) *placeholder {
	uc := controller.NewPlaceholder(env)

	return &placeholder{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Update existing ess-calc-menu-item.
func (ph *placeholder) update(w http.ResponseWriter, r *http.Request) {
	doc, err := ph.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), models.PlaceHolder{}.Kind()))
	json.NewEncoder(w).Encode(*doc)
}

// Create new onboarding-resident-item.
func (ph *placeholder) create(w http.ResponseWriter, r *http.Request) {
	doc, err := ph.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), models.PlaceHolder{}.Kind()))

	json.NewEncoder(w).Encode(*doc)
}

// Get existing ess-calc-menu-item.
func (ph *placeholder) get(w http.ResponseWriter, r *http.Request) {
	doc, _, err := ph.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	// encode(w, doc4, deps, err)
	w.Header().Add("Location", path.Join(r.URL.String(), models.PlaceHolder{}.Kind()))

	json.NewEncoder(w).Encode(doc)
}

// List all onboarding-resident-step-items.
func (ph *placeholder) list(w http.ResponseWriter, r *http.Request) {
	filter := ParseFilter(r.URL.Query())

	docs, deps, n, err := ph.c.List(r.Context(), filter)

	w.Header().Set(countHeader, strconv.Itoa(n))
	encode(w, docs, deps, err)
}

// Purge onboarding-resident-step-item from db
func (ph *placeholder) delOnboardingResidentStepField(w http.ResponseWriter, r *http.Request) {
	var ID uuid.UUID = mustExtractUUID(r)
	if err := ph.c.DeletePlaceholder(r.Context(), ID); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Master Placeholder." + ID.String()}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
