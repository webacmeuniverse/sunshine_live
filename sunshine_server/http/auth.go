package http

import (
	"encoding/json"
	"fmt"
	"net/http"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/sentry"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"

	"github.com/gorilla/sessions"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/go-playground/validator.v9"
)

type login struct {
	Email    string `json:"email" validate:"email,required"`
	Password string `json:"password" validate:"required"`
}

type chpasswd struct {
	Old string `json:"old" validate:"required"`
	New string `json:"new" validate:"required"`
}

type Auth struct {
	ss sessions.Store
	us stores.Store
	os stores.Store
	ts stores.TokenStore

	validate *validator.Validate
}

func NewAuth(env *services.Env) *Auth {
	return &Auth{
		us: env.UserStore,
		ss: env.SessionStore,
		ts: env.TokenStore,
		os: env.OrganizationStore,

		validate: env.Validator,
	}
}

func comparePasswords(hash, password string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
}

func (a *Auth) login(w http.ResponseWriter, r *http.Request) {
	var (
		l           login
		orgServices []models.OrganizationServices
		// deps        stores.Dependencies
	)
	if err := json.NewDecoder(r.Body).Decode(&l); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := a.validate.Struct(l); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	doc, err := a.us.GetByIndex(r.Context(), l.Email)
	if err != nil {
		http.Error(w, "", http.StatusUnauthorized)
		// println("Login ERROR:", err.Error())
		return
	}

	user := doc.Data.(*models.User)

	if len(user.OrganizationRoles) > 0 {
		for i, role := range user.OrganizationRoles {
			fmt.Printf("org %d\n", i)
			fmt.Printf("user org id: %v\n", role.OrganizationID)
			doc, err := a.os.Get(r.Context(), role.OrganizationID)
			if err != nil {
				return
			}
			org := doc.Data.(*models.Organization)
			// fmt.Printf("Org Name: %s\n", org.Name)
			// fmt.Printf("Org Services: %s\n", org.ServicesProvided)
			// fmt.Printf("Org Summary: %s\n", org.ShortSummary)
			orgServices = append(orgServices, models.OrganizationServices{
				OrganizationName: org.Name,
				ServicesProvided: func(org models.Organization) bool {
					if org.ServicesProvided != "" {
						return true
					}
					return false
				}(*org),
				ShortSummary: func(org models.Organization) bool {
					if org.ShortSummary != "" {
						return true
					}
					return false
				}(*org),
			})
		}
		user.OrganizationServices = orgServices
	} else {
		_orgServices := []models.OrganizationServices{}
		user.OrganizationServices = _orgServices
	}

	if !user.IsActive {
		http.Error(w, "", http.StatusUnauthorized)
		return
	}

	if !comparePasswords(user.Password, l.Password) {
		http.Error(w, "", http.StatusUnauthorized)
		return
	}

	token, err := a.ts.Create(r.Context(), models.SessionToken, user.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		sentry.Report(err, "Failed to create session token")
		return
	}
	_doc := models.Wrap(user)

	// Remove any left-over cookie.
	w.Header().Del("Set-Cookie")

	// Encode and write session.
	s := services.Session(a.ss, r)
	s.Values["id"] = token.ID
	s.Values["uuid"] = _doc.ID
	services.SaveSession(s, r, w)

	// encode(w, _doc, deps, nil)
	json.NewEncoder(w).Encode(models.Wrap(user))
}

func (a *Auth) changePassword(w http.ResponseWriter, r *http.Request) {
	cv := services.FromContext(r.Context())
	if !cv.Authorized() {
		http.Error(w, "", http.StatusUnauthorized)
		return
	}

	var cp chpasswd
	if err := json.NewDecoder(r.Body).Decode(&cp); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := a.validate.Struct(cp); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if !comparePasswords(cv.User.Password, cp.Old) {
		http.Error(w, "wrong password", http.StatusBadRequest)
		return
	}

	cv.User.SetPassword(cp.New)
	if _, err := a.us.Update(r.Context(), models.Wrap(cv.User)); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		sentry.Report(err, "Failed to change password", sentry.CaptureRequest(r))
	}
}

func (a *Auth) Logout(w http.ResponseWriter, r *http.Request) {
	cv := services.FromContext(r.Context())
	a.ts.Invalidate(r.Context(), models.SessionToken, cv.ID)

	s := services.Session(a.ss, r)
	for k := range s.Values {
		delete(s.Values, k)
	}
	s.Options.MaxAge = -1
	services.SaveSession(s, r, w)
}

func (a *Auth) confirm(w http.ResponseWriter, r *http.Request) {
	var tid = mustExtractUUID(r)

	token, err := a.ts.Get(r.Context(), models.CreateToken, tid)
	if err != nil {
		http.Error(w, "", http.StatusBadRequest)
		return
	}

	udoc, err := a.us.Get(r.Context(), token.UserID)
	if err != nil {
		http.Error(w, "", http.StatusBadRequest)
		return
	}

	udoc.Data.(*models.User).IsActive = true

	if _, uerr := a.us.Update(r.Context(), udoc); uerr != nil {
		http.Error(w, "", http.StatusBadRequest)
		return
	}
}
