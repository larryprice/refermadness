package models

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type Analytics struct {
}

type deletedUser struct {
	*User
	DeletedDate time.Time `bson:"deleted_date"`
	CodeCount   int       `bson:"code_count"`
}

func (a *Analytics) AddDeletedUser(u *User, db *mgo.Database) {
	db.C("analytics.deleted_user").Insert(deletedUser{u, time.Now(), 0})
}

type search struct {
	ID     bson.ObjectId `bson:"_id"`
	Query  string        `bson:"query"`
	Limit  int           `bson:"limit"`
	UserID bson.ObjectId `bson:"user_id"`
	Date   time.Time     `bson:"date"`
}

func (a *Analytics) AddSearch(query string, limit int, userID bson.ObjectId, db *mgo.Database) {
	db.C("analytics.search").Insert(search{bson.NewObjectId(), query, limit, userID, time.Now()})
}
