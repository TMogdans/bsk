import {DataSource} from "typeorm";
import {Config} from "./entity/Config";
import {Rating} from "./entity/Rating";
import {Migration1714133051703} from "./migration/1714133051703-migration";
import {ConfigSeed1714134894178} from "./migration/1714134894178-config_seed";

const host = process.env.DB_HOST || "localhost"
const port = Number(process.env.DB_PORT) || 5432
const username = process.env.DB_USER || "rwuser"
const password = process.env.DB_PASSWORD || "öklsdf9"
const database = process.env.DB_NAME || "rating-write-service"


export const PostgresDataSource = new DataSource({
    type: "postgres",
    host,
    port,
    username,
    password,
    database,
    synchronize: false,
    logging: true,
    entities: [Config, Rating],
    subscribers: [],
    migrations: [Migration1714133051703, ConfigSeed1714134894178],
});

PostgresDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })