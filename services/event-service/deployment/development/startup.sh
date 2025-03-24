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

# Installiere benötigte Abhängigkeiten
echo "Installing pg package for migrations..."
pnpm install pg --save-prod

# Erstelle die Migrationsdateien
mkdir -p /app/services/event-service/api/migrations
cat > /app/services/event-service/api/migrations/db-init.js << 'EOF'
// Einfaches Skript zum Ausführen von Migrationen
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Konfig aus Umgebungsvariablen auslesen
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'events',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
};

console.log(`[INFO] Verbinden mit Datenbank ${config.host}:${config.port}/${config.database}`);

// Migration 1: Create base schema
const migration1 = `
-- Create types table
CREATE TABLE IF NOT EXISTS types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  type_id INTEGER NOT NULL REFERENCES types(id),
  begins_at TIMESTAMP NOT NULL,
  ends_at TIMESTAMP NOT NULL,
  zip VARCHAR(255),
  location VARCHAR(255),
  country VARCHAR(2) NOT NULL,
  street VARCHAR(255),
  description TEXT NOT NULL,
  barrier_free BOOLEAN NOT NULL DEFAULT false,
  entry_free BOOLEAN NOT NULL DEFAULT false,
  online_event BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT false,
  event_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by INTEGER NOT NULL
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_events_slug ON events (slug);

-- Create index on begins_at for date-based queries
CREATE INDEX IF NOT EXISTS idx_events_begins_at ON events (begins_at);

-- Create index for type filtering
CREATE INDEX IF NOT EXISTS idx_events_type_id ON events (type_id);
`;

// Migration 2: Seed default types
const migration2 = `
-- Insert default event types
INSERT INTO types (name)
VALUES 
  ('convention'),
  ('fair'),
  ('tournament'),
  ('meeting')
ON CONFLICT (name) DO NOTHING;
`;

// Funktion zum Ausführen von Migrationen
async function runMigrations() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('[INFO] Datenbankverbindung hergestellt');
    
    // Migrations-Tabelle erstellen, falls sie nicht existiert
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    // Bereits angewendete Migrationen abrufen
    const result = await client.query('SELECT name FROM migrations ORDER BY id');
    const appliedMigrations = result.rows.map(row => row.name);
    
    const migrations = [
      { name: 'V001__create_base_schema.sql', sql: migration1 },
      { name: 'V002__seed_default_types.sql', sql: migration2 }
    ];
    
    // Zähler für angewendete Migrationen
    let appliedCount = 0;
    
    // Migrationen nacheinander ausführen
    for (const migration of migrations) {
      if (appliedMigrations.includes(migration.name)) {
        console.log(`[INFO] Migration ${migration.name} bereits angewendet, überspringe`);
        continue;
      }
      
      console.log(`[INFO] Führe Migration ${migration.name} aus...`);
      
      // Transaktion für jede Migration
      await client.query('BEGIN');
      
      try {
        // SQL-Datei ausführen
        await client.query(migration.sql);
        
        // Migration als angewendet markieren
        await client.query('INSERT INTO migrations (name) VALUES ($1)', [migration.name]);
        
        await client.query('COMMIT');
        console.log(`[INFO] Migration ${migration.name} erfolgreich angewendet`);
        appliedCount++;
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`[ERROR] Fehler beim Ausführen der Migration ${migration.name}:`, err);
        throw err;
      }
    }
    
    if (appliedCount === 0) {
      console.log('[INFO] Keine neuen Migrationen zum Ausführen vorhanden');
    } else {
      console.log(`[INFO] ${appliedCount} Migration(en) erfolgreich angewendet`);
    }
  } catch (err) {
    console.error('[ERROR] Fehler bei der Migration:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Migrationen ausführen
runMigrations()
  .then(() => {
    console.log('[INFO] Migrationen abgeschlossen');
    process.exit(0);
  })
  .catch(err => {
    console.error('[ERROR] Unbehandelter Fehler:', err);
    process.exit(1);
  });
EOF

# Führe das Migrations-Skript aus
echo "Running migration script..."
node /app/services/event-service/api/migrations/db-init.js

echo "Migrations completed, starting application..."

# Starte die Anwendung
exec "$@"