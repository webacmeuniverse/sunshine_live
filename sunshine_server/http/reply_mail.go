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

type replyMail struct {
	ss sessions.Store
	st stores.Store
	c  *controller.ReplyMail
}

func newReplyMail(env *services.Env) *replyMail {
	sc := controller.NewReplyMail(env)

	return &replyMail{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  sc,
	}
}

// Update existing replyMail item.
func (rm *replyMail) update(w http.ResponseWriter, r *http.Request) {
	doc, deps, err := rm.c.Update(r.Context(), mustExtractUUID(r), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	encode(w, doc, deps, err)
}

// Create new userInputData item.
func (rm *replyMail) create(w http.ResponseWriter, r *http.Request) {
	doc, err := rm.c.Create(r.Context(), r.Body)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), doc.ID.String()))

	json.NewEncoder(w).Encode(*doc)
}

// Get existing userInputData item.
func (rm *replyMail) get(w http.ResponseWriter, r *http.Request) {
	msgs, err := rm.c.Get(r.Context(), r.Body)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
	}
	w.Header().Add("Location", path.Join(r.URL.String(), models.ReplyMail{}.Kind()))

	json.NewEncoder(w).Encode(msgs)
}

// List all ess-calc-menu-items. get params from uri
func (rm *replyMail) list(w http.ResponseWriter, r *http.Request) {
	filter := ParseFilter(r.URL.Query())
	OssAdminID := r.URL.Query().Get("oss_admin_id")
	filter.OssAdminID = OssAdminID

	docs, deps, n, err := rm.c.List(r.Context(), filter)

	w.Header().Set(countHeader, strconv.Itoa(n))

	encode(w, docs, deps, err)
}

// delete send mail item
func (rm *replyMail) delReplyMail(w http.ResponseWriter, r *http.Request) {
	id := mustExtractUUID(r)
	if err := rm.c.DeleteReplyMail(r.Context(), id); err != nil {
		writeError(w, r, err)
		return
	}
	delMsg := DeleteSuccess{Message: "Successfully deleted ReplyMail Object ID: " + id.String()}
	w.Header().Add("Location", path.Join(r.URL.String(), delMsg.Message))

	json.NewEncoder(w).Encode(delMsg)
}
