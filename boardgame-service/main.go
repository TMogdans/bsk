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

	api.GET(mechanicsEndpoint, func(ctx *gin.Context) {
		mechanicsController.GetAllMechanics(ctx)

		ctx.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "OK",
		})
	})
	api.POST(mechanicsEndpoint, func(ctx *gin.Context) {
		mechanicsController.CreateMechanic(ctx)

		ctx.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "OK",
		})
	})

	log.Fatal(server.Run(":" + config.ServerPort))
}
