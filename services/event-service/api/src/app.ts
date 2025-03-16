import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createHttpError } from 'http-errors';
import apiRoutes from './routes/eventRoutes';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config';
import { createLogger } from './utils/logger';

const logger = createLogger('app');

// Initialize express app
const app = express();

// Apply middleware
app.use(helmet());
app.use(cors());
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'event-service', timestamp: new Date().toISOString() });
});

// Application routes
app.use('/api', apiRoutes);

// 404 handler for undefined routes
app.use((req, res, next) => {
  next(createHttpError(404, `Route ${req.method} ${req.path} not found`));
});

// Error handler middleware
app.use(errorHandler);

// Export app for server and testing
export default app;