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

type userResultBasic struct {
	ss sessions.Store
	st stores.Store
	c  *controller.UserResultBasic
}

func newUserResultBasic(env *services.Env) *userResultBasic {
	uc := controller.NewUserResultBasic(env)

	return &userResultBasic{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Update existing ess-calc-menu-item.
func (urb *userResultBasic) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := urb.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// Create new ess-calc-menu-item.
func (urb *userResultBasic) create(w http.ResponseWriter, r *http.Request) {
	doc, err := urb.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// Get existing ess-calc-menu-item.
func (urb *userResultBasic) get(w http.ResponseWriter, r *http.Request) {
	doc, _, err := urb.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	doc1 := urb.addCalcItems(*doc)

	w.Header().Add("Location", path.Join(r.URL.String(), doc1.ID.String()))

	json.NewEncoder(w).Encode(doc1)
}

// Create new ess-calc-menu-item.
func (urb *userResultBasic) createCalcObject(w http.ResponseWriter, r *http.Request) {
	basicDetsID := mustExtractUUID(r)
	doc, _, err := urb.c.Get(r.Context(), basicDetsID)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	result := doc.Data.(*models.UserBasicDetails)

	calcItem, errCalc := urb.c.AddResultCalaculation(r.Context(), r.Body, result.Session, basicDetsID)
	if errCalc != nil {
		w.WriteHeader(http.StatusNotModified)
		writeError(w, r, err)
		return
	}

	result.CalculationInput = append(result.CalculationInput, *calcItem)

	doc.Data = result

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// List all ess-calc-menu-items.
func (urb *userResultBasic) list(w http.ResponseWriter, r *http.Request) {
	docs, deps, n, err := urb.c.List(r.Context(), ParseFilter(r.URL.Query()))

	w.Header().Set(countHeader, strconv.Itoa(n))

	var docRes []models.Document

	for _, d := range docs {
		doc := urb.addCalcItems(d)
		docRes = append(docRes, doc)
	}

	encode(w, docRes, deps, err)
}

func (urb *userResultBasic) addCalcItems(doc models.Document) models.Document {
	_urb := doc.Data.(*models.UserBasicDetails)
	fields, _ := urb.SubList(_urb.Session)
	_urb.CalculationInput = fields
	doc.Data = _urb
	return doc
}

// List all ess-calc-sub-menu-items.
func (urb *userResultBasic) SubList(sessionID string) ([]models.UserResultCalculation, error) {

	urbCalcList, err := urb.c.ResultCalculationList(urb.st.DB(), sessionID)
	if err != nil {
		return nil, err
	}

	return urbCalcList, nil
}

// add sub menu item to menu
func (urb *userResultBasic) delUserResultBasic(w http.ResponseWriter, r *http.Request) {
	id := mustExtractUUID(r)
	if err := urb.c.DeleteUserResult(r.Context(), id); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted User Result Basic ID: " + id.String()}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}

func (urb *userResultBasic) delUserCalc(w http.ResponseWriter, r *http.Request) {
	id := mustExtractUUID(r)
	if err := urb.c.DeleteUserCalculation(r.Context(), id); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted User Calculation ID: " + id.String()}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
