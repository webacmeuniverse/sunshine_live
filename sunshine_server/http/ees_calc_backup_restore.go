package http

import (
	"encoding/json"
	"net/http"
	"path"
	"strconv"

	"acme.universe/sunshine/sunshine/controller"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
)

type eesCalcBackup struct {
	// ss sessions.Store
	st stores.Store
	c  *controller.EesCalcBackup
}

func newEesCalcBackup(env *services.Env) *eesCalcBackup {
	cont := controller.NewEesCalcBackup(env)

	return &eesCalcBackup{
		st: env.StepBackupStore,
		c:  cont,
	}
}

// Create new eesCalcBackup item.
func (ecb *eesCalcBackup) create(w http.ResponseWriter, r *http.Request) {
	success, err := ecb.c.Create(r.Context(), r)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), *&success.Message))

	json.NewEncoder(w).Encode(*success)
}

// List all ess-calc-menu-items.
func (ecb *eesCalcBackup) list(w http.ResponseWriter, r *http.Request) {
	backups, err := ecb.c.List(r.Context(), r)

	if err != nil {
		writeError(w, r, err)
		return
	}

	// w.Header().Set(countHeader, strconv.Itoa(len(backups)))
	// encode(w, docs, deps, err)

	w.Header().Add("Location", path.Join(r.URL.String(), strconv.Itoa(len(backups))))

	json.NewEncoder(w).Encode(backups)
}

// Restore existing userInputData item.
func (ecb *eesCalcBackup) restore(w http.ResponseWriter, r *http.Request) {
	success, err := ecb.c.Restore(r.Context(), r)
	if err != nil {
		writeError(w, r, err)
		return
	}

	w.Header().Add("Location", path.Join(r.URL.String(), *&success.Message))

	json.NewEncoder(w).Encode(success)
}
