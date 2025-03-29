import helmet from "helmet";
import { createLogger } from "./utils/logger";
import express from 'express';
import morgan from "morgan";
import { config } from "./config";
import cors from 'cors';
import createHttpError from 'http-errors';
import { errorHandler } from "./middleware/errorHandler";
import awardRoutes from "./routes/awardRoutes";
import boardGameRoutes from "./routes/boardGameRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import personRoutes from "./routes/personRoutes";
import mechanicRoutes from "./routes/mechanicRoutes";
import publisherRoutes from "./routes/publisherRoutes";

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
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'library-service', timestamp: new Date().toISOString() });
});

app.use('/api', awardRoutes);
app.use('/api', boardGameRoutes);
app.use('/api', categoryRoutes);
app.use('/api', mechanicRoutes);
app.use('/api', personRoutes)
app.use('/api', publisherRoutes);


// 404 handler for undefined routes
app.use((req, _res, next) => {
  next(createHttpError(404, `Route ${req.method} ${req.path} not found`));
});

// Error handler middleware
app.use(errorHandler);

export default app;