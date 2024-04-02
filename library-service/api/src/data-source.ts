import {DataSource} from "typeorm";

const host = process.env.DB_HOST || "localhost"
const port = Number(process.env.DB_PORT) || 5432
const username = process.env.DB_USER || "citizix_user"
const password = process.env.DB_PASSWORD || "S3cret"
const database = process.env.DB_NAME || "postgres"


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
