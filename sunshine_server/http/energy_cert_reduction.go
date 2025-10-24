package http

import (
	"encoding/json"
	"net/http"
	"path"

	"acme.universe/sunshine/sunshine/controller"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
)

type energyCertReduction struct {
	st stores.Store
	c  *controller.EnergyCertReduction
}

func NewEnergyCertReduction(env *services.Env) *energyCertReduction {
	eccc := controller.NewEnergyCertReduction(env)

	return &energyCertReduction{
		st: env.EnergyCertReductionStore,
		c:  eccc,
	}
}

// Create new energy cert details item.
func (ecr *energyCertReduction) create(w http.ResponseWriter, r *http.Request) {
	doc, err := ecr.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// Get existing energy cert details item.
func (ecr *energyCertReduction) get(w http.ResponseWriter, r *http.Request) {
	certs, err := ecr.c.Get(r.Context(), r.URL.Query())
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	w.Header().Add("Location", path.Join(r.URL.String(), "energy/cert/reduction"))

	json.NewEncoder(w).Encode(certs)
}

func (ecc *energyCertReduction) update(w http.ResponseWriter, r *http.Request) {
	doc, err := ecc.c.Update(r.Context(), r.Body, r.URL.Query())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// delete energy cert details item
func (ecc *energyCertReduction) delEnergyCertReduction(w http.ResponseWriter, r *http.Request) {
	if err := ecc.c.DeleteEnergyReduction(r.Context(), r.URL.Query()); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Energy cert reduction"}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
