package main

import (
  "net/http"
  "github.com/codegangsta/negroni"
  "github.com/gorilla/mux"
  "github.com/yosssi/gold"
  "os"
)

func main() {
  n := negroni.Classic()
  router := mux.NewRouter()

  g := gold.NewGenerator(os.Getenv("ENV") == "production")

  router.HandleFunc("/", func(resp http.ResponseWriter, req *http.Request) {
    tpl, err := g.ParseFile("./views/index.gold")
    if err != nil {
      http.Error(resp, "template parsing failed", http.StatusInternalServerError)
    } else {
      tpl.Execute(resp, nil)
    }
  }).Methods("GET")

  n.UseHandler(router)

  port := os.Getenv("PORT")
  if port == "" {
    port = "3000"
  }

  n.Run(":" + port)
}

