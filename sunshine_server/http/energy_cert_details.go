package http

import (
	"encoding/json"
	"net/http"
	"path"

	"acme.universe/sunshine/sunshine/controller"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
)

type energyCertDetails struct {
	st stores.Store
	c  *controller.EnergyCertDetails
}

func newEnergyCertDetail(env *services.Env) *energyCertDetails {
	ecdc := controller.NewEnergyCertDetails(env)

	return &energyCertDetails{
		st: env.EnergyCertDetailsStore,
		c:  ecdc,
	}
}

// Create new energy cert details item.
func (ecd *energyCertDetails) create(w http.ResponseWriter, r *http.Request) {
	doc, err := ecd.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// Get existing energy cert details item.
func (ecd *energyCertDetails) get(w http.ResponseWriter, r *http.Request) {
	doc, err := ecd.c.Get(r.Context(), r.URL.Query())
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// update cert detail
func (ecd *energyCertDetails) update(w http.ResponseWriter, r *http.Request) {
	doc, err := ecd.c.Update(r.Context(), r.Body, r.URL.Query())
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// delete energy cert details item
func (ecd *energyCertDetails) delEnergyCertDetail(w http.ResponseWriter, r *http.Request) {
	if err := ecd.c.DeleteEnergyCert(r.Context(), r.URL.Query()); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Energy cert details"}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
