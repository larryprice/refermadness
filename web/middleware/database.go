package middleware

import (
	"github.com/codegangsta/negroni"
	"github.com/larryprice/refermadness/utils"
	"net/http"
)

type Database struct {
	da utils.DatabaseAccessor
}

func NewDatabase(da utils.DatabaseAccessor) *Database {
	return &Database{da}
}

func (d *Database) Middleware() negroni.HandlerFunc {
	return func(rw http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
		reqSession := d.da.Clone()
		defer reqSession.Close()
		d.da.Set(r, reqSession)
		next(rw, r)
	}
}
