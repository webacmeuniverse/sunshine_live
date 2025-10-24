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

type bookACall struct {
	ss sessions.Store
	st stores.Store
	c  *controller.BookACall
}

func newBookACall(env *services.Env) *bookACall {
	uc := controller.NewBookACall(env)

	return &bookACall{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Update existing userInputData item.
func (bac *bookACall) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := bac.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// Create new userInputData item.
func (bac *bookACall) create(w http.ResponseWriter, r *http.Request) {
	doc, err := bac.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// Get existing userInputData item.
func (bac *bookACall) get(w http.ResponseWriter, r *http.Request) {
	doc, _, err := bac.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// List all ess-calc-menu-items.
func (bac *bookACall) list(w http.ResponseWriter, r *http.Request) {
	docs, deps, n, err := bac.c.List(r.Context(), ParseFilter(r.URL.Query()), r.URL.Query())

	w.Header().Set(countHeader, strconv.Itoa(n))

	encode(w, docs, deps, err)
}

// add sub menu item to menu
func (bac *bookACall) delBookACall(w http.ResponseWriter, r *http.Request) {
	id := mustExtractUUID(r)
	if err := bac.c.DeleteBookACall(r.Context(), id); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Book A Call ID: " + id.String()}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
