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

type onboardingHousingQuestion struct {
	ss sessions.Store
	st stores.Store
	c  *controller.OnboardingHousingStepQuestion
}

func newOnboardingHousingQuestion(env *services.Env) *onboardingHousingQuestion {
	uc := controller.NewOnboardingHousingStepQuestion(env)

	return &onboardingHousingQuestion{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Update existing onboardingResidentQuestion-item.
func (ohq *onboardingHousingQuestion) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := ohq.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// Create new onboardingResidentQuestion-item.
func (ohq *onboardingHousingQuestion) create(w http.ResponseWriter, r *http.Request) {
	doc, err := ohq.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// Get existing ess-calc-menu-item.
func (ohq *onboardingHousingQuestion) get(w http.ResponseWriter, r *http.Request) {
	doc, _, err := ohq.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	// encode(w, doc4, deps, err)
	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// List all onboarding-resident-step-items.
func (ohq *onboardingHousingQuestion) list(w http.ResponseWriter, r *http.Request) {
	filter := ParseFilter(r.URL.Query())

	docs, err := ohq.c.List(r.Context(), filter, r.Body)
	if err != nil {
		writeError(w, r, err)
	}

	w.Header().Add("Location", path.Join(r.URL.String(), "onboarding/residents/questions"))

	json.NewEncoder(w).Encode(docs)

}

// Purge onboarding-resident-step-item from db
func (ohq *onboardingHousingQuestion) delOnboardingHousingQuestion(w http.ResponseWriter, r *http.Request) {
	if err := ohq.c.DeleteHousingStepQuestion(r.Context(), mustExtractUUID(r)); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Housing onboarding step question."}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
