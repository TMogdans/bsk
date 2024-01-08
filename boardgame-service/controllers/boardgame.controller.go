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

type BoardgameController struct {
	DB *gorm.DB
}

func NewBoardgameController(db *gorm.DB) *BoardgameController {
	return &BoardgameController{DB: db}
}

func (bc *BoardgameController) CreateBoardgame(ctx *gin.Context) {
	var payload *entity.CreateBoardgameRequest

	err := ctx.ShouldBindJSON(&payload)
	if err != nil {
		log.Println("Error binding JSON:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": "Invalid request payload"})
		return
	}

	newBoardgame := entity.Boardgame{
		Name:               payload.Name,
		Slug:               slug.MakeLang(payload.Name, "de"),
		Description:        payload.Description,
		MinAge:             payload.MinAge,
		MinPlayTimeMinutes: payload.MinPlayTimeMinutes,
		MaxPlayTimeMinutes: payload.MaxPlayTimeMinutes,
		MinNumberOfPlayers: payload.MinNumberOfPlayers,
		MaxNumberOfPlayers: payload.MaxNumberOfPlayers,
	}

	result := bc.DB.Create(&newBoardgame)
	if result.Error != nil {
		if strings.Contains(result.Error.Error(), "Duplicate entry") {
			log.Println("Error creating boardgame:", result.Error)
			ctx.JSON(http.StatusConflict, gin.H{"status": "fail", "message": "Boardgame with that slug already exists"})
			return
		}
		log.Println("Error creating boardgame:", result.Error)
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": "Failed to create boardgame"})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"status": "success", "data": newBoardgame})
}

func (bc *BoardgameController) GetAllBoardgames(ctx *gin.Context) {
	var boardgames []entity.Boardgame

	page := 1
	limit := 10
	offset := (page - 1) * limit

	result := bc.DB.Preload("Mechanics").Offset(offset).Limit(limit).Order("Name ASC").Find(&boardgames)
	if result.Error != nil {
		log.Println("Error fetching boardgames:", result.Error)
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": "Failed to fetch boardgames"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": boardgames})
}

func (bc *BoardgameController) GetBoardgameBySlug(ctx *gin.Context) {
	var boardgame entity.Boardgame

	result := bc.DB.Preload("Mechanics").Where("slug = ?", ctx.Param("slug")).First(&boardgame)
	if result.Error != nil {
		log.Println("Error fetching boardgame:", result.Error)
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": "Failed to fetch boardgame"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": boardgame})
}

func (bc *BoardgameController) UpdateBoardgame(ctx *gin.Context) {
	var payload *entity.UpdateBoardgameRequest

	err := ctx.ShouldBindJSON(&payload)
	if err != nil {
		log.Println("Error binding JSON:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	var boardgame entity.Boardgame

	result := bc.DB.Where("slug = ?", ctx.Param("slug")).First(&boardgame)
	if result.Error != nil {
		log.Println("Error fetching boardgame:", result.Error)
		ctx.JSON(http.StatusNotFound, gin.H{"status": "fail", "message": "Boardgame not found"})
		return
	}

	boardgame.Name = payload.Name
	boardgame.Slug = slug.MakeLang(payload.Name, "de")
	boardgame.Description = payload.Description
	boardgame.MinAge = payload.MinAge
	boardgame.MinPlayTimeMinutes = payload.MinPlayTimeMinutes
	boardgame.MaxPlayTimeMinutes = payload.MaxPlayTimeMinutes
	boardgame.MinNumberOfPlayers = payload.MinNumberOfPlayers
	boardgame.MaxNumberOfPlayers = payload.MaxNumberOfPlayers

	result = bc.DB.Save(&boardgame)
	if result.Error != nil {
		log.Println("Error updating boardgame:", result.Error)
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": "Failed to update boardgame"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": boardgame})
}
