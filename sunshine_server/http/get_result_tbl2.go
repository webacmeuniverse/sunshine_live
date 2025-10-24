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

type getResultTbl2 struct {
	ss sessions.Store
	st stores.Store
	c  *controller.GetResultTbl2
}

func newGetResultTbl2(env *services.Env) *getResultTbl2 {
	uc := controller.NewGetResultTbl2(env)

	return &getResultTbl2{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Create new getResultTbl2-item.
func (grt2 *getResultTbl2) create(w http.ResponseWriter, r *http.Request) {
	docs, err := grt2.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}
	w.Header().Add("Location", path.Join(r.URL.String(), "getResults"))
	json.NewEncoder(w).Encode(docs)
}

// Create new getResultTbl2 nested-item.
func (grt2 *getResultTbl2) createYearValue(w http.ResponseWriter, r *http.Request) {
	getResultTbl2, err := grt2.c.CreateYearValue(r.Context(), r.Body, mustExtractUUID(r))
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), getResultTbl2.ID.String()))

	json.NewEncoder(w).Encode(getResultTbl2)
}

// Update existing get-result-tbl2-item.
func (grt2 *getResultTbl2) update(w http.ResponseWriter, r *http.Request) {
	_doc, deps, err := grt2.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}
	doc := grt2.addYearValues(_doc)

	encode(w, doc, deps, err)
}

// Get existing get-result-tbl2-item.
func (grt2 *getResultTbl2) get(w http.ResponseWriter, r *http.Request) {
	_doc, _, err := grt2.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}
	doc := grt2.addYearValues(_doc)

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// List all get-result-tbl2-items.
func (grt2 *getResultTbl2) list(w http.ResponseWriter, r *http.Request) {
	docs, deps, n, err := grt2.c.List(r.Context(), ParseFilter(r.URL.Query()))

	for _, _doc := range docs {
		_ = grt2.addYearValues(&_doc)
	}

	w.Header().Set(countHeader, strconv.Itoa(n))
	encode(w, docs, deps, err)

}

// add sub menu item to menu
func (grt2 *getResultTbl2) delGetResult(w http.ResponseWriter, r *http.Request) {
	id := mustExtractUUID(r)
	if err := grt2.c.DeleteGetResult(r.Context(), id); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Get Result Table 2 ID: " + id.String()}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}

func (grt2 *getResultTbl2) addYearValues(doc *models.Document) models.Document {
	result := doc.Data.(*models.GetResultTbl2)
	yearValues, err := grt2.c.YearValueList(grt2.st.DB(), result.ID)
	if err != nil {
		return *doc
	}
	result.YearValue = yearValues

	doc.Data = result
	return *doc
}
