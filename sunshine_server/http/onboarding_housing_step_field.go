package http

import (
	"encoding/json"
	"net/http"
	"path"

	"acme.universe/sunshine/sunshine/controller"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"github.com/gorilla/sessions"
)

type onboardingHousingStepField struct {
	ss sessions.Store
	st stores.Store
	c  *controller.OnboardingHousingStepField
}

func newOnboardingHousingStepField(env *services.Env) *onboardingHousingStepField {
	uc := controller.NewOnboardingHousingStepField(env)

	return &onboardingHousingStepField{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Update existing onboarding-housing-step-field-item.
func (ohsf *onboardingHousingStepField) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := ohsf.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}
	encode(w, doc, deps, err)
}

// Create new onboarding-housing-field-item.
func (ohsf *onboardingHousingStepField) create(w http.ResponseWriter, r *http.Request) {
	doc, err := ohsf.c.Create(r.Context(), r.Body, mustExtractUUID(r))
	if err != nil {
		writeError(w, r, err)
		return
	}
	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))
	json.NewEncoder(w).Encode(*doc)
}

// Get onboarding-housing-field-item.
func (ohsf *onboardingHousingStepField) get(w http.ResponseWriter, r *http.Request) {
	doc, _, err := ohsf.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}
	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))
	json.NewEncoder(w).Encode(doc)
}

// List all onboarding-housing-step-items.
func (ohsf *onboardingHousingStepField) list(w http.ResponseWriter, r *http.Request) {
	filter := ParseFilter(r.URL.Query())

	docs, err := ohsf.c.List(r.Context(), filter, r.Body)
	if err != nil {
		writeError(w, r, err)
	}
	w.Header().Add("Location", path.Join(r.URL.String(), docs[0].ID.String()))
	json.NewEncoder(w).Encode(docs)

}

// Purge onboarding-housing-step-field-item from db
func (ohsf *onboardingHousingStepField) delOnboardingHousingStepField(w http.ResponseWriter, r *http.Request) {
	if err := ohsf.c.DeleteOnboardingHousingField(r.Context(), mustExtractUUID(r)); err != nil {
		writeError(w, r, err)
		return
	}
	delMsg := DeleteSuccess{Message: "Successfully deleted Housing onboarding step field."}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
