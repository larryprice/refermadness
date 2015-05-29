package utils

import (
  "github.com/gorilla/context"
  "net/http"
  "github.com/larryprice/refermadness/models"
)

type CurrentUserAccessor struct {
  key  int
}

func NewCurrentUserAccessor(key int) *CurrentUserAccessor {
  return &CurrentUserAccessor{key}
}

func (cua *CurrentUserAccessor) Set(r *http.Request, user *models.User) {
  context.Set(r, cua.key, user)
}

func (cua *CurrentUserAccessor) Clear(r *http.Request) {
  context.Delete(r, cua.key)
}

func (cua *CurrentUserAccessor) Get(r *http.Request) *models.User {
  if rv := context.Get(r, cua.key); rv != nil {
    return rv.(*models.User)
  }
  return nil
}
