package entity

import (
	"gorm.io/gorm"
	"time"

	"github.com/google/uuid"
)

type Boardgame struct {
	ID                 uuid.UUID   `gorm:"type:char(36);primary_key;" json:"-"`
	Name               string      `gorm:"type:varchar(255);not null;" json:"name" binding:"required"`
	Slug               string      `gorm:"type:varchar(255);not null;unique;" json:"slug"`
	Description        string      `gorm:"type:text;" json:"description"`
	MinAge             uint8       `gorm:"type:tinyint unsigned;" json:"minAge"`
	MinPlayTimeMinutes uint16      `gorm:"type:smallint unsigned;" json:"minPlayTimeMinutes"`
	MaxPlayTimeMinutes uint16      `gorm:"type:smallint unsigned;" json:"maxPlayTimeMinutes"`
	MinNumberOfPlayers uint8       `gorm:"type:tinyint unsigned;" json:"minNumberOfPlayers"`
	MaxNumberOfPlayers uint8       `gorm:"type:tinyint unsigned;" json:"maxNumberOfPlayers"`
	CreatedAt          time.Time   `gorm:"type:timestamp;not null;default:CURRENT_TIMESTAMP;" json:"createdAt"`
	UpdatedAt          time.Time   `gorm:"type:timestamp;not null;default:CURRENT_TIMESTAMP;" json:"updatedAt"`
	Mechanics          []*Mechanic `gorm:"many2many:boardgames_mechanics;" json:"mechanics"`
}

func (b *Boardgame) BeforeCreate(tx *gorm.DB) (err error) {
	b.ID = uuid.New()

	return
}

type CreateBoardgameRequest struct {
	Name               string `json:"name" binding:"required"`
	Description        string `json:"description"`
	MinAge             uint8  `json:"minAge"`
	MinPlayTimeMinutes uint16 `json:"minPlayTimeMinutes"`
	MaxPlayTimeMinutes uint16 `json:"maxPlayTimeMinutes"`
	MinNumberOfPlayers uint8  `json:"minNumberOfPlayers"`
	MaxNumberOfPlayers uint8  `json:"maxNumberOfPlayers"`
	Mechanics          []uuid.UUID
}

type UpdateBoardgameRequest struct {
	Name               string `json:"name"`
	Description        string `json:"description"`
	MinAge             uint8  `json:"minAge"`
	MinPlayTimeMinutes uint16 `json:"minPlayTimeMinutes"`
	MaxPlayTimeMinutes uint16 `json:"maxPlayTimeMinutes"`
	MinNumberOfPlayers uint8  `json:"minNumberOfPlayers"`
	MaxNumberOfPlayers uint8  `json:"maxNumberOfPlayers"`
	Mechanics          []uuid.UUID
}
