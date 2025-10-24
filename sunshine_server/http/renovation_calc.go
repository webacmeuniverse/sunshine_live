package http

import (
	"encoding/json"
	"net/http"
	"path"

	"acme.universe/sunshine/sunshine/controller"
	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"github.com/gorilla/sessions"
)

type renovateCalcInput struct {
	ss sessions.Store
	st stores.Store
	c  *controller.RenovateCalcInput
}

func newRenovateCalcInput(env *services.Env) *renovateCalcInput {
	sc := controller.NewRenovateCalcInput(env)

	return &renovateCalcInput{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  sc,
	}
}

// List all ess-calc-menu-items. get params from uri
func (rci *renovateCalcInput) list(w http.ResponseWriter, r *http.Request) {
	res, err := rci.c.List(r.Context(), mustExtractUUID(r))

	if err != nil {
		writeError(w, r, err)
	}

	w.Header().Add("Location", path.Join(r.URL.String(), models.RenovateCalcInput{}.Kind()))
	json.NewEncoder(w).Encode(res)
}
