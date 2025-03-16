###
# Build stage
###
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json files for workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy the service package.json
COPY services/event-service/api/package.json ./services/event-service/api/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY services/event-service ./services/event-service

# Build the application
WORKDIR /app/services/event-service/api
RUN pnpm run build

###
# Production stage
###
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json files
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/services/event-service/api/package.json ./services/event-service/api/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=builder /app/services/event-service/api/dist ./services/event-service/api/dist

# Set working directory to service
WORKDIR /app/services/event-service/api

# Environment variables
ENV NODE_ENV=production

# Run as non-root user
USER node

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]