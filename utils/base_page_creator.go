package utils

import (
	"net/http"
)

type BasePageCreator interface {
	Get(*http.Request) BasePage
}

type BasePageCreatorImpl struct {
	currentUser CurrentUserAccessor
	gaKey       string
}

func NewBasePageCreator(currentUser CurrentUserAccessor, gaKey string) *BasePageCreatorImpl {
	return &BasePageCreatorImpl{
		currentUser: currentUser,
		gaKey:       gaKey,
	}
}

type BasePage struct {
	LoggedIn     bool
	Username     string
	AnalyticsKey string
}

func (bp *BasePageCreatorImpl) Get(r *http.Request) BasePage {
	if user := bp.currentUser.Get(r); user != nil {
		return BasePage{
			LoggedIn:     user != nil,
			Username:     user.Email,
			AnalyticsKey: bp.gaKey,
		}
	}
	return BasePage{
		LoggedIn:     false,
		Username:     "",
		AnalyticsKey: bp.gaKey,
	}
}
