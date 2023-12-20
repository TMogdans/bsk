package entity

import (
	"time"

	"github.com/google/uuid"
)

type Boardgame struct {
	ID                 uuid.UUID   `gorm:"type:char(36);primary_key;"`
	Name               string      `gorm:"type:varchar(255);not null;"`
	Slug               string      `gorm:"type:varchar(255);not null;unique;"`
	Description        string      `gorm:"type:text;not null;"`
	MinAge             uint8       `gorm:"type:tinyint unsigned;not null;"`
	MinPlayTimeMinutes uint16      `gorm:"type:smallint unsigned;not null;"`
	MaxPlayTimeMinutes uint16      `gorm:"type:smallint unsigned;not null;"`
	MinNumberOfPlayers uint8       `gorm:"type:tinyint unsigned;not null;"`
	MaxNumberOfPlayers uint8       `gorm:"type:tinyint unsigned;not null;"`
	CreatedAt          time.Time   `gorm:"type:timestamp;not null;default:CURRENT_TIMESTAMP;"`
	UpdatedAt          time.Time   `gorm:"type:timestamp;not null;default:CURRENT_TIMESTAMP;"`
	Mechanics          []*Mechanic `gorm:"many2many:boardgames_mechanics;"`
}
