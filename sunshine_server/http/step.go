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

type stepitem struct {
	ss sessions.Store
	st stores.Store
	c  *controller.StepItem
}

func newStepItem(env *services.Env) *stepitem {
	uc := controller.NewStepItem(env)

	return &stepitem{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Update existing ess-calc-menu-item.
func (c *stepitem) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := c.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// Create new ess-calc-menu-item.
func (si *stepitem) create(w http.ResponseWriter, r *http.Request) {
	doc, err := si.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	step, err := si.FieldsList(*doc.Data.(*models.StepItem))

	json.NewEncoder(w).Encode(models.Wrap(step))
}

// Get existing ess-calc-menu-item.
func (si *stepitem) get(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := si.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	step, err := si.FieldsList(doc.Data.(models.StepItem))

	encode(w, models.Wrap(step), deps, err)
}

// List all ess-calc-menu-items.
func (si *stepitem) list(w http.ResponseWriter, r *http.Request) {
	docs, deps, n, err := si.c.List(r.Context(), ParseFilter(r.URL.Query()), r.URL.Query())

	results := make([]models.Document, len(docs))

	for i, d := range docs {
		step, err1 := si.FieldsList(d.Data.(models.StepItem))
		if err1 != nil {
			writeError(w, r, err1)
		}
		doc := models.Wrap(step)
		results[i] = *doc
	}
	w.Header().Set(countHeader, strconv.Itoa(n))
	encode(w, results, deps, err)

}

// List all ess-calc-sub-menu-items.
func (c *stepitem) FieldsList(step models.StepItem) (*models.StepItem, error) {

	stepFields, err := c.c.StepFieldsList(c.st.DB(), step.ID)
	if err != nil {
		return nil, err
	}
	step.StepFields = stepFields

	return &step, nil
}

// add sub menu item to menu
func (c *stepitem) addField(w http.ResponseWriter, r *http.Request) {
	doc, err := c.c.AddStepField(r.Context(), r.Body, mustExtractUUID(r))
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(doc)
}

func (si *stepitem) delStep(w http.ResponseWriter, r *http.Request) {
	id := mustExtractUUID(r)
	if err := si.c.DeleteStep(r.Context(), id); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted Step ID: " + id.String()}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}

func (si *stepitem) delField(w http.ResponseWriter, r *http.Request) {
	id := mustExtractUUID(r)
	if err := si.c.DeleteField(r.Context(), id); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted StepField ID: " + id.String()}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}

func (si *stepitem) updateField(w http.ResponseWriter, r *http.Request) {
	if err := si.c.UpdateField(r.Context(), mustExtractUUID(r), r.Body); err != nil {
		writeError(w, r, err)
		return
	}
}
