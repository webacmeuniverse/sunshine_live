package http

import (
	"encoding/json"
	"net/http"

	"acme.universe/sunshine/sunshine/models"
	"acme.universe/sunshine/sunshine/sentry"
	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
)

type stats struct {
	store stores.Store
}

func newStats(env *services.Env) *stats {
	return &stats{store: env.UserStore}
}

func (s *stats) getCountryStats(w http.ResponseWriter, r *http.Request) {
	var c models.Country
	if country := r.URL.Query().Get("country"); len(country) > 0 {
		c = models.Country(country)
	}

	stats, err := stores.CountryStats(r.Context(), s.store, c)
	sentry.Report(err, sentry.CaptureRequest(r))
	json.NewEncoder(w).Encode(stats)
}
