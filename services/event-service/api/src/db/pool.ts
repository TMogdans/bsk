import { createPool, type DatabasePool, sql, type SqlFragment, type PrimitiveValueExpression, type QueryResult, type Connection, type SqlTag } from 'slonik';
import { createPgDriverFactory } from '@slonik/pg-driver';
import { config } from '../config';
import { createLogger } from '../utils/logger';

const logger = createLogger('database');

// Create connection string from config
const connectionString = `postgresql://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}`;

logger.info(`Connecting to database at ${config.db.host}:${config.db.port}/${config.db.database}`);

// Initialisierung des Pools als Promise
export const poolPromise = createPool(connectionString, {
  driverFactory: createPgDriverFactory(),
  maximumPoolSize: 20,
  idleTimeout: 30000,
  connectionTimeout: 5000,
  
  interceptors: [
    {
      // Log queries in development
      afterPoolConnection: async (_, connection) => {
        if (config.env === 'development') {
          logger.debug('Established new database connection');
        }
        return null;
      },
      queryExecutionError: async (_, query, error) => {
        logger.error({ query: query.sql, error }, 'Query execution error');
        return null;
      },
      beforeQueryExecution: async (_, query) => {
        if (config.env === 'development') {
          logger.debug({ query: query.sql }, 'Executing query');
        }
        return null;
      }
    }
  ]
});

// Globales Pool-Objekt für einfachen Zugriff
let _pool: DatabasePool | null = null;

// Hilfsfunktion zum Abrufen des Pools
export async function getPool(): Promise<DatabasePool> {
  if (_pool === null) {
    _pool = await poolPromise;
  }
  return _pool;
}

// Definition eines vereinfachten Typs für die Connection-Callback-Funktion
type ConnectionCallback<T> = (connection: Connection) => Promise<T>;

// Für Rückwärtskompatibilität mit dem bestehenden Code
export const pool = {
  // Typsichere Query-Methode
  async query<T extends ReadonlyArray<PrimitiveValueExpression> = ReadonlyArray<PrimitiveValueExpression>>(
    sqlQuery: SqlTag | SqlFragment, 
    ...args: T
  ): Promise<QueryResult<any>> {
    const dbPool = await getPool();
    return dbPool.query(sqlQuery, ...args);
  },
  
  // Typsichere Connect-Methode
  async connect<T>(callback: ConnectionCallback<T>): Promise<T> {
    const dbPool = await getPool();
    return dbPool.connect(callback);
  },
  
  // Für den Anwendungs-Shutdown
  async end() {
    if (_pool) {
      await _pool.end();
      _pool = null;
    }
  }
};