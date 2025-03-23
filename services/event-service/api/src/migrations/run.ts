import { Migrator } from '@pgkit/migrator';
import { config } from '../config';
import { createLogger } from '../utils/logger';
import path from 'path';
import { fileURLToPath } from 'url';

const logger = createLogger('migrations');

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define connection string from config
const connectionString = `postgresql://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}`;

// Create a migrator instance
const migrator = new Migrator({
  client: {
    connectionString
  },
  migrationsPath: path.resolve(__dirname),
  migrationTableName: 'migrations',
  // Add custom logger
  logger: {
    info: (message) => logger.info(message),
    error: (message) => logger.error(message),
    debug: (message) => logger.debug(message),
    warn: (message) => logger.warn(message)
  }
});

const run = async () => {
  try {
    logger.info(`Connecting to database at ${config.db.host}:${config.db.port}/${config.db.database}`);
    
    // Run pending migrations
    logger.info('Running migrations...');
    const result = await migrator.up();
    
    if (result.migrations.length === 0) {
      logger.info('No pending migrations to run.');
    } else {
      for (const migration of result.migrations) {
        logger.info(`Applied migration: ${migration.name}`);
      }
      logger.info(`Total migrations applied: ${result.migrations.length}`);
    }
  } catch (error) {
    logger.error({ error }, 'Migration failed');
    process.exit(1);
  }
};

// Run migrations when this file is executed directly
if (process.argv[1] === import.meta.url) {
  run()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      logger.error({ error }, 'Failed to run migrations');
      process.exit(1);
    });
}

export default run;