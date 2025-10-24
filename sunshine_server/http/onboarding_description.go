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

type onboardingDescription struct {
	ss sessions.Store
	st stores.Store
	c  *controller.OnboardingDescription
}

func newOnboardingDescription(env *services.Env) *onboardingDescription {
	orc := controller.NewOnboardingDescription(env)

	return &onboardingDescription{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  orc,
	}
}

// Create new onboarding-description-item.
func (od *onboardingDescription) create(w http.ResponseWriter, r *http.Request) {
	doc, err := od.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.Kind))

	json.NewEncoder(w).Encode(doc)
}

// List all descriptions of a oss
func (od *onboardingDescription) list(w http.ResponseWriter, r *http.Request) {
	result, err := od.c.List(r.Context(), r.URL.Query())
	if err != nil {
		writeError(w, r, err)
		return
	}
	w.Header().Add("Location", path.Join(r.URL.String(), models.OnboardingDescription{}.Key()))

	json.NewEncoder(w).Encode(result)
}
