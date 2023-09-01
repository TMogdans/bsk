package entity

import (
	"github.com/google/uuid"
)

type Mechanic struct {
	ID uuid.UUID `gorm:"type:char(36);primary_key;"`
	Name string `gorm:"type:varchar(255);not null;"`
	Slug string `gorm:"type:varchar(255);not null;unique;"`
	Description string `gorm:"type:text;not null;"`
	BoardGames *Boardgame `gorm:"many2many:boardgame_mechanics;"`
}
