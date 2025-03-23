FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json files for workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy the service package.json
COPY services/library-service/api/package.json ./services/library-service/api/

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY services/library-service ./services/library-service

# Set working directory to service
WORKDIR /app/services/library-service/api

# Expose port
EXPOSE 3000

# Use ts-node for development instead of the missing dev script
CMD ["npx", "ts-node", "src/index.ts"]