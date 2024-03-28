import {DataSource} from "typeorm";
import {Category} from "./entity/Category";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || "library",
    synchronize: true,
    logging: true,
    entities: ["entity/*.ts"],
    subscribers: [],
    migrations: [],
})
