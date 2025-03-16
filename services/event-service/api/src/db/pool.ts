import { createPool } from 'slonik';
import { config } from '../config';
import { createLogger } from '../utils/logger';

const logger = createLogger('database');

// Create connection string from config
const connectionString = `postgresql://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}`;

logger.info(`Connecting to database at ${config.db.host}:${config.db.port}/${config.db.database}`);

// Create and export the database pool
export const pool = createPool(connectionString, {
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