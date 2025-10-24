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

type onboardingResidentQuestionBackup struct {
	ss sessions.Store
	st stores.Store
	c  *controller.OnboardingResidentStepBackupQuestion
}

func newOnboardingResidentQuestionBackup(env *services.Env) *onboardingResidentQuestionBackup {
	uc := controller.NewOnboardingResidentStepBackupQuestion(env)

	return &onboardingResidentQuestionBackup{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Update existing onboardingResidentQuestion-item.
func (orqb *onboardingResidentQuestionBackup) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := orqb.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// Create new onboardingResidentQuestion-item.
// func (orqb *onboardingResidentQuestionBackup) create(w http.ResponseWriter, r *http.Request) {
// 	err := orqb.c.Create(r.Context())
// 	if err != nil {
// 		writeError(w, r, err)
// 		return
// 	}

// 	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

// 	json.NewEncoder(w).Encode(*doc)
// }

// Get existing onboardingResidentQuestionBackup-item.
func (orqb *onboardingResidentQuestionBackup) get(w http.ResponseWriter, r *http.Request) {
	doc, _, err := orqb.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	// encode(w, doc4, deps, err)
	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// List all onboardingResidentQuestionBackup-items.
func (orqb *onboardingResidentQuestionBackup) list(w http.ResponseWriter, r *http.Request) {
	filter := ParseFilter(r.URL.Query())

	docs, err := orqb.c.List(r.Context(), filter, r.Body)
	if err != nil {
		writeError(w, r, err)
	}

	w.Header().Add("Location", path.Join(r.URL.String(), "onboarding/residents/questions"))

	json.NewEncoder(w).Encode(docs)

}

// Purge onboardingResidentQuestionBackup-item from db
func (orqb *onboardingResidentQuestionBackup) delOnboardingResidentQuestionBackup(w http.ResponseWriter, r *http.Request) {
	if err := orqb.c.DeleteResidentStepBackupQuestion(r.Context(), mustExtractUUID(r)); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Resident onboarding step question backup."}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
