import { createPool } from 'slonik';
import { createMigrator } from '@slonik/migrator';
import { config } from '../config';
import { createLogger } from '../utils/logger';

// Import migrations
import migration1 from './01-create-base-schema';
import migration2 from './02-seed-default-types';

const logger = createLogger('migrations');

const run = async () => {
  const connectionString = `postgresql://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}`;
  
  logger.info(`Connecting to database at ${config.db.host}:${config.db.port}/${config.db.database}`);
  
  const pool = createPool(connectionString);
  
  const migrator = createMigrator({
    migrationsPath: 'migrations',
    migrationTableName: 'migration',
    slonik: pool,
    hooks: {
      beforeMigration: (migration) => {
        logger.info(`Running migration: ${migration.name}`);
      },
      afterMigration: (migration) => {
        logger.info(`Migration completed: ${migration.name}`);
      }
    }
  });

  try {
    // Define migrations
    const migrations = [migration1, migration2];
    
    // Run migrations in sequence
    for (const migration of migrations) {
      await migrator.runMigration(migration);
    }
    
    logger.info('All migrations have been completed successfully.');
  } catch (error) {
    logger.error({ error }, 'Migration failed');
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Run migrations when this file is executed directly
if (require.main === module) {
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