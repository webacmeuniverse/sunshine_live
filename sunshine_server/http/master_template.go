package http

import (
	"encoding/json"
	"net/http"
	"path"
	"strconv"

	"acme.universe/sunshine/sunshine/controller"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"github.com/google/uuid"
	"github.com/gorilla/sessions"
)

type masterTemplate struct {
	ss sessions.Store
	st stores.Store
	c  *controller.MasterTemplateStep
}

func newMasterTemplate(env *services.Env) *masterTemplate {
	uc := controller.NewMasterTemplateStep(env)

	return &masterTemplate{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Create new master-temp-item.
func (mt *masterTemplate) create(w http.ResponseWriter, r *http.Request) {
	if err := mt.c.CreateTemplate(r.Context(), r.Body); err != nil {
		writeError(w, r, err)
		return
	}

	okMsg := DeleteSuccess{Message: "Template Created"}

	w.Header().Add("Location", path.Join(r.URL.String(), okMsg.Message))

	json.NewEncoder(w).Encode(okMsg)
}

// Get existing ess-calc-menu-item.
func (mt *masterTemplate) get(w http.ResponseWriter, r *http.Request) {
	docs, deps, n, err := mt.c.GetTemplate(r.Context(), ParseFilter(r.URL.Query()))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	w.Header().Set(countHeader, strconv.Itoa(n))
	encode(w, docs, deps, err)
}

// Purge master-temp-item from db
func (mt *masterTemplate) delMasterTemp(w http.ResponseWriter, r *http.Request) {
	var ID uuid.UUID = mustExtractUUID(r)
	if err := mt.c.DeleteMasterStep(r.Context(), ID); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Master Template." + ID.String()}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
