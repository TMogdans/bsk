package main

import (
	"github.com/TMogdans/bsk/boardgame-service/controllers"
	"log"
	"net/http"

	"github.com/TMogdans/bsk/boardgame-service/initializers"
	"github.com/gin-gonic/gin"
	"github.com/penglongli/gin-metrics/ginmetrics"
)

var (
	server *gin.Engine
)

func init() {
	config, err := initializers.LoadConfig()
	if err != nil {
		log.Fatal("Error loading config file")
	}

	initializers.ConnectDB(&config)

	server = gin.Default()
}

const (
	apiEndpoint         = "/api"
	metricsEndpoint     = "/metrics"
	healthcheckEndpoint = "/healthcheck"
	mechanicsEndpoint   = "/mechanics"
	boardgamesEndpoint  = "/boardgames"
	personsEndpoint     = "/persons"
)

func main() {
	config, err := initializers.LoadConfig()
	if err != nil {
		log.Fatal("Error loading config file")
	}

	router := server.Group("/")
	api := server.Group(apiEndpoint)

	metrics := ginmetrics.GetMonitor()
	metrics.SetMetricPath(metricsEndpoint)
	metrics.SetSlowTime(100)
	metrics.SetDuration([]float64{0.1, 0.3, 1.2, 5, 10})
	metrics.Use(router)

	api.GET(healthcheckEndpoint, func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "OK",
		})
	})

	mechanicsController := controllers.NewMechanicController(initializers.DB)

	api.GET(mechanicsEndpoint, mechanicsController.GetAllMechanics)
	api.GET(mechanicsEndpoint+"/:slug", mechanicsController.GetMechanicBySlug)
	api.POST(mechanicsEndpoint, mechanicsController.CreateMechanic)
	api.PUT(mechanicsEndpoint+"/:slug", mechanicsController.UpdateMechanic)

	boardgamesController := controllers.NewBoardgameController(initializers.DB)

	api.GET(boardgamesEndpoint, boardgamesController.GetAllBoardgames)
	api.GET(boardgamesEndpoint+"/:slug", boardgamesController.GetBoardgameBySlug)
	api.POST(boardgamesEndpoint, boardgamesController.CreateBoardgame)
	api.PUT(boardgamesEndpoint+"/:slug", boardgamesController.UpdateBoardgame)

	personsController := controllers.NewPersonController(initializers.DB)

	api.GET(personsEndpoint, personsController.GetAllPersons)
	api.GET(personsEndpoint+"/:slug", personsController.GetPersonBySlug)
	api.POST(personsEndpoint, personsController.CreatePerson)
	api.PUT(personsEndpoint+"/:slug", personsController.UpdatePersonBySlug)

	log.Fatal(server.Run(":" + config.ServerPort))
}
