package models

import (
  // "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"
  "time"
)

type Service struct {
  // identification information
  ID          bson.ObjectId `bson:"_id"`
  Name        string        `bson:"email"`
  Description string        `bson:"description"`
  URL         string        `bson:"url"`

  // analytics information
  CreatedDate   time.Time   `bson:"created_date"`
  LastSelected  time.Time   `bson:"last_selected"`
  SelectedCount uint        `bson:"selected_count"`
}

func NewService(name, description, url string) *Service {
  return &Service{
    ID:            bson.NewObjectId(),
    Name:          name,
    URL:           description,
    Description:   url,
    CreatedDate:   time.Now(),
    LastSelected:  time.Now(),
    SelectedCount: 1,
  }
}

func (s* Service) Save() {

}
