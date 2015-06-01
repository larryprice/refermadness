package utils

import (
	"net/http"
)

type BasePageCreator interface {
	Get(*http.Request) BasePage
}

type BasePageCreatorImpl struct {
	currentUser CurrentUserAccessor
}

func NewBasePageCreator(currentUser CurrentUserAccessor) *BasePageCreatorImpl {
	return &BasePageCreatorImpl{
		currentUser: currentUser,
	}
}

type BasePage struct {
	LoggedIn bool
	Username string
}

func (bp *BasePageCreatorImpl) Get(r *http.Request) BasePage {
	if user := bp.currentUser.Get(r); user != nil {
		return BasePage{
			LoggedIn: user != nil,
			Username: user.Email,
		}
	}
	return BasePage{
		LoggedIn: false,
		Username: "",
	}
}
