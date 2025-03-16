FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json files for workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy the service package.json
COPY services/event-service/api/package.json ./services/event-service/api/

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY services/event-service ./services/event-service

# Set working directory to service
WORKDIR /app/services/event-service/api

# Expose port
EXPOSE 3000

# Run the service in development mode
CMD ["pnpm", "run", "dev"]