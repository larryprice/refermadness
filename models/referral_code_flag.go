package models

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type ReferralCodeFlag struct {
	ID         bson.ObjectId `bson:"_id"`
	CodeID     bson.ObjectId `bson:"code_id"`
	ReporterID bson.ObjectId `bson:"reporter_id"`

	// Analytics
	DateReported time.Time `bson:"date_reported"`
}

func NewReferralCodeFlag(codeID, userID bson.ObjectId) *ReferralCodeFlag {
	return &ReferralCodeFlag{
		ID:           bson.NewObjectId(),
		CodeID:       codeID,
		ReporterID:   userID,
		DateReported: time.Now(),
	}
}

func (c *ReferralCodeFlag) Save(db *mgo.Database) error {
	_, err := c.coll(db).UpsertId(c.ID, c)
	return err
}

func (*ReferralCodeFlag) coll(db *mgo.Database) *mgo.Collection {
	return db.C("referral_code_flag")
}
