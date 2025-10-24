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

type onboardingResidentStepBackup struct {
	ss sessions.Store
	st stores.Store
	c  *controller.OnboardingResidentStepBackup
}

func newOnboardingResidentStepBackup(env *services.Env) *onboardingResidentStepBackup {
	uc := controller.NewOnboardingResidentStepBackup(env)

	return &onboardingResidentStepBackup{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Update existing onboardingResidentStepBackup-item.
func (orsb *onboardingResidentStepBackup) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := orsb.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// Create new onboardingResidentStepBackup-item.
func (orsb *onboardingResidentStepBackup) create(w http.ResponseWriter, r *http.Request) {
	msg, err := orsb.c.Create(r.Context(), r.Body, r)
	if err != nil {
		writeError(w, r, err)
		return
	}

	success := DeleteSuccess{Message: *msg}

	w.Header().Add("Location", path.Join(r.URL.String(), *msg))
	json.NewEncoder(w).Encode(&success)
}

// Get existing onboardingResidentStepBackup-item.
func (orsb *onboardingResidentStepBackup) get(w http.ResponseWriter, r *http.Request) {
	listings, err := orsb.c.Get(r.Context(), r, r.URL.Query())
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	w.Header().Add("Location", path.Join(r.URL.String(), "get/backup"))

	json.NewEncoder(w).Encode(listings)
}

// List all onboardingResidentStepBackup-items.
func (orsb *onboardingResidentStepBackup) restore(w http.ResponseWriter, r *http.Request) {
	filter := ParseFilter(r.URL.Query())

	msg, err := orsb.c.Restore(r.Context(), r, filter, r.Body)
	if err != nil {
		writeError(w, r, err)
	}
	success := DeleteSuccess{Message: *msg}

	w.Header().Add("Location", path.Join(r.URL.String(), *msg))

	json.NewEncoder(w).Encode(success)
}

// Purge onboardingResidentStepBackup-item from db
func (orsb *onboardingResidentStepBackup) delOnboardingResidentStepBackup(w http.ResponseWriter, r *http.Request) {
	if err := orsb.c.DeleteOnboardingResidentBackup(r.Context(), mustExtractUUID(r)); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Resident onboarding step backup."}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
