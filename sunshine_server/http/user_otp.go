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

type userOtp struct {
	ss sessions.Store
	st stores.Store
	c  *controller.UserOtp
}

func newUserOtp(env *services.Env) *userOtp {
	uc := controller.NewUserOtp(env)

	return &userOtp{
		ss: env.SessionStore,
		st: env.ProjectStore,
		c:  uc,
	}
}

// Create new step-field-option-item.
func (uo *userOtp) send(w http.ResponseWriter, r *http.Request) {
	msg, err := uo.c.SendOTP(r.Context(), r.Body)
	if err != nil {
		_msg := ErrResponse{Error: err.Error()}
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(_msg)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), msg.Token))

	json.NewEncoder(w).Encode(msg)
}

// Update existing step-field-option-item.
func (uo *userOtp) confirm(w http.ResponseWriter, r *http.Request) {
	doc, err := uo.c.ConfirmOTP(w, r)
	if err != nil {
		msg := ErrResponse{Error: err.Error()}
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(msg)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), "confirm/otp"))

	json.NewEncoder(w).Encode(doc)
}
