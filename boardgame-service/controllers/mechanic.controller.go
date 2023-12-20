package controllers

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/gosimple/slug"
	"gorm.io/gorm"

	entity "github.com/TMogdans/bsk/boardgame-service/entities"
)

type MechanicController struct {
	DB *gorm.DB
}

func NewMechanicController(db *gorm.DB) *MechanicController {
	return &MechanicController{DB: db}
}

func (pc *MechanicController) CreateMechanic(ctx *gin.Context) {
	var payload *entity.CreateMechanicRequest

	err := ctx.ShouldBindJSON(&payload)
	if err != nil {
		log.Println("Error binding JSON:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": "Invalid request payload"})
		return
	}

	newMechanic := entity.Mechanic{
		Name:        payload.Name,
		Slug:        slug.MakeLang(payload.Name, "de"),
		Description: payload.Description,
	}

	result := pc.DB.Create(&newMechanic)
	if result.Error != nil {
		if strings.Contains(result.Error.Error(), "Duplicate entry") {
			log.Println("Error creating mechanic:", result.Error)
			ctx.JSON(http.StatusConflict, gin.H{"status": "fail", "message": "Mechanic with that slug already exists"})
			return
		}
		log.Println("Error creating mechanic:", result.Error)
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": "Failed to create mechanic"})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"status": "success", "data": newMechanic})
}

func (pc *MechanicController) GetAllMechanics(ctx *gin.Context) {
	var mechanics []entity.Mechanic

	page := 1
	limit := 10
	offset := (page - 1) * limit

	result := pc.DB.Offset(offset).Limit(limit).Find(&mechanics)
	if result.Error != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": result.Error.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": mechanics, "page": page, "limit": limit})
}

func (pc *MechanicController) GetMechanicBySlug(ctx *gin.Context) {
	var mechanic entity.Mechanic

	result := pc.DB.Where("slug = ?", ctx.Param("slug")).Preload("Boardgames").First(&mechanic)
	if result.Error != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"status": "fail", "message": "Mechanic not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": mechanic})
}

func (pc *MechanicController) UpdateMechanic(ctx *gin.Context) {
	var payload *entity.UpdateMechanicRequest

	err := ctx.ShouldBindJSON(&payload)
	if err != nil {
		log.Println("Error binding JSON:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	var mechanic entity.Mechanic

	result := pc.DB.Where("slug = ?", ctx.Param("slug")).First(&mechanic)
	if result.Error != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"status": "fail", "message": "Mechanic not found"})
		return
	}

	mechanic.Name = payload.Name
	mechanic.Description = payload.Description

	result = pc.DB.Save(&mechanic)
	if result.Error != nil {
		log.Println("Error updating mechanic:", result.Error)
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": result.Error.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": mechanic})
}
