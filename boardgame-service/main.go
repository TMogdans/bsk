package main

import (
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

func main() {
	config, err := initializers.LoadConfig()
	if err != nil {
		log.Fatal("Error loading config file")
	}

	router := server.Group("/")
	api := server.Group("/api")

	metrics := ginmetrics.GetMonitor()
	metrics.SetMetricPath("/metrics")
	metrics.SetSlowTime(100)
	metrics.SetDuration([]float64{0.1, 0.3, 1.2, 5, 10})
	metrics.Use(router)

	api.GET("/healthcheck", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "OK",
		})
	})

	log.Fatal(server.Run(":" + config.ServerPort))
}