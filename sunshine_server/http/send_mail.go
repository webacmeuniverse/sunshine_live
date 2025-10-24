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

type sendMail struct {
	ss sessions.Store
	st stores.Store
	c  *controller.SendMail
}

func newSendMail(env *services.Env) *sendMail {
	sc := controller.NewSendMail(env)

	return &sendMail{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  sc,
	}
}

// Update existing sendMail item.
func (sm *sendMail) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := sm.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// Create new userInputData item.
func (sm *sendMail) create(w http.ResponseWriter, r *http.Request) {
	doc, err := sm.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// Get existing userInputData item.
func (sm *sendMail) get(w http.ResponseWriter, r *http.Request) {
	doc, _, err := sm.c.Get(r.Context(), mustExtractUUID(r))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}
	w.Header().Add("Location", path.Join(r.URL.String(), models.SendMail{}.Kind()))

	json.NewEncoder(w).Encode(doc)
}

// List all ess-calc-menu-items. get params from uri
func (sm *sendMail) list(w http.ResponseWriter, r *http.Request) {
	docs, deps, n, err := sm.c.List(r.Context(), ParseFilter(r.URL.Query()), r.URL.Query())

	w.Header().Set(countHeader, strconv.Itoa(n))

	encode(w, docs, deps, err)
}

// delete send mail item
func (sm *sendMail) delSendMail(w http.ResponseWriter, r *http.Request) {
	id := mustExtractUUID(r)
	if err := sm.c.DeleteSendMail(r.Context(), id); err != nil {
		writeError(w, r, err)
		return
	}

	delMsg := DeleteSuccess{Message: "Successfully deleted SendMail Object ID: " + id.String()}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}

func (sm *sendMail) upload(w http.ResponseWriter, r *http.Request) {
	file, fheader, err := r.FormFile("file")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	ut := r.FormValue("upload-type")
	kind := r.FormValue("kind")
	comment := r.FormValue("comment")

	form := controller.RequestForm{
		FileHeader: fheader,
		File:       file,
		UploadType: ut,
		Kind:       kind,
		Comment:    comment,
	}

	if err := sm.c.UploadFile(r.Context(), uuid.New(), form); err != nil {
		writeError(w, r, err)
		return
	}
	uploadMsg := DeleteSuccess{Message: "Successfully uploaded PDF file"}
	w.Header().Add("Location", path.Join(r.URL.String(), uploadMsg.Message))

	json.NewEncoder(w).Encode(uploadMsg)
}
