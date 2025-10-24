package http

import (
	"encoding/json"
	"net/http"
	"path"
	"strconv"

	"acme.universe/sunshine/sunshine/controller"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"github.com/gorilla/sessions"
)

type stepFieldOption struct {
	ss sessions.Store
	st stores.Store
	c  *controller.StepFieldOption
}

func newStepFieldOption(env *services.Env) *stepFieldOption {
	uc := controller.NewStepFieldOption(env)

	return &stepFieldOption{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Update existing step-field-option-item.
func (sfo *stepFieldOption) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := sfo.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// Create new step-field-option-item.
func (sfo *stepFieldOption) create(w http.ResponseWriter, r *http.Request) {
	doc, err := sfo.c.Create(r.Context(), r.Body, mustExtractUUID(r))
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// Get existing step-field-option-item.
func (sfo *stepFieldOption) get(w http.ResponseWriter, r *http.Request) {
	doc, _, err := sfo.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	// encode(w, doc4, deps, err)
	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// List all step-field-option-items.
func (sfo *stepFieldOption) list(w http.ResponseWriter, r *http.Request) {
	filter := ParseFilter(r.URL.Query())

	docs, deps, n, err := sfo.c.List(r.Context(), filter)

	w.Header().Set(countHeader, strconv.Itoa(n))
	encode(w, docs, deps, err)

}

// Purge step-field-option-item from db
func (sfo *stepFieldOption) delStepFieldOption(w http.ResponseWriter, r *http.Request) {
	if err := sfo.c.DeleteStepFieldOption(r.Context(), mustExtractUUID(r)); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted step field option."}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
