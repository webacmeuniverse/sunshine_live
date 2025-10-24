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

type organizationRating struct {
	ss sessions.Store
	st stores.Store
	c  *controller.OrganizationRating
}

func newOrganizationRating(env *services.Env) *organizationRating {
	orc := controller.NewOrganizationRating(env)

	return &organizationRating{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  orc,
	}
}

// Create new operator-rating-item.
func (or *organizationRating) create(w http.ResponseWriter, r *http.Request) {
	doc, err := or.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.Kind))

	json.NewEncoder(w).Encode(doc)
}

// List all ratings of a specific operator.
func (or *organizationRating) list(w http.ResponseWriter, r *http.Request) {
	result, err := or.c.Get(r.Context(), r.URL.Query())
	if err != nil {
		writeError(w, r, err)
		return
	}
	w.Header().Add("Location", path.Join(r.URL.String(), "operator/rating"))

	json.NewEncoder(w).Encode(result)
}
