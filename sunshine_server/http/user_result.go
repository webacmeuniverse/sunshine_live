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

type userResult struct {
	ss sessions.Store
	st stores.Store
	c  *controller.UserResult
}

func newUserResult(env *services.Env) *userResult {
	uc := controller.NewUserResultItem(env)

	return &userResult{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Update existing ess-calc-menu-item.
func (ur *userResult) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := ur.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// Create new ess-calc-menu-item.
func (ur *userResult) create(w http.ResponseWriter, r *http.Request) {
	doc, err := ur.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// Get existing ess-calc-menu-item.
func (ur *userResult) get(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := ur.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	encode(w, doc, deps, err)
}

// List all user-result-items.
func (ur *userResult) list(w http.ResponseWriter, r *http.Request) {
	docs, deps, n, err := ur.c.List(r.Context(), ParseFilter(r.URL.Query()))

	w.Header().Set(countHeader, strconv.Itoa(n))
	encode(w, docs, deps, err)

}

// delete user-result
func (ur *userResult) delUserResult(w http.ResponseWriter, r *http.Request) {
	id := mustExtractUUID(r)
	if err := ur.c.DeleteUserResult(r.Context(), id); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted User Result ID: " + id.String()}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
