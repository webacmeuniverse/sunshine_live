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

	"github.com/google/uuid"
	"github.com/gorilla/sessions"
)

type stepsResult struct {
	ss    sessions.Store
	st    stores.Store
	c     *controller.StepsResult
	c_v_i string
	c_v_x string
	t_v_i string
	t_v_x string
}

func newStepsResult(env *services.Env) *stepsResult {
	uc := controller.NewStepsResultItem(env)

	return &stepsResult{
		ss:    env.SessionStore,
		st:    env.ProjectStore,
		c:     uc,
		c_v_i: "COST_VAT_INC",
		c_v_x: "COST_VAT_XCL",
		t_v_i: "TOTAL_VAT_INC",
		t_v_x: "TOTAL_VAT_XCL",
	}
}

// Update existing ess-calc-menu-item.
func (sr *stepsResult) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := sr.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// Create new ess-calc-menu-item.
func (sr *stepsResult) create(w http.ResponseWriter, r *http.Request) {
	doc, err := sr.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// Get existing ess-calc-menu-item.
func (sr *stepsResult) get(w http.ResponseWriter, r *http.Request) {
	doc, _, err := sr.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	sr.addSubItems(doc, sr.c_v_i)
	sr.addSubItems(doc, sr.c_v_x)
	sr.addSubItems(doc, sr.t_v_i)
	sr.addSubItems(doc, sr.t_v_x)

	// encode(w, doc4, deps, err)
	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

// createSubObjects to create multiple objects
func (sr *stepsResult) createSubObjects(w http.ResponseWriter, r *http.Request) {
	results, err := sr.c.AddResultSubitems(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
	}
	w.Header().Add("Location", path.Join(r.URL.String(), results[0].Kind()))

	json.NewEncoder(w).Encode(results)
}

// Create new ess-calc-menu-item.
func (sr *stepsResult) createSubObject(w http.ResponseWriter, r *http.Request) {
	doc, _, err := sr.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	result := doc.Data.(*models.StepsResult)

	subItem, errSub := sr.c.AddResultSubitem(r.Context(), r.Body, result.ID)
	if errSub != nil {
		w.WriteHeader(http.StatusNotModified)
		writeError(w, r, errSub)
		return
	}
	switch subItem.CostType {
	case sr.c_v_i:
		result.CostVatInc = append(result.CostVatInc, *subItem)
	case sr.c_v_x:
		result.CostVatXcl = append(result.CostVatXcl, *subItem)
	case sr.t_v_i:
		result.TotalVatInc = append(result.TotalVatInc, *subItem)
	case sr.t_v_x:
		result.TotalVatXcl = append(result.TotalVatXcl, *subItem)
	}

	doc.Data = result

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// List all ess-calc-menu-items.
func (sr *stepsResult) list(w http.ResponseWriter, r *http.Request) {
	_docs, deps, n, err := sr.c.List(r.Context(), ParseFilter(r.URL.Query()), r.URL.Query())

	w.Header().Set(countHeader, strconv.Itoa(n))
	encode(w, _docs, deps, err)

}

func (sr *stepsResult) addSubItems(doc *models.Document, cost string) {
	_step := doc.Data.(*models.StepsResult)
	fields, _ := sr.SubList(cost, _step.ID)
	switch cost {
	case "COST_VAT_INC":
		_step.CostVatInc = fields
	case "COST_VAT_XCL":
		_step.CostVatXcl = fields
	case "TOTAL_VAT_INC":
		_step.TotalVatInc = fields
	case "TOTAL_VAT_XCL":
		_step.TotalVatXcl = fields
	}
	doc.Data = _step
}

// List all ess-calc-sub-menu-items.
func (sr *stepsResult) SubList(costType string, stepID uuid.UUID) ([]models.ResultSubObject, error) {

	resultSubList, err := sr.c.ResultSubList(costType, stepID)
	if err != nil {
		return nil, err
	}

	return resultSubList, nil
}

// add sub menu item to menu
func (sr *stepsResult) delStepResult(w http.ResponseWriter, r *http.Request) {
	id := mustExtractUUID(r)
	if err := sr.c.DeleteStepsResult(r.Context(), id); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Step Result ID: " + id.String()}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}

func (sr *stepsResult) delField(w http.ResponseWriter, r *http.Request) {
	id := mustExtractUUID(r)
	if err := sr.c.DeleteField(r.Context(), id); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Step Field ID: " + id.String()}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}

// func (si *stepitem) updateField(w http.ResponseWriter, r *http.Request) {
// 	if err := si.c.UpdateField(r.Context(), mustExtractUUID(r), r.Body); err != nil {
// 		writeError(w, r, err)
// 		return
// 	}
// }
