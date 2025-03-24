// Einfaches Skript zum Ausführen von Migrationen ohne ESM- oder TS-Node-Abhängigkeiten
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
    
    // SQL-Dateien im migrations-Ordner finden
    const migrationFiles = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Natürliche Reihenfolge (V001, V002, etc.)
    
    // Zähler für angewendete Migrationen
    let appliedCount = 0;
    
    // Migrationen nacheinander ausführen
    for (const file of migrationFiles) {
      if (appliedMigrations.includes(file)) {
        console.log(`[INFO] Migration ${file} bereits angewendet, überspringe`);
        continue;
      }
      
      const filePath = path.join(__dirname, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      console.log(`[INFO] Führe Migration ${file} aus...`);
      
      // Transaktion für jede Migration
      await client.query('BEGIN');
      
      try {
        // SQL-Datei ausführen
        await client.query(sql);
        
        // Migration als angewendet markieren
        await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
        
        await client.query('COMMIT');
        console.log(`[INFO] Migration ${file} erfolgreich angewendet`);
        appliedCount++;
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`[ERROR] Fehler beim Ausführen der Migration ${file}:`, err);
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