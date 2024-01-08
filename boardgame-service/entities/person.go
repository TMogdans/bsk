package entity

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type Person struct {
	ID          uuid.UUID   `gorm:"type:char(36);primary_key;" json:"-"`
	FirstName   string      `gorm:"type:varchar(255);not null;" json:"firstName"`
	LastName    string      `gorm:"type:varchar(255);not null;" json:"lastName"`
	Slug        string      `gorm:"type:varchar(255);not null;unique;" json:"slug"`
	Description string      `gorm:"type:text;not null;" json:"description"`
	CreatedAt   time.Time   `gorm:"type:timestamp;not null;default:CURRENT_TIMESTAMP;" json:"createdAt"`
	UpdatedAt   time.Time   `gorm:"type:timestamp;not null;default:CURRENT_TIMESTAMP;" json:"updatedAt"`
	Boardgames  []Boardgame `gorm:"many2many:boardgames_persons;" json:"boardgames"`
	Links       []Link      `gorm:"many2many:persons_links;" json:"links"`
}

func (p *Person) BeforeCreate(db *gorm.DB) (err error) {
	p.ID = uuid.New()

	return
}

type CreatePersonRequest struct {
	FirstName   string `json:"firstName" binding:"required"`
	LastName    string `json:"lastName" binding:"required"`
	Description string `json:"description"`
	Boardgames  []uuid.UUID
	Links       []uuid.UUID
}

type UpdatePersonRequest struct {
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	Description string `json:"description"`
	Boardgames  []uuid.UUID
	Links       []uuid.UUID
}
