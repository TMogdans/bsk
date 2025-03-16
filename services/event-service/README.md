# Event Service

Eine moderne TypeScript/Node.js Implementation des Event-Service für die BSK-Plattform.

## Beschreibung

Dieser Service verwaltet Veranstaltungen (Events) und Event-Typen für die BSK-Plattform. Es handelt sich um eine vollständige Neuimplementierung des ursprünglichen PHP/Laravel-basierten Event-Service, jetzt mit Node.js, Express, Slonik und Zod.

## Technologie-Stack

- **Plattform**: Node.js
- **Sprache**: TypeScript
- **Framework**: Express
- **Build-Tool**: Vite
- **Test-Framework**: Vitest
- **Datenbank**: PostgreSQL
- **DB-Zugriff**: Slonik
- **Schema-Validierung**: Zod
- **Code-Qualität**: Biome
- **Container**: Docker
- **Orchestrierung**: Kubernetes
- **CI/CD**: GitHub Actions

## Features

- REST-API für Events und Event-Typen
- Filterung von Events nach Datum, Typ, Barrerefreiheit, etc.
- Vollständige CRUD-Operationen
- Mehrsprachige Event-Typen
- Validierung von Eingabedaten mit Zod
- Health-Checks und Monitoring-Endpunkte

## Entwicklung

### Voraussetzungen

- Node.js (v20+)
- pnpm (v8+)
- Docker und Docker Compose
- PostgreSQL (lokal oder in Docker)

### Lokale Entwicklung

1. Klonen des Repositories:
   ```bash
   git clone https://github.com/tmogdans/bsk.git
   ```

2. In das Projektverzeichnis wechseln:
   ```bash
   cd bsk
   ```

3. Abhängigkeiten installieren:
   ```bash
   pnpm install
   ```

4. Entwicklungsserver starten:
   ```bash
   # Mit Docker Compose
   docker-compose up event-service

   # Oder direkt
   cd services/event-service/api
   pnpm run dev
   ```

5. Der Service ist nun unter http://localhost:3010 verfügbar (via Docker) oder http://localhost:3000 (direkt).

### Datenbank-Migrationen

Beim ersten Start werden Datenbank-Migrationen automatisch ausgeführt. Falls notwendig, können sie auch manuell ausgeführt werden:

```bash
cd services/event-service/api
pnpm run migrate
```

### Tests ausführen

```bash
cd services/event-service/api
pnpm run test
```

## API-Endpunkte

### Events

- `GET /api/events` - Alle zukünftigen veröffentlichten Events abrufen
- `GET /api/events/:slug` - Event nach Slug abrufen
- `POST /api/events` - Neues Event erstellen
- `PUT /api/events/:id` - Event aktualisieren
- `DELETE /api/events/:id` - Event löschen

### Event-Typen

- `GET /api/types` - Alle Event-Typen abrufen
- `GET /api/types/:id` - Event-Typ nach ID abrufen
- `POST /api/types` - Neuen Event-Typ erstellen
- `PUT /api/types/:id` - Event-Typ aktualisieren
- `DELETE /api/types/:id` - Event-Typ löschen

## Deployment

Der Service kann mit Kubernetes in eine Produktionsumgebung deployt werden:

```bash
kubectl apply -f services/event-service/deployment/production/k8s/
```

## Lizenz

MIT