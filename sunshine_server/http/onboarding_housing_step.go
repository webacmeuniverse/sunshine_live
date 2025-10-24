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

type onboardingHousingStep struct {
	ss sessions.Store
	st stores.Store
	c  *controller.OnboardingHousingStep
}

func newOnboardingHousingStep(env *services.Env) *onboardingHousingStep {
	uc := controller.NewOnboardingHousingStep(env)

	return &onboardingHousingStep{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Update existing onboarding-housing-step-item.
func (ohs *onboardingHousingStep) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := ohs.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// Create new onboarding-housing-item.
func (ohs *onboardingHousingStep) create(w http.ResponseWriter, r *http.Request) {
	doc, err := ohs.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// Get onboarding-housing-item.
func (ohs *onboardingHousingStep) get(w http.ResponseWriter, r *http.Request) {
	doc, _, err := ohs.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	// encode(w, doc4, deps, err)
	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// List all onboarding-housing-step-items.
func (ohs *onboardingHousingStep) list(w http.ResponseWriter, r *http.Request) {
	filter := ParseFilter(r.URL.Query())

	docs, err := ohs.c.List(r.Context(), filter, r.Body)
	if err != nil {
		writeError(w, r, err)
	}

	addr := "onboarding-housing-step"

	w.Header().Add("Location", path.Join(r.URL.String(), addr))

	json.NewEncoder(w).Encode(docs)

}

// Purge onboarding-housing-step-item from db
func (ohs *onboardingHousingStep) delOnboardingHousingStep(w http.ResponseWriter, r *http.Request) {
	if err := ohs.c.DeleteOnboardingHousing(r.Context(), mustExtractUUID(r)); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Housing onboarding step."}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
