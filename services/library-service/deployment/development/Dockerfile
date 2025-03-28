FROM node:20-alpine

# Installiere PostgreSQL-Client für pg_isready
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json files for workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy the service package.json
COPY services/library-service/api/package.json ./services/library-service/api/

# Install dependencies
RUN pnpm install

# Create startup script
COPY services/library-service/deployment/development/startup.sh /startup.sh
RUN chmod +x /startup.sh 

# Copy source code and migrations
COPY services/library-service/api/src ./services/library-service/api/src

# Ensure migrations directory exists
RUN mkdir -p /app/services/library-service/api/src/migrations

# Copy migration files
COPY services/library-service/api/src/migrations/*.sql services/library-service/api/src/migrations/*.js /app/services/library-service/api/src/migrations/

# Set working directory to service
WORKDIR /app/services/library-service/api

# Expose port
EXPOSE 3000

# Startup script wird beim Container-Start ausgeführt
ENTRYPOINT ["/startup.sh"]

# Default-Befehl, wird an den ENTRYPOINT übergeben
CMD ["pnpm", "run", "dev"]