#!/bin/sh
set -e

echo "Starting event-service initializations..."

# Warten auf die Datenbank
echo "Waiting for Postgres to be ready..."
# Simple check with retry
for i in $(seq 1 30); do
  pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER && break
  echo "Waiting for postgres (attempt $i/30)..."
  sleep 1
done

# Fehler, wenn die Datenbank nach 30 Versuchen nicht erreichbar ist
pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER || exit 1

echo "Postgres is ready, running migrations..."

# Führe Migrationen aus
cd /app/services/event-service/api
# Stelle sicher, dass pg installiert ist
pnpm install pg --save-prod
# Führe das einfache Migration-Skript aus
node src/migrations/db-init.js

echo "Migrations completed, starting application..."

# Starte die Anwendung
exec "$@"