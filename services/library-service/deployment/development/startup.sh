#!/bin/sh
set -e

echo "Starting library-service initializations..."

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

# Migrations ausführen
cd /app/services/library-service/api/src/migrations
node db-init.js

echo "Migrations complete, starting application..."

# Starte die Anwendung
exec "$@"