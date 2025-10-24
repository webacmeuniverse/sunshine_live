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

type supportAPI struct {
	ss sessions.Store
	st stores.Store
	c  *controller.SupportAPI
}

func newSupportAPI(env *services.Env) *supportAPI {
	uc := controller.NewSupportAPI(env)

	return &supportAPI{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// update existing support-api item.
func (as *supportAPI) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := as.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// create new support-api object.
func (as *supportAPI) create(w http.ResponseWriter, r *http.Request) {
	doc, err := as.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// get existing support api item.
func (as *supportAPI) get(w http.ResponseWriter, r *http.Request) {
	doc, _, err := as.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// List all support api objects.
func (as *supportAPI) list(w http.ResponseWriter, r *http.Request) {
	docs, deps, n, err := as.c.List(r.Context(), ParseFilter(r.URL.Query()), r.URL.Query())

	w.Header().Set(countHeader, strconv.Itoa(n))

	encode(w, docs, deps, err)
}

// delSupportAPI to delete support api object
func (as *supportAPI) delSupportAPI(w http.ResponseWriter, r *http.Request) {
	id := mustExtractUUID(r)
	if err := as.c.DeleteSupportAPI(r.Context(), id); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Support API ID: " + id.String()}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
