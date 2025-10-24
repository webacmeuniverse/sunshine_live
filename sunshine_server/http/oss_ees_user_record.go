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

type ossEesUserRecord struct {
	ss sessions.Store
	st stores.Store
	c  *controller.OssEesUserRecord
}

func newOssEesUserRecord(env *services.Env) *ossEesUserRecord {
	uc := controller.NewOssEesUserRecord(env)

	return &ossEesUserRecord{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// List all ess-calc-menu-items.
func (oeur *ossEesUserRecord) list(w http.ResponseWriter, r *http.Request) {
	docs, err := oeur.c.List(r.Context(), ParseFilter(r.URL.Query()), r.URL.Query())
	if err != nil {
		writeError(w, r, err)
	}
	w.Header().Add("Location", path.Join(r.URL.String(), "/oss/ees/user/res/"))

	json.NewEncoder(w).Encode(docs)
}
