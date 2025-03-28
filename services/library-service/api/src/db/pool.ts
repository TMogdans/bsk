import {
    type DatabasePool,
    createBigintTypeParser,
    createDateTypeParser,
    createIntervalTypeParser,
    createNumericTypeParser,
    createPool,
} from "slonik";
import { requireEnv } from "./env"

const initializeDatabase = async (): Promise<DatabasePool> => {
    const dsn = `postgresql://${requireEnv("DB_USER")}:${requireEnv("DB_PASSWORD")}@${requireEnv("DB_HOST")}:${requireEnv("DB_PORT")}/${requireEnv("DB_DATABASE")}`;
    const pool = createPool(dsn, {
        typeParsers: [
            createBigintTypeParser(),
            createDateTypeParser(),
            createIntervalTypeParser(),
            createNumericTypeParser(),
        ],

        captureStackTrace: true,
    });

    await new Promise((resolve) => setTimeout(resolve, 3000));

    return pool;
};

let DATABASE_POOL: DatabasePool | null = null;

const getPool = async (): Promise<DatabasePool> => {
    if (!DATABASE_POOL) {
        DATABASE_POOL = await initializeDatabase();
    }

    return DATABASE_POOL;
};

const closeDB = async (): Promise<void> => {
    if (DATABASE_POOL) {
        await DATABASE_POOL.end();
        DATABASE_POOL = null;
    }
};
export { getPool, closeDB };
