FROM postgres:16-alpine

# Copy initialization script
COPY init-db.sh /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/init-db.sh

# This healthcheck will be available for docker-compose to ensure DB is ready
HEALTHCHECK --interval=5s --timeout=5s --retries=5 CMD pg_isready -U postgres