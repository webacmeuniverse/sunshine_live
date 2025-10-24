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

type onboardingResidentStepBackupField struct {
	ss sessions.Store
	st stores.Store
	c  *controller.OnboardingResidentStepBackupField
}

func newOnboardingResidentStepBackupField(env *services.Env) *onboardingResidentStepBackupField {
	uc := controller.NewOnboardingResidentStepBackupField(env)

	return &onboardingResidentStepBackupField{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Update existing onboardingResidentStepBackupField-item.
func (orsbf *onboardingResidentStepBackupField) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := orsbf.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// Create new onboardingResidentStepBackupField-item.
// func (orsbf *onboardingResidentStepBackupField) create(w http.ResponseWriter, r *http.Request) {
// 	doc, err := orsbf.c.Create(r.Context(), r.Body, mustExtractUUID(r))
// 	if err != nil {
// 		writeError(w, r, err)
// 		return
// 	}

// 	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

// 	json.NewEncoder(w).Encode(*doc)
// }

// Get existing onboardingResidentStepBackupField-item.
func (orsbf *onboardingResidentStepBackupField) get(w http.ResponseWriter, r *http.Request) {
	doc, _, err := orsbf.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	// encode(w, doc4, deps, err)
	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// List all onboardingResidentStepBackupField-items.
func (orsbf *onboardingResidentStepBackupField) list(w http.ResponseWriter, r *http.Request) {
	filter := ParseFilter(r.URL.Query())

	docs, deps, n, err := orsbf.c.List(r.Context(), filter)

	w.Header().Set(countHeader, strconv.Itoa(n))
	encode(w, docs, deps, err)
}

// Purge onboardingResidentStepBackupField-item from db
func (orsbf *onboardingResidentStepBackupField) delOnboardingResidentStepBackupField(w http.ResponseWriter, r *http.Request) {
	if err := orsbf.c.DeleteOnboardingResidentFieldBackup(r.Context(), mustExtractUUID(r)); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Resident onboarding step backup field."}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
