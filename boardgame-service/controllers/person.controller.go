package controllers

import (
	entity "github.com/TMogdans/bsk/boardgame-service/entities"
	"github.com/gin-gonic/gin"
	"github.com/gosimple/slug"
	"gorm.io/gorm"
	"log"
	"net/http"
	"strings"
)

type PersonController struct {
	DB *gorm.DB
}

func NewPersonController(db *gorm.DB) *PersonController {
	return &PersonController{DB: db}
}

func (pc *PersonController) CreatePerson(ctx *gin.Context) {
	var payload *entity.CreatePersonRequest

	err := ctx.ShouldBindJSON(&payload)
	if err != nil {
		log.Println("Error binding JSON:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": "Invalid request payload"})
		return
	}

	newPerson := entity.Person{
		FirstName:   payload.FirstName,
		LastName:    payload.LastName,
		Slug:        slug.MakeLang(payload.FirstName+" "+payload.LastName, "de"),
		Description: payload.Description,
	}

	result := pc.DB.Create(&newPerson)
	if result.Error != nil {
		if strings.Contains(result.Error.Error(), "Duplicate entry") {
			log.Println("Error creating person:", result.Error)
			ctx.JSON(http.StatusConflict, gin.H{"status": "fail", "message": "Person with that slug already exists"})
			return
		}
		log.Println("Error creating person:", result.Error)
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": "Failed to create person"})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"status": "success", "data": newPerson})
}

func (pc *PersonController) GetAllPersons(ctx *gin.Context) {
	var persons []entity.Person

	page := 1
	limit := 10
	offset := (page - 1) * limit

	result := pc.DB.Preload("Boardgames").Preload("Links").Limit(limit).Offset(offset).Order("last_name ASC").Find(&persons)
	if result.Error != nil {
		log.Println("Error fetching persons:", result.Error)
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": "Failed to fetch persons"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": persons})
}

func (pc *PersonController) GetPersonBySlug(ctx *gin.Context) {
	var person entity.Person

	result := pc.DB.Where("slug = ?", ctx.Param("slug")).Preload("Boardgames").Preload("Links").First(&person)
	if result.Error != nil {
		log.Println("Error fetching person:", result.Error)
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": "Failed to fetch person"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": person})
}

func (pc *PersonController) UpdatePersonBySlug(ctx *gin.Context) {
	var person entity.Person
	var payload *entity.UpdatePersonRequest

	result := pc.DB.Where("slug = ?", ctx.Param("slug")).Preload("Boardgames").Preload("Links").First(&person)
	if result.Error != nil {
		log.Println("Error fetching person:", result.Error)
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": "Failed to fetch person"})
		return
	}

	err := ctx.ShouldBindJSON(&payload)
	if err != nil {
		log.Println("Error binding JSON:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": "Invalid request payload"})
		return
	}

	person.FirstName = payload.FirstName
	person.LastName = payload.LastName
	person.Description = payload.Description

	result = pc.DB.Save(&person)
	if result.Error != nil {
		log.Println("Error updating person:", result.Error)
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": "Failed to update person"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": person})
}
