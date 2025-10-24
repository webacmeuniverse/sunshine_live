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

type getResultTbl1 struct {
	ss sessions.Store
	st stores.Store
	c  *controller.GetResultTbl1
}

func newGetResultTbl1(env *services.Env) *getResultTbl1 {
	uc := controller.NewGetResultTbl1(env)

	return &getResultTbl1{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Create new getResultTbl1-item.
func (grt1 *getResultTbl1) create(w http.ResponseWriter, r *http.Request) {
	docs, err := grt1.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	urlStr := "get-result-table-1"

	w.Header().Add("Location", path.Join(r.URL.String(), urlStr))

	json.NewEncoder(w).Encode(docs)
}
