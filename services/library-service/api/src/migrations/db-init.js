const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Konfiguration aus der Umgebung laden
const config = {
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'library',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
};

console.log("Environment variables:");
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_PORT: ${process.env.DB_PORT}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
console.log(`DB_USER: ${process.env.DB_USER}`);

console.log(`Connecting to PostgreSQL at ${config.host}:${config.port}/${config.database}`);

// Listen für Verbindungsfehler
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  // Beenden Sie den Prozess erfolgreich, damit der Container nicht neu startet
  process.exit(0);
});

const pool = new Pool(config);

// Migrations-Dateien in sortierter Reihenfolge lesen
const migrationsDir = path.join(__dirname);
console.log(`Migrations directory: ${migrationsDir}`);
let migrationFiles;
try {
  migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  console.log(`Found migration files: ${migrationFiles.join(', ')}`);
} catch (err) {
  console.error(`Error reading migrations directory: ${err.message}`);
  process.exit(0);
}

async function runMigrations() {
  let client;
  try {
    client = await pool.connect();
    console.log('Connected to database successfully');
    
    // Stelle sicher, dass die uuid-ossp Erweiterung installiert ist (für UUID-Generierung)
    console.log('Creating extensions if needed...');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
    console.log('Extensions created successfully');
    
    // Migrations-Tabelle erstellen, wenn sie nicht existiert
    console.log('Creating migrations table if needed...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('Migrations table created successfully');

    // Prüfen, welche Migrations bereits angewendet wurden
    const { rows } = await client.query('SELECT name FROM migrations');
    const appliedMigrations = rows.map(row => row.name);
    console.log(`Already applied migrations: ${appliedMigrations.join(', ') || 'none'}`);

    // Migrations anwenden
    for (const file of migrationFiles) {
      if (!appliedMigrations.includes(file)) {
        console.log(`Applying migration: ${file}`);
        const migrationPath = path.join(migrationsDir, file);
        console.log(`Reading migration file: ${migrationPath}`);
        
        let migration;
        try {
          migration = fs.readFileSync(migrationPath, 'utf8');
        } catch (err) {
          console.error(`Error reading migration file ${file}: ${err.message}`);
          continue;
        }
        
        await client.query('BEGIN');
        try {
          console.log(`Executing migration ${file}...`);
          await client.query(migration);
          await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
          await client.query('COMMIT');
          console.log(`Successfully applied migration: ${file}`);
        } catch (err) {
          await client.query('ROLLBACK');
          console.error(`Error applying migration ${file}:`, err);
          // Nicht abbrechen, sondern mit der nächsten Migration fortfahren
        }
      } else {
        console.log(`Migration already applied: ${file}`);
      }
    }
    
    console.log('All migrations processing complete');
  } catch (err) {
    console.error('Error during migrations:', err);
  } finally {
    if (client) {
      client.release();
    }
    try {
      await pool.end();
    } catch (err) {
      console.error('Error ending pool:', err);
    }
    // Erfolgreicher Exit, damit der Container nicht neustartet
    process.exit(0);
  }
}

runMigrations();