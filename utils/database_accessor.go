package utils

import (
	"github.com/gorilla/context"
	"gopkg.in/mgo.v2"
	"net/http"
)

type DatabaseAccessor struct {
	*mgo.Session
	url  string
	name string
	key  int
}

func NewDatabaseAccessor(url, name string, key int) *DatabaseAccessor {
	session, _ := mgo.Dial(url)
	return &DatabaseAccessor{session, url, name, key}
}

func (d *DatabaseAccessor) Set(r *http.Request, db *mgo.Session) {
	context.Set(r, d.key, db.DB(d.name))
}

func (d *DatabaseAccessor) Get(r *http.Request) *mgo.Database {
	if rv := context.Get(r, d.key); rv != nil {
		return rv.(*mgo.Database)
	}
	return nil
}
