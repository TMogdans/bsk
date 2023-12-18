package controllers

import (
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
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	newMechanic := entity.Mechanic{
		Name:        payload.Name,
		Slug:        slug.MakeLang(payload.Name, "de"),
		Description: payload.Description,
	}

	result := pc.DB.Create(&newMechanic)
	if result.Error != nil {
		if strings.Contains(result.Error.Error(), "duplicate key") {
			ctx.JSON(http.StatusConflict, gin.H{"status": "fail", "message": "Mechanic with that slug already exists"})
			return
		}
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": result.Error.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"status": "success", "data": newMechanic})
}

func (pc *MechanicController) GetAllMechanics(ctx *gin.Context) {
	var mechanics []entity.Mechanic

	result := pc.DB.Find(&mechanics)
	if result.Error != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": result.Error.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": mechanics})
}
