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

type setDefaultTemp struct {
	ss sessions.Store
	st stores.Store
	c  *controller.SetDefaultTemp
}

func newSetDefaultTemp(env *services.Env) *setDefaultTemp {
	uc := controller.NewSetDefaultTemp(env)

	return &setDefaultTemp{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Create new onboarding-step-item.
func (sdt *setDefaultTemp) create(w http.ResponseWriter, r *http.Request) {
	msgs, err := sdt.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), msgs[0].Message))

	json.NewEncoder(w).Encode(msgs)
}

// Create new ess-calc-menu-item.
func (sdt *setDefaultTemp) createEss(w http.ResponseWriter, r *http.Request) {
	msg, err := sdt.c.CreateEss(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}
	w.Header().Add("Location", path.Join(r.URL.String(), msg[0].Message))

	json.NewEncoder(w).Encode(msg)
}
