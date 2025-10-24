package sentry

import (
	"fmt"
	"log"
	"net/http"

	sentry "github.com/getsentry/sentry-go"
)

// Extra data for an error intended to be passed to Sentry. Arbitrary unstructured
// data which is stored with an event sample.
type Extra = map[string]interface{}

// Tags are sentry tags for an error intended to be passed to Sentry. Key-value
// tags which generate breakdowns charts and search filters.
type Tags map[string]string

// Report sends an error to Sentry. If err is nil, this func is a noop.
//
// Optionally additional context could be passed. Allowed context values are
// string (error message), Tags, Extra and func(Extra) (modifying Extra). If
// any other type is provided it will be passed as extra data under
// "__untyped__" key. This func expects not more than one of Extra and Tags,
// otherwise any subsequent of these would override previous argument of its
// type. Several func(Extra) arguments are accumulating without overwriting.
//
// See: https://docs.sentry.io/learn/context/
func Report(err error, context ...interface{}) error {
	if err == nil {
		return nil
	}

	var (
		untyped []interface{}
	)
	event := sentry.NewEvent()
	event.Level = sentry.LevelError

	for _, ctx := range context {
		switch c := ctx.(type) {
		case string:
			err = fmt.Errorf("%s: %w", c, err)
		case Tags:
			event.Tags = c
		case Extra:
			event.Extra = c
		case func(Extra):
			if event.Extra == nil {
				event.Extra = make(Extra)
			}
			c(event.Extra)
		default:
			if untyped == nil {
				untyped = make([]interface{}, 0, 1)
			}
			untyped = append(untyped, c)
		}
	}

	if len(untyped) > 0 {
		if event.Extra == nil {
			event.Extra = make(Extra)
		}
		event.Extra["__untyped__"] = untyped
	}

	log.Printf("ERROR: %s, tags: %v, extra: %#v", err, event.Tags, event.Extra)
	event.Exception = []sentry.Exception{
		{
			Type:       err.Error(),
			Stacktrace: sentry.ExtractStacktrace(err),
		},
	}
	sentry.CaptureEvent(event)

	return err
}

// CaptureRequest inserts HTTP headers and URL to extra tags of a Sentry capture.
func CaptureRequest(r *http.Request) func(Extra) {
	return func(e Extra) {
		e["http_headers"] = r.Header
		e["http_method"] = r.Method
		e["url"] = r.URL.String()
		e["content_length"] = r.ContentLength
		e["remote_addr"] = r.RemoteAddr
	}
}
