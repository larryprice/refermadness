package main

import (
	"github.com/larryprice/refermadness/web"
	"github.com/stretchr/graceful"
	"os"
)

func main() {
  db := web.NewDatabase(os.Getenv("DB_PORT_27017_TCP_ADDR"), os.Getenv("DATABASE_NAME"), 0)
	s := web.NewServer(*db, os.Getenv("GOOGLE_OAUTH2_CLIENT_ID"), os.Getenv("GOOGLE_OAUTH2_CLIENT_SECRET"),
                     os.Getenv("ENVIRONMENT") == "development")

  port := os.Getenv("PORT")
  if port == "" {
    port = "3000"
  }
	graceful.Run(":"+port, 0, s)
}
