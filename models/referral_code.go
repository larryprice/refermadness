package models

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type ReferralCode struct {
	ID        bson.ObjectId `bson:"_id"`
	UserID    bson.ObjectId `bson:"user_id"`
	ServiceID bson.ObjectId `bson:"service_id"`
	Code      string        `bson:"code"`

	// Analytics
	DateAdded      time.Time `bson:"date_added"`
	DateUpdated    time.Time `bson:"date_updated"`
	DateLastViewed time.Time `bson:"date_last_viewed"`
	Views          uint      `bson:"views"`
	Edits          uint      `bson:"edits"`
	Flags          uint      `bson:"flags"`
}

func NewReferralCode(code string, userID, serviceID bson.ObjectId) *ReferralCode {
	return &ReferralCode{
		ID:             bson.NewObjectId(),
		UserID:         userID,
		ServiceID:      serviceID,
		Code:           code,
		DateAdded:      time.Now(),
		DateUpdated:    time.Now(),
		DateLastViewed: time.Now(),
		Views:          0,
		Edits:          0,
		Flags:          0,
	}
}

func (c *ReferralCode) Save(db *mgo.Database) error {
	_, err := c.coll(db).UpsertId(c.ID, c)
	return err
}

func (c *ReferralCode) Edit(code string, db *mgo.Database) error {
	c.Code = code
	c.Edits++
	c.DateUpdated = time.Now()
	return c.Save(db)
}

func (c *ReferralCode) FindByUserAndService(userID bson.ObjectId, serviceID bson.ObjectId, db *mgo.Database) error {
	return c.coll(db).Find(bson.M{"user_id": userID, "service_id": serviceID}).One(&c)
}

func (*ReferralCode) coll(db *mgo.Database) *mgo.Collection {
	return db.C("referral_code")
}
