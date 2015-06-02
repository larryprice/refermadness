package models

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"strings"
	"time"
)

type Service struct {
	// identification information
	ID          bson.ObjectId `bson:"_id"`
	Name        string        `bson:"email"`
	Description string        `bson:"description"`
	URL         string        `bson:"url"`
	Search      string        `bson:"search"`

	// analytics information
	CreatedDate   time.Time     `bson:"created_date"`
	LastSelected  time.Time     `bson:"last_selected"`
	SelectedCount uint          `bson:"selected_count"`
	CreatedBy     bson.ObjectId `bson:"created_by"`
}

func NewService(name, description, url string, creatorID bson.ObjectId) *Service {
	return &Service{
		ID:            bson.NewObjectId(),
		Name:          name,
		URL:           description,
		Description:   url,
		CreatedDate:   time.Now(),
		LastSelected:  time.Now(),
		SelectedCount: 1,
		CreatedBy:     creatorID,
		Search:        strings.ToLower(name) + ";" + strings.ToLower(description) + ";" + strings.ToLower(url),
	}
}

func (s *Service) Save(db *mgo.Database) error {
	_, err := s.coll(db).UpsertId(s.ID, s)
	return err
}

func (s *Service) FindByID(id bson.ObjectId, db *mgo.Database) error {
	return s.coll(db).FindId(id).One(s)
}

func (s *Service) WasSelected(db *mgo.Database) error {
	s.SelectedCount++
	s.LastSelected = time.Now()
	return s.Save(db)
}

func (*Service) coll(db *mgo.Database) *mgo.Collection {
	return db.C("service")
}

type Services []Service

func (s *Services) FindRelevant(query string, limit, skip int, db *mgo.Database) (int, error) {
	q := s.coll(db).Find(bson.M{"search": &bson.RegEx{Pattern: strings.ToLower(query)}})
	total, _ := q.Count()
	return total, q.Skip(skip).Limit(limit).All(s)
}

func (*Services) coll(db *mgo.Database) *mgo.Collection {
	return db.C("service")
}
