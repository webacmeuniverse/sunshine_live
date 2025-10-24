package http

import (
	"net/http"

	"acme.universe/sunshine/sunshine/controller"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
	"github.com/gorilla/sessions"
)

type gdpr struct {
	store   stores.Store
	session sessions.Store
	c       *controller.GDPR

	uploadPath string
}

func newGDPR(env *services.Env) *gdpr {
	return &gdpr{
		session:    env.SessionStore,
		store:      env.GDPRStore,
		c:          controller.NewGDPR(env),
		uploadPath: env.Paths.Uploads,
	}
}

func (g *gdpr) upload(w http.ResponseWriter, r *http.Request) {
	uploadFile(w, r, g.session, g.store, g.uploadPath)
}

func (g *gdpr) getFile(w http.ResponseWriter, r *http.Request) {
	getFile(w, r, g.store, g.uploadPath)
}

func (g *gdpr) delFile(w http.ResponseWriter, r *http.Request) {
	delFile(w, r, g.store)
}
