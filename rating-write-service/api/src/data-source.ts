import {DataSource} from "typeorm";
import {Config} from "./entity/Config";
import {Rating} from "./entity/Rating";

const host = process.env.DB_HOST || "localhost"
const port = Number(process.env.DB_PORT) || 5432
const username = process.env.DB_USER || ""
const password = process.env.DB_PASSWORD || ""
const database = process.env.DB_NAME || ""


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
    migrations: [Config, Rating],
})
