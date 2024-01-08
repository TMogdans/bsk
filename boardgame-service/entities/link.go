package entity

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type Link struct {
	ID        uuid.UUID `gorm:"type:char(36);primary_key;" json:"-"`
	Name      string    `gorm:"type:varchar(255);not null;" json:"name"`
	Url       string    `gorm:"type:varchar(255);not null;" json:"url"`
	CreatedAt time.Time `gorm:"type:timestamp;not null;default:CURRENT_TIMESTAMP;" json:"createdAt"`
	UpdatedAt time.Time `gorm:"type:timestamp;not null;default:CURRENT_TIMESTAMP;" json:"updatedAt"`
}

func (l *Link) BeforeCreate(db *gorm.DB) (err error) {
	l.ID = uuid.New()

	return
}

type CreateLinkRequest struct {
	Name string `json:"name" binding:"required"`
	Url  string `json:"url" binding:"required"`
}

type UpdateLinkRequest struct {
	Name string `json:"name" binding:"required"`
	Url  string `json:"url" binding:"required"`
}
