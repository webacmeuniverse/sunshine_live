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

type onboardingResidentQuestion struct {
	ss sessions.Store
	st stores.Store
	c  *controller.OnboardingResidentStepQuestion
}

func newOnboardingResidentQuestion(env *services.Env) *onboardingResidentQuestion {
	uc := controller.NewOnboardingResidentStepQuestion(env)

	return &onboardingResidentQuestion{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Update existing onboardingResidentQuestion-item.
func (orq *onboardingResidentQuestion) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := orq.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// Create new onboardingResidentQuestion-item.
func (orq *onboardingResidentQuestion) create(w http.ResponseWriter, r *http.Request) {
	doc, err := orq.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// Get existing ess-calc-menu-item.
func (orq *onboardingResidentQuestion) get(w http.ResponseWriter, r *http.Request) {
	doc, _, err := orq.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}
	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// List all onboarding-resident-step-items.
func (orq *onboardingResidentQuestion) list(w http.ResponseWriter, r *http.Request) {
	filter := ParseFilter(r.URL.Query())

	docs, err := orq.c.List(r.Context(), filter, r.Body)
	if err != nil {
		writeError(w, r, err)
	}

	w.Header().Add("Location", path.Join(r.URL.String(), "onboarding/residents/questions"))

	json.NewEncoder(w).Encode(docs)

}

// Purge onboarding-resident-step-item from db
func (orq *onboardingResidentQuestion) delOnboardingResidentQuestion(w http.ResponseWriter, r *http.Request) {
	if err := orq.c.DeleteResidentStepQuestion(r.Context(), mustExtractUUID(r)); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Resident onboarding step question."}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
