FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json files for workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy the service package.json
COPY services/event-service/api/package.json ./services/event-service/api/

# Set working directory to service
WORKDIR /app/services/event-service/api

# Install dependencies for the service
RUN pnpm install

# Expose port
EXPOSE 3000

# No CMD here - we use command in docker-compose.yml instead