package http

import (
	"encoding/json"
	"net/http"
	"path"
	"strconv"

	"acme.universe/sunshine/sunshine/controller"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
)

type subscribers struct {
	st stores.Store
	c  *controller.Subscribers
}

func newSubscribers(env *services.Env) *subscribers {
	sc := controller.NewSubscribers(env)

	return &subscribers{
		st: env.Subscribers,
		c:  sc,
	}
}

// Create new userInputData item.
func (ss *subscribers) create(w http.ResponseWriter, r *http.Request) {
	doc, err := ss.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// List all subscribers. filter using params from uri
func (ss *subscribers) list(w http.ResponseWriter, r *http.Request) {
	filter := ParseFilter(r.URL.Query())

	docs, deps, n, err := ss.c.List(r.Context(), filter)

	w.Header().Set(countHeader, strconv.Itoa(n))

	encode(w, docs, deps, err)
}
