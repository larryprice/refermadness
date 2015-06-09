package controllers

import (
  "github.com/gorilla/mux"
  "github.com/larryprice/refermadness/utils"
  "gopkg.in/mgo.v2/bson"
  "net/http"
)

type SitemapControllerImpl struct {
  database    utils.DatabaseAccessor
}

func NewSitemapController(database utils.DatabaseAccessor) *SitemapControllerImpl {
  return &SitemapControllerImpl{
    database:    database,
  }
}

func (sc *SitemapControllerImpl) Register(router *mux.Router) {
  router.HandleFunc("/sitemap.xml", sc.generate)
}

type onlyID struct {
  ID bson.ObjectId `bson:"_id"`
}

func (sc *SitemapControllerImpl) generate(w http.ResponseWriter, r *http.Request) {
  ids := []onlyID{}
  servicesMap := ""
  if err := sc.database.Get(r).C("service").Find(nil).All(&ids); err == nil {
    for _, id := range ids {
      servicesMap += "<url><loc>https://www.refer-madness.com/service/" + id.ID.Hex() +"</loc><changefreq>weekly</changefreq></url>"
    }
  }
  w.Write([]byte(`<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<url>
  <loc>https://www.refer-madness.com/</loc>
</url>
<url>
  <loc>https://www.refer-madness.com/legal</loc>
</url>` + servicesMap + "</urlset>"))
}
