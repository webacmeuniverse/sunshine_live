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

type onboardingResidentStepField struct {
	ss sessions.Store
	st stores.Store
	c  *controller.OnboardingResidentStepField
}

func newOnboardingResidentStepField(env *services.Env) *onboardingResidentStepField {
	uc := controller.NewOnboardingResidentStepField(env)

	return &onboardingResidentStepField{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Update existing ess-calc-menu-item.
func (orsf *onboardingResidentStepField) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := orsf.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// Create new onboarding-resident-item.
func (orsf *onboardingResidentStepField) create(w http.ResponseWriter, r *http.Request) {
	doc, err := orsf.c.Create(r.Context(), r.Body, mustExtractUUID(r))
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// Get existing ess-calc-menu-item.
func (orsf *onboardingResidentStepField) get(w http.ResponseWriter, r *http.Request) {
	doc, _, err := orsf.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	// encode(w, doc4, deps, err)
	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// List all onboarding-resident-step-items.
func (orsf *onboardingResidentStepField) list(w http.ResponseWriter, r *http.Request) {
	filter := ParseFilter(r.URL.Query())

	docs, deps, n, err := orsf.c.List(r.Context(), filter)

	w.Header().Set(countHeader, strconv.Itoa(n))
	encode(w, docs, deps, err)
}

// Purge onboarding-resident-step-item from db
func (orsf *onboardingResidentStepField) delOnboardingResidentStepField(w http.ResponseWriter, r *http.Request) {
	if err := orsf.c.DeleteOnboardingResidentField(r.Context(), mustExtractUUID(r)); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Resident onboarding step field."}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
