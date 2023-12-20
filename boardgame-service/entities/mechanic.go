package entity

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Mechanic struct {
	ID          uuid.UUID    `gorm:"type:char(36);primary_key;" json:"-"`
	Name        string       `gorm:"type:varchar(255);not null;" json:"name"`
	Slug        string       `gorm:"type:varchar(255);not null;unique;" json:"slug"`
	Description string       `gorm:"type:text;not null;" json:"description"`
	Boardgames  []*Boardgame `gorm:"many2many:boardgames_mechanics;" json:"boardgames"`
}

func (m *Mechanic) BeforeCreate(tx *gorm.DB) (err error) {
	m.ID = uuid.New()

	return
}

type CreateMechanicRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description" binding:"required"`
}

type UpdateMechanicRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}
