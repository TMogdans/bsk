import {DataSource} from "typeorm";

const host = process.env.DB_HOST || "localhost"
const port = Number(process.env.DB_PORT) || 5432
const username = process.env.DB_USER || "rwuser"
const password = process.env.DB_PASSWORD || "öklsdf9"
const database = process.env.DB_NAME || "rating-write-service"


export const AppDataSource = new DataSource({
    type: "postgres",
    host,
    port,
    username,
    password,
    database,
    synchronize: true,
    logging: true,
    entities: ["dist/entity/*.js"],
    subscribers: [],
    migrations: ["dist/migration/*.js"],
})
