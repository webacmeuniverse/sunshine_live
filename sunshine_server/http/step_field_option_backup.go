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

type stepBackupFieldOption struct {
	ss sessions.Store
	st stores.Store
	c  *controller.StepBackupFieldOption
}

func newStepBackupFieldOption(env *services.Env) *stepBackupFieldOption {
	uc := controller.NewStepBackupFieldOption(env)

	return &stepBackupFieldOption{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Update existing stepBackupFieldOption-item.
func (sbfo *stepBackupFieldOption) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := sbfo.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// Create new stepBackupFieldOption-item.
// func (sbfo *stepBackupFieldOption) create(w http.ResponseWriter, r *http.Request) {
// 	doc, err := sbfo.c.Create(r.Context(), r.Body, mustExtractUUID(r))
// 	if err != nil {
// 		writeError(w, r, err)
// 		return
// 	}

// 	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

// 	json.NewEncoder(w).Encode(*doc)
// }

// Get existing stepBackupFieldOption-item.
func (sbfo *stepBackupFieldOption) get(w http.ResponseWriter, r *http.Request) {
	doc, _, err := sbfo.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	// encode(w, doc4, deps, err)
	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// List all stepBackupFieldOption-items.
func (sbfo *stepBackupFieldOption) list(w http.ResponseWriter, r *http.Request) {
	filter := ParseFilter(r.URL.Query())

	docs, deps, n, err := sbfo.c.List(r.Context(), filter)

	w.Header().Set(countHeader, strconv.Itoa(n))
	encode(w, docs, deps, err)

}

// Purge stepBackupFieldOption-item from db
func (sbfo *stepBackupFieldOption) delStepBackupFieldOption(w http.ResponseWriter, r *http.Request) {
	if err := sbfo.c.DeleteStepBackupFieldOption(r.Context(), mustExtractUUID(r)); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted step backup field option."}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
