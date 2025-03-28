import { createLogger } from "./utils/logger";
import { MessagingService } from "./services/messagingService";
import { sql } from "slonik";
import { closeDB, getPool } from "./db/pool";
import { config } from "./config";
import app from "./app";

console.log("Hallo, ich bin der BoardGame-Service");

const logger = createLogger('server')
const messagingService = new MessagingService();

// Function to test database connection
const testDatabaseConnection = async () => {
  try {
    const pool = await getPool();
    // Verwenden des kompatiblen pool-Objekts
    await pool.query(sql.unsafe`SELECT 1`);
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    logger.error({ error }, 'Failed to connect to database');
    return false;
  }
};

// Function to test NATS connection
const connectToNats = async () => {
  try {
    await messagingService.connect();
    return true;
  } catch (error) {
    logger.error({ error }, 'Failed to connect to NATS');
    // Non-fatal if NATS is not available - service can still function without messaging
    return false;
  }
};


// Start the server
const startServer = async () => {
  try {
    // Test database connection before starting
    const dbConnected = await testDatabaseConnection();
    
    if (!dbConnected) {
      logger.error('Cannot start server: Database connection failed');
      process.exit(1);
    }
    
    // Connect to NATS (non-fatal if fails)
    await connectToNats();
    
    const server = app.listen(config.port, () => {
      logger.info(
        `🚀 Server running at http://localhost:${config.port} in ${config.env} mode`
      );
    });
    
    // Handle graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down server...');
      
      server.close(async () => {
        logger.info('HTTP server closed');
        const closeDatabase = closeDB();

        try {
          // Close NATS connection
          await messagingService.close();
          
          // Close database connections
          await closeDatabase;
          logger.info('All connections closed');
          process.exit(0);
        } catch (err) {
          logger.error({ err }, 'Error closing connections');
          process.exit(1);
        }
      });
    };
    
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

// Start the server
startServer();

export { app, startServer };
