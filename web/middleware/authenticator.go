package middleware

import (
  "gopkg.in/mgo.v2/bson"
  "github.com/codegangsta/negroni"
  "github.com/larryprice/refermadness/utils"
  "github.com/larryprice/refermadness/models"
  "net/http"
)

type Authenticator struct {
  currentUser utils.CurrentUserAccessor
  database utils.DatabaseAccessor
  session utils.SessionManager
}

func NewAuthenticator(database utils.DatabaseAccessor, session utils.SessionManager, currentUser utils.CurrentUserAccessor) *Authenticator {
  return &Authenticator{currentUser, database, session}
}

func (a *Authenticator) Middleware() negroni.HandlerFunc {
  return func(rw http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
    user := new(models.User)
    userID := a.session.Get(r, "UserID")
    if bson.IsObjectIdHex(userID) && user.FindByID(bson.ObjectIdHex(userID), a.database.Get(r)) == nil {
      a.currentUser.Set(r, user)
    } else {
      a.currentUser.Clear(r)
    }
    next(rw, r)
  }
}
