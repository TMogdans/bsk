package main

import (
	"fmt"
	"log"

	entity "github.com/TMogdans/bsk/boardgame-service/entities"
	"github.com/TMogdans/bsk/boardgame-service/initializers"
)

func init() {
	var config, err = initializers.LoadConfig()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	initializers.ConnectDB(&config)
}

func main() {
	initializers.DB.AutoMigrate(&entity.Mechanic{})
	initializers.DB.AutoMigrate(&entity.Boardgame{})
	fmt.Println("? Migrations completed")
}