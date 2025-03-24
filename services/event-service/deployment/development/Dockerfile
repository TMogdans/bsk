FROM node:20-alpine

# Installiere PostgreSQL-Client für pg_isready
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json files for workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy the service package.json
COPY services/event-service/api/package.json ./services/event-service/api/

# Create startup script
COPY services/event-service/deployment/development/startup.sh /startup.sh
RUN chmod +x /startup.sh 

# Set working directory to service
WORKDIR /app/services/event-service/api

# Expose port
EXPOSE 3000

# Startup script wird beim Container-Start ausgeführt
ENTRYPOINT ["/startup.sh"]

# Default-Befehl, wird an den ENTRYPOINT übergeben
CMD ["pnpm", "run", "dev"]