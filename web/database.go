package web

import (
  "github.com/codegangsta/negroni"
  "gopkg.in/mgo.v2"
  "net/http"
  "github.com/gorilla/context"
)

type Database struct {
  *mgo.Session
  url      string
  name     string
  db       int
}

func NewDatabase(url, name string, key int) *Database {
  session, _ := mgo.Dial(url)
  return &Database{session, url, name, key}
}

func (da *Database) Set(r *http.Request, db *mgo.Database) {
  context.Set(r, da.db, db)
}

func (da *Database) Get(r *http.Request) *mgo.Database {
  if rv := context.Get(r, da.db); rv != nil {
    return rv.(*mgo.Database)
  }
  return nil
}

func (d *Database) Middleware() negroni.HandlerFunc {
  return func(rw http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
    reqSession := d.Clone()
    defer reqSession.Close()
    d.Set(r, reqSession.DB(d.name))
    next(rw, r)
  }
}
