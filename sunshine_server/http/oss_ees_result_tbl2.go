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

type ossEesResultTbl2 struct {
	ss sessions.Store
	st stores.Store
	c  *controller.OssEesResultTbl2
}

func newOssEesResultTbl2(env *services.Env) *ossEesResultTbl2 {
	uc := controller.NewOssEesResultTbl2(env)

	return &ossEesResultTbl2{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Create new getResultTbl2-item.
func (oert2 *ossEesResultTbl2) create(w http.ResponseWriter, r *http.Request) {
	_doc, err := oert2.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}
	doc := oert2.addYearFormulas(*_doc.Data.(*models.OssEesResultTbl2))

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// Update existing get-result-tbl2-item.
func (oert2 *ossEesResultTbl2) update(w http.ResponseWriter, r *http.Request) {
	_doc, _, err := oert2.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}
	doc := oert2.addYearFormulas(*_doc.Data.(*models.OssEesResultTbl2))

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// Get existing get-result-tbl2-item.
func (oert2 *ossEesResultTbl2) get(w http.ResponseWriter, r *http.Request) {
	_doc, _, err := oert2.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}
	doc := oert2.addYearFormulas(*_doc.Data.(*models.OssEesResultTbl2))

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// List all get-result-tbl2-items.
func (oert2 *ossEesResultTbl2) list(w http.ResponseWriter, r *http.Request) {
	var docs []models.Document
	results, err := oert2.c.List(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
	}

	for _, res := range results {
		docs = append(docs, *models.Wrap(res))
	}
	w.Header().Add("Location", path.Join(r.URL.String(), "results/list"))

	json.NewEncoder(w).Encode(docs)

}

// add sub menu item to menu
func (oert2 *ossEesResultTbl2) delOssEssResult(w http.ResponseWriter, r *http.Request) {
	id := mustExtractUUID(r)
	if err := oert2.c.DeleteOssEesResult(r.Context(), id); err != nil {
		writeError(w, r, err)
		return
	}
	delMsg := DeleteSuccess{Message: "Successfully deleted Oss Ees Result Table 2 ID: " + id.String()}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}

func (oert2 *ossEesResultTbl2) addYearFormulas(result models.OssEesResultTbl2) models.OssEesResultTbl2 {
	yearFormulas, err := oert2.c.YearFormulaList(result.ID)
	if err != nil {
		return result
	}
	result.YearFormula = yearFormulas

	return result
}
