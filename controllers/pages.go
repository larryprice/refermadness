package controllers

import (
  "github.com/larryprice/refermadness/models"
)

type Page struct {
  LoggedIn bool
}

type AccountPage struct {
  Page
  User     *models.User
}
