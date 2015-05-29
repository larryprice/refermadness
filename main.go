package main

import (
	"github.com/larryprice/refermadness/utils"
	"github.com/larryprice/refermadness/web"
	"github.com/stretchr/graceful"
	"os"
)

func main() {
	isDevelopment := os.Getenv("ENVIRONMENT") == "development"
	dbURL := os.Getenv("MONGOLAB_URI")
	if isDevelopment {
		dbURL = os.Getenv("DB_PORT_27017_TCP_ADDR")
	}

	dbAccessor := utils.NewDatabaseAccessor(dbURL, os.Getenv("DATABASE_NAME"), 0)
	cuAccessor := utils.NewCurrentUserAccessor(1)
	s := web.NewServer(*dbAccessor, *cuAccessor, os.Getenv("GOOGLE_OAUTH2_CLIENT_ID"),
		os.Getenv("GOOGLE_OAUTH2_CLIENT_SECRET"), os.Getenv("SESSION_SECRET"), isDevelopment)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	graceful.Run(":"+port, 0, s)
}
