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

type ossAdminsList struct {
	ss sessions.Store
	st stores.Store
	c  *controller.OssAdminsList
}

func newOssAdminsList(env *services.Env) *ossAdminsList {
	uc := controller.NewOssAdminsList(env)

	return &ossAdminsList{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// List all oss admins
func (oal *ossAdminsList) list(w http.ResponseWriter, r *http.Request) {
	admins, err := oal.c.List(r.Context(), ParseFilter(r.URL.Query()))
	if err != nil {
		writeError(w, r, err)
	}
	w.Header().Add("Location", path.Join(r.URL.String(), "oss/admin/list"))

	json.NewEncoder(w).Encode(admins)
}

// List all users that selected an oss-admin.
func (oal *ossAdminsList) users(w http.ResponseWriter, r *http.Request) {
	docs, err := oal.c.Users(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
	}

	w.Header().Add("Location", path.Join(r.URL.String(), docs[0].ID.String()))

	json.NewEncoder(w).Encode(docs)
}

// oss admin count for the dashboard
func (oal *ossAdminsList) counts(w http.ResponseWriter, r *http.Request) {
	dashCounts, err := oal.c.Counts(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), "dashboard/count"))

	json.NewEncoder(w).Encode(dashCounts)
}
