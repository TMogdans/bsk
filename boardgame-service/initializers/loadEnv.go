package initializers

import (
	"os"

	"github.com/joho/godotenv"
)

type DBConfig struct {
	Host     	string
	Port     	string
	User     	string
	Password 	string
	Dbname   	string
	ServerPort 	string
}

func LoadConfig() (config DBConfig, err error) {
	err = godotenv.Load()
	if err != nil {
		return
	}

	config = DBConfig{
		Host:     	os.Getenv("BOARDGAME_DB_HOST"),
		Port:     	os.Getenv("BOARDGAME_DB_PORT"),
		User:     	os.Getenv("BOARDGAME_DB_USERNAME"),
		Password: 	os.Getenv("BOARDGAME_DB_PASSWORD"),
		Dbname:     os.Getenv("BOARDGAME_DB_DATABASE"),
		ServerPort: os.Getenv("BOARDGAME_SERVER_PORT"),
	}

	return
}