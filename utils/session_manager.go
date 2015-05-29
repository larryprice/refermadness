package utils

import (
	"github.com/goincremental/negroni-sessions"
	"net/http"
)

type SessionManager interface {
	Get(*http.Request, string) string
	Set(*http.Request, string, string)
	Delete(*http.Request, string)
}

type SessionManagerImpl struct {
}

func NewSessionManager() *SessionManagerImpl {
	return &SessionManagerImpl{}
}

func (sa *SessionManagerImpl) Get(req *http.Request, key string) string {
	if val := sessions.GetSession(req).Get(key); val != nil {
		return val.(string)
	}

	return ""
}

func (sa *SessionManagerImpl) Set(req *http.Request, key, value string) {
	sessions.GetSession(req).Set(key, value)
}

func (sa *SessionManagerImpl) Delete(req *http.Request, key string) {
	sessions.GetSession(req).Delete(key)
}
