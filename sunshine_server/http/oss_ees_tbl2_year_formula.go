package http

import (
	"encoding/json"
	"net/http"
	"path"
	"strconv"

	"acme.universe/sunshine/sunshine/controller"
	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"github.com/gorilla/sessions"
)

type ossEesResultTbl2YearFormula struct {
	ss sessions.Store
	st stores.Store
	c  *controller.OssEesResultTbl2YearFormula
}

func newOssEesResultTbl2YearFormula(env *services.Env) *ossEesResultTbl2YearFormula {
	uc := controller.NewOssEesResultTbl2YearFormula(env)

	return &ossEesResultTbl2YearFormula{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Create new ossEesResultTbl2YearFormula-item.
func (oert2yf *ossEesResultTbl2YearFormula) create(w http.ResponseWriter, r *http.Request) {
	doc, err := oert2yf.c.Create(r.Context(), r.Body, mustExtractUUID(r))
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// List all get-result-tbl2-items.
func (oert2yf *ossEesResultTbl2YearFormula) list(w http.ResponseWriter, r *http.Request) {
	docs, deps, n, err := oert2yf.c.List(r.Context(), ParseFilter(r.URL.Query()))

	w.Header().Set(countHeader, strconv.Itoa(n))
	encode(w, docs, deps, err)

}

func (oert2yf *ossEesResultTbl2YearFormula) insertMany(w http.ResponseWriter, r *http.Request) {
	docs, err := oert2yf.c.AddResultSubitems(r.Context(), r.Body, mustExtractUUID(r))

	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), models.OssEesResultTbl2YearFormula{}.Kind()))

	json.NewEncoder(w).Encode(docs)
}

// Delete Oss Ees Result Tbl2 year formula
func (oert2yf *ossEesResultTbl2YearFormula) delOssEssTbl2YearFormula(w http.ResponseWriter, r *http.Request) {
	id := mustExtractUUID(r)
	if err := oert2yf.c.DeleteOssEesResultYearFormula(r.Context(), id); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Oss Ees Result Table 2 Year Formula ID: " + id.String()}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
