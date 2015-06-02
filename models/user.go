package models

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type User struct {
	// identification information
	ID          bson.ObjectId `bson:"_id"`
	Email       string        `bson:"email"`
	GoogleToken string        `bson:"google_token"`

	// analytics information
	SignupDate   time.Time `bson:"signup_date"`
	LastLoggedIn time.Time `bson:"last_logged_in"`
	LoginCount   uint      `bson:"login_count"`
}

func NewUser(email, token string) *User {
	return &User{
		ID:           bson.NewObjectId(),
		Email:        email,
		GoogleToken:  token,
		SignupDate:   time.Now(),
		LastLoggedIn: time.Now(),
		LoginCount:   1,
	}
}

func (u *User) Update(email, token string, db *mgo.Database) {
	u.Email = email
	u.GoogleToken = token
	u.LastLoggedIn = time.Now()
	u.LoginCount++
	u.Save(db)
}

func (u *User) Save(db *mgo.Database) error {
	_, err := u.coll(db).UpsertId(u.ID, u)
	return err
}

func (u *User) FindByEmail(email string, db *mgo.Database) error {
	return u.coll(db).Find(bson.M{"email": email}).One(u)
}

func (u *User) FindByID(id bson.ObjectId, db *mgo.Database) error {
	return u.coll(db).FindId(id).One(u)
}

func (*User) coll(db *mgo.Database) *mgo.Collection {
	return db.C("user")
}

func (u *User) Delete(db *mgo.Database) error {
	return u.coll(db).RemoveId(u.ID)
}
