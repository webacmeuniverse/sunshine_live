package http

import (
	"encoding/json"
	"fmt"
	"net/http"
	"path"
	"strconv"

	"acme.universe/sunshine/sunshine/controller"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"github.com/gorilla/sessions"
)

type onboardingResidentStep struct {
	ss sessions.Store
	st stores.Store
	c  *controller.OnboardingResidentStep
}

func newOnboardingResidentStep(env *services.Env) *onboardingResidentStep {
	uc := controller.NewOnboardingResidentStep(env)

	return &onboardingResidentStep{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Update existing ess-calc-menu-item.
func (ors *onboardingResidentStep) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := ors.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// Create new onboarding-resident-item.
func (ors *onboardingResidentStep) create(w http.ResponseWriter, r *http.Request) {
	doc, err := ors.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// Get existing ess-calc-menu-item.
func (ors *onboardingResidentStep) get(w http.ResponseWriter, r *http.Request) {
	doc, deps, n, err := ors.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	w.Header().Set(countHeader, strconv.Itoa(n))
	encode(w, doc, deps, err)
}

// Get existing ess-calc-menu-item.
func (ors *onboardingResidentStep) getUserDataStep(w http.ResponseWriter, r *http.Request) {
	doc, deps, n, err := ors.c.GetUserData(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	fmt.Printf("User step data: %v\n", doc.Data)

	w.Header().Set(countHeader, strconv.Itoa(n))
	encode(w, doc, deps, err)
}

// Create new onboarding-resident-item.
func (ors *onboardingResidentStep) postUserDataAnswer(w http.ResponseWriter, r *http.Request) {
	doc, err := ors.c.CreateAnswer(r.Context(), r.Body, mustExtractUUID(r))
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// List all onboarding-resident-step-items.
func (ors *onboardingResidentStep) list(w http.ResponseWriter, r *http.Request) {
	filter := ParseFilter(r.URL.Query())

	docs, deps, n, err := ors.c.List(r.Context(), filter, r.Body)
	if err != nil {
		writeError(w, r, err)
	}
	w.Header().Set(countHeader, strconv.Itoa(n))
	encode(w, docs, deps, err)

}

// Purge onboarding-resident-step-item from db
func (ors *onboardingResidentStep) delOnboardingResidentStep(w http.ResponseWriter, r *http.Request) {
	if err := ors.c.DeleteOnboardingResident(r.Context(), mustExtractUUID(r)); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deletedResident onboarding step."}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
