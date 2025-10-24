package http

import (
	"encoding/json"
	"net/http"
	"path"

	"acme.universe/sunshine/sunshine/controller"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
)

type energyCertCategory struct {
	st stores.Store
	c  *controller.EnergyCertCategory
}

func NewEnergyCertCategory(env *services.Env) *energyCertCategory {
	eccc := controller.NewEnergyCertCategory(env)

	return &energyCertCategory{
		st: env.EnergyCertCategoryStore,
		c:  eccc,
	}
}

// Create new energy cert details item.
func (ecc *energyCertCategory) create(w http.ResponseWriter, r *http.Request) {
	doc, err := ecc.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// Get existing energy cert details item.
func (ecc *energyCertCategory) get(w http.ResponseWriter, r *http.Request) {
	docs, err := ecc.c.Get(r.Context(), r.URL.Query())
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	w.Header().Add("Location", path.Join(r.URL.String(), "energy/cert/category"))

	json.NewEncoder(w).Encode(docs)
}

func (ecc *energyCertCategory) update(w http.ResponseWriter, r *http.Request) {
	doc, err := ecc.c.Update(r.Context(), r.Body, r.URL.Query())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// delete energy cert details item
func (ecc *energyCertCategory) delEnergyCertCategory(w http.ResponseWriter, r *http.Request) {
	if err := ecc.c.DeleteEnergyCategory(r.Context(), r.URL.Query()); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Energy cert category"}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
