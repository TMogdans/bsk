# Event-Service Neukonzeption (Node.js)

## Übersicht

Dieses Dokument beschreibt die Neukonzeption des Event-Service der Gesellschaftsspiel-Plattform als Node.js-basierter Mikroservice. Der bestehende PHP/Laravel-basierte Event-Service soll durch eine moderne, TypeScript/Node.js-Implementierung ersetzt werden, um eine bessere technologische Konsistenz mit den anderen Services (Library-Service, Rating-Service) zu erreichen und die Integration in die event-basierte Architektur zu optimieren.

## Motivation der Neuimplementierung

### Aktuelle Herausforderungen

1. **Technologische Heterogenität**: Unterschiedliche Technologiestacks zwischen den Services erhöhen die Komplexität
2. **Event-Integration**: PHP/Laravel limitiert die nahtlose Integration mit dem NATS Message Broker
3. **Entwicklungs-Overhead**: Unterschiedliche Codierungsstandards und Patterns für verschiedene Sprachen
4. **Team-Effizienz**: Notwendigkeit von PHP-spezifischem Know-how neben Node.js/TypeScript
5. **Einheitliche Datenmodellierung**: Schwierigkeiten bei der konsistenten Implementierung des Data-Mesh-Konzepts

### Vorteile der Node.js-Neuimplementierung

1. **Technologische Konsistenz**: Einheitlicher Stack mit anderen Mikroservices
2. **Verbesserte Event-Integration**: Native Unterstützung für NATS durch bestehende Bibliotheken
3. **TypeScript-Vorteile**: Strikte Typisierung, bessere IDE-Unterstützung, weniger Laufzeitfehler
4. **Wiederverwendung**: Gemeinsame Bibliotheken und Patterns über Services hinweg (z.B. NATS-Client)
5. **Effizienz**: Asynchrones I/O-Modell von Node.js optimal für event-basierte Systeme
6. **Skalierbarkeit**: Verbesserte Performance für hohe Anforderungen an Datendurchsatz
7. **Data-Mesh-Integration**: Einfachere Implementierung einheitlicher Datenprodukte

## Funktionale Anforderungen

### Kernfunktionen

1. **Event-Management**
   - Erstellen, Aktualisieren, Löschen von Events
   - Unterstützung für verschiedene Event-Typen:
     - Convention/Messe
     - Spieleabend
     - Turnier
     - Online-Event
     - Workshop
   - Wiederholende Events mit verschiedenen Intervallen
   - Event-Serien-Verwaltung

2. **Zeitplanung und -verwaltung**
   - Datum und Zeitfenster für Events
   - Zeitzonenunterstützung
   - Kalendarische Darstellung und Filterung
   - Konfliktbehandlung bei überlappenden Events

3. **Standortverwaltung**
   - Online-Standorte (URLs, Meeting-Links)
   - Physische Standorte mit Adressinformationen
   - Geo-Koordinaten für Kartenintegration
   - Standortbezogene Metadaten (Barrierefreiheit, Parkmöglichkeiten, etc.)

4. **Teilnehmermanagement**
   - Teilnahme-Registrierung und -Status
   - Teilnehmerkapazität und Wartelisten
   - Teilnahmebestätigungen und Absagen
   - Teilnehmerkommunikation

5. **Event-Kategorisierung**
   - Tags und Kategorien für Events
   - Spieleverknüpfungen zu Library-Service
   - Filterung und Suche nach Metadaten
   - Benutzerdefinierte Attribute

6. **Integration mit anderen Services**
   - Verknüpfung mit Spielgruppen (Community-Service)
   - Verknüpfung mit Spielen (Library-Service)
   - Event-Rating-Integration (Rating-Service)
   - Content-Verknüpfung (Content-Service)

### Unterstützende Funktionen

1. **Benachrichtigungen**
   - Event-Erinnerungen
   - Statusänderungen
   - Teilnahmebestätigungen
   - Änderungen an Event-Details

2. **Privatsphäre und Zugriffskontrolle**
   - Öffentliche vs. private Events
   - Einladungsbasierter Zugriff
   - Rollenbasierte Berechtigungen (Organisator, Teilnehmer)
   - DSGVO-konforme Datenverwaltung

3. **Import/Export**
   - iCal/ICS Export für externe Kalender
   - CSV-Import/Export für Events
   - API für Drittanbieter-Integration

4. **Analytics**
   - Event-Teilnahmestatistiken
   - Organisator-Dashboards
   - Beliebtheitsmetriken für Events
   - Standortbasierte Analysen

## Technische Architektur

### Technologiestack

- **Programmiersprache**: TypeScript
- **Laufzeitumgebung**: Node.js
- **Datenbank**: PostgreSQL
- **Message Broker**: NATS
- **API-Stil**: RESTful mit OpenAPI-Spezifikation
- **Authentifizierung**: JWT mit OAuth2/OIDC (Keycloak)
- **Containerisierung**: Docker
- **Orchestrierung**: Kubernetes

### Kernkomponenten

```
event-service/
├── src/
│   ├── main.ts                    # Einstiegspunkt der Anwendung
│   ├── app.module.ts              # Hauptmodul
│   ├── config/                    # Konfigurationsmodul
│   ├── common/                    # Gemeinsame Utilities und Helpers
│   ├── auth/                      # Authentifizierung und Autorisierung
│   ├── event/                     # Event-Domäne
│   │   ├── controllers/           # REST-Controller
│   │   ├── dto/                   # Data Transfer Objects
│   │   ├── entities/              # Datenbankentitäten
│   │   ├── repositories/          # Datenzugriffsschicht
│   │   ├── services/              # Geschäftslogik
│   │   └── event.module.ts        # Event-Modul-Definition
│   ├── location/                  # Standort-Domäne
│   │   ├── controllers/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── location.module.ts
│   ├── participant/               # Teilnehmer-Domäne
│   │   ├── controllers/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── participant.module.ts
│   ├── series/                    # Event-Serien-Domäne
│   │   ├── controllers/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── series.module.ts
│   ├── notification/              # Benachrichtigungs-Domäne
│   │   ├── controllers/
│   │   ├── dto/
│   │   ├── services/
│   │   └── notification.module.ts
│   └── pubsub/                    # Event-Publishing/Subscription
│       ├── publishers/
│       ├── subscribers/
│       ├── messages/
│       └── pubsub.module.ts
├── test/                          # Testdateien
│   ├── e2e/                       # End-to-End Tests
│   └── unit/                      # Unit Tests
├── dist/                          # Kompilierter Code
├── node_modules/                  # Dependencies
├── .env                           # Umgebungsvariablen
├── .env.example                   # Beispiel für Umgebungsvariablen
├── nest-cli.json                  # NestJS-Konfiguration
├── package.json                   # Projektdefinition und Scripts
├── tsconfig.json                  # TypeScript-Konfiguration
├── jest.config.js                 # Test-Konfiguration
└── README.md                      # Projektdokumentation
```

### Datenmodell

#### Event-Entity
```typescript
@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => EventType)
  type: EventType;

  @Column({ type: 'timestamp with time zone' })
  beginsAt: Date;

  @Column({ type: 'timestamp with time zone' })
  endsAt: Date;

  @Column({ default: false })
  isOnlineEvent: boolean;

  @Column({ nullable: true })
  eventUrl: string;

  @ManyToOne(() => Location, { nullable: true })
  location: Location;

  @Column({ default: false })
  isBarrierFree: boolean;

  @Column({ default: false })
  isEntryFree: boolean;

  @Column({ default: true })
  isPublished: boolean;

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => EventSeries, { nullable: true })
  series: EventSeries;

  @OneToMany(() => EventParticipant, participant => participant.event)
  participants: EventParticipant[];

  @ManyToMany(() => Game)
  @JoinTable()
  featuredGames: Game[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
```

#### Location-Entity
```typescript
@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ type: 'jsonb', nullable: true })
  additionalInfo: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### EventParticipant-Entity
```typescript
@Entity()
export class EventParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, event => event.participants)
  event: Event;

  @ManyToOne(() => User)
  user: User;

  @Column({
    type: 'enum',
    enum: ParticipationStatus,
    default: ParticipationStatus.REGISTERED
  })
  status: ParticipationStatus;

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'timestamp', nullable: true })
  checkedInAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum ParticipationStatus {
  REGISTERED = 'registered',
  CONFIRMED = 'confirmed',
  WAITLISTED = 'waitlisted',
  CANCELLED = 'cancelled',
  ATTENDED = 'attended',
  NO_SHOW = 'no_show'
}
```

#### EventSeries-Entity
```typescript
@Entity()
export class EventSeries {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: SeriesType,
    default: SeriesType.CUSTOM
  })
  type: SeriesType;

  @Column({ type: 'jsonb', nullable: true })
  recurrencePattern: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    interval: number;
    weekDays?: number[];
    monthDay?: number;
    endDate?: Date;
    maxOccurrences?: number;
    excludedDates?: Date[];
  };

  @OneToMany(() => Event, event => event.series)
  events: Event[];

  @ManyToOne(() => User)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum SeriesType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom'
}
```

### API-Endpunkte

#### Event-Endpunkte
- `GET /events` - Events auflisten/filtern
- `GET /events/:id` - Event-Details abrufen
- `POST /events` - Neues Event erstellen
- `PUT /events/:id` - Event aktualisieren
- `DELETE /events/:id` - Event löschen
- `GET /events/:id/participants` - Teilnehmer eines Events abrufen
- `POST /events/:id/participants` - Teilnehmer zu Event hinzufügen
- `GET /events/calendar` - Kalendarische Ansicht von Events

#### Location-Endpunkte
- `GET /locations` - Locations auflisten
- `GET /locations/:id` - Location-Details abrufen
- `POST /locations` - Neue Location erstellen
- `PUT /locations/:id` - Location aktualisieren
- `DELETE /locations/:id` - Location löschen
- `GET /locations/nearby` - Locations in der Nähe finden

#### Event-Series-Endpunkte
- `GET /series` - Event-Serien auflisten
- `GET /series/:id` - Event-Serien-Details abrufen
- `POST /series` - Neue Event-Serie erstellen
- `PUT /series/:id` - Event-Serie aktualisieren
- `DELETE /series/:id` - Event-Serie löschen
- `POST /series/:id/generate` - Events für Serie generieren

#### Teilnehmer-Endpunkte
- `GET /participants/user/:userId` - Events eines Nutzers abrufen
- `POST /events/:id/register` - Für Event registrieren
- `PUT /events/:id/participation` - Teilnahmestatus aktualisieren
- `DELETE /events/:id/participation` - Teilnahme stornieren
- `GET /events/:id/check-in` - Check-in-Status abrufen
- `POST /events/:id/check-in` - Teilnehmer einchecken

### Event-basierte Kommunikation

Der Event-Service wird folgende Events über NATS veröffentlichen und abonnieren:

#### Publizierte Events

1. `event.created` - Wenn ein neues Event erstellt wird
   ```typescript
   interface EventCreatedMessage {
     id: string;
     name: string;
     slug: string;
     type: string;
     beginsAt: string; // ISO 8601
     endsAt: string; // ISO 8601
     isOnlineEvent: boolean;
     location?: {
       id: string;
       name: string;
       city?: string;
       country?: string;
     };
     createdBy: string; // User ID
     createdAt: string; // ISO 8601
   }
   ```

2. `event.updated` - Wenn ein Event aktualisiert wird
   ```typescript
   interface EventUpdatedMessage {
     id: string;
     name: string;
     slug: string;
     // Weitere aktualisierte Felder
     updatedAt: string; // ISO 8601
   }
   ```

3. `event.deleted` - Wenn ein Event gelöscht wird
   ```typescript
   interface EventDeletedMessage {
     id: string;
     deletedAt: string; // ISO 8601
   }
   ```

4. `event.participation-changed` - Wenn sich der Teilnahmestatus ändert
   ```typescript
   interface ParticipationChangedMessage {
     eventId: string;
     userId: string;
     status: ParticipationStatus;
     changedAt: string; // ISO 8601
   }
   ```

#### Abonnierte Events

1. `user.created` - Um neue Nutzer zu registrieren
2. `user.updated` - Um Nutzerdaten zu aktualisieren
3. `game.provided` - Um Spieleinformationen zu erhalten
4. `community.group-created` - Um Informationen über neue Spielgruppen zu erhalten
5. `community.group-event-requested` - Wenn eine Spielgruppe ein Event anfordert

### Datenprodukte (Data Mesh)

Der neue Event-Service wird folgende Datenprodukte anbieten:

1. **Events-Calendar-Datenprodukt**
   - Kalendarische Darstellung aller Events mit Filter- und Suchmöglichkeiten
   - REST und GraphQL APIs
   - Ereignisbasierte Updates über NATS

2. **Event-Participation-Datenprodukt**
   - Teilnahme-Statistiken und -Trends
   - Aggregierte Teilnehmerdaten

3. **Location-Events-Datenprodukt**
   - Standortbasierte Event-Informationen
   - Geo-bezogene Abfragemöglichkeiten

4. **Event-Series-Analytics-Datenprodukt**
   - Analytische Daten zu regelmäßigen Events
   - Teilnahme-Trends über Zeit

Jedes Datenprodukt wird gemäß den Data-Mesh-Prinzipien mit klaren Schnittstellen, SLAs und Metadaten definiert.

## Migrationsstrategie

### Phasen der Migration

1. **Vorbereitungsphase** (1-2 Wochen)
   - Anforderungsanalyse und Bestandsaufnahme des aktuellen PHP-Services
   - Detaillierte Schnittstellendokumentation
   - Einrichtung der Entwicklungsumgebung
   - Erstellung der Datenbankschemas

2. **Entwicklungsphase** (4-8 Wochen)
   - Implementierung der Core-Funktionalitäten
   - Implementierung der NATS-Integration
   - Entwicklung der API-Endpunkte
   - Unit- und Integrationstests

3. **Koexistenzphase** (2-4 Wochen)
   - Parallelbetrieb von altem und neuem Service
   - Datensynchronisation zwischen beiden Systemen
   - A/B-Testing für ausgewählte Benutzer

4. **Übergangsphase** (1-2 Wochen)
   - Schrittweise Umleitung des Traffics auf den neuen Service
   - Kontinuierliche Überwachung und Fehlerkorrektur
   - Fallback-Option zum alten System bei kritischen Problemen

5. **Abschlussphase** (1 Woche)
   - Vollständige Umstellung auf den neuen Service
   - Deaktivierung des alten PHP-Services
   - Dokumentation und Wissenstransfer

### Datenmigration

1. **Datenanalyse und -mapping**
   - Identifikation aller zu migrierenden Daten
   - Schema-Mapping zwischen altem und neuem System
   - Behandlung von Inkompatibilitäten und Datenbereinigung

2. **Migrationstools**
   - Entwicklung eines speziellen Migrationsskripts
   - Validierungsregeln für Datenintegrität
   - Logging- und Fehlerbehebungsmechanismen

3. **Testmigrationen**
   - Wiederholte Testmigrationen in einer Staging-Umgebung
   - Validierung der migrierten Daten
   - Performance-Optimierung des Migrationsprozesses

4. **Live-Migration**
   - Zeitplanung für minimale Auswirkungen auf die Nutzer
   - Inkrementelle Migrationsansätze wo möglich
   - Rollback-Strategie bei kritischen Problemen

### Risikominderung

1. **Überwachung und Alarme**
   - Dedizierte Monitoring-Dashboards für die Migrationsphase
   - Automatische Alarme bei Anomalien oder Fehlern
   - Kontinuierliche Verfügbarkeits- und Performance-Überwachung

2. **Fallback-Strategien**
   - Schnelle Umschaltmöglichkeit zurück zum alten System
   - Datenreplikation während der Übergangsphase
   - Notfallteam für sofortige Reaktion

3. **Inkrementelle Einführung**
   - Feature-Flagging für schrittweise Einführung
   - Canary-Releases für ausgewählte Benutzergruppen
   - Feedback-Schleifen für frühe Problemerkennung

## Testplan

### Testebenen

1. **Unit-Tests**
   - Testabdeckung für alle Geschäftslogikkomponenten
   - Repository-Tests mit Test-Datenbank
   - Service-Layer-Tests mit Mocks

2. **Integrationstests**
   - API-Endpunkt-Tests mit realistischen Szenarien
   - Datenbankintegrationstests
   - NATS-Integrationstests

3. **End-to-End-Tests**
   - Vollständige Benutzerflüsse
   - Browser-Automatisierungstests für Frontend-Integration
   - Performance- und Lasttests

4. **Migrationstests**
   - Validierung der Datenmigration
   - Vergleichstests zwischen altem und neuem System
   - Rollback-Tests

### Testautomatisierung und CI/CD

- Jest-Framework für Unit- und Integrationstests
- Cypress oder Playwright für E2E-Tests
- GitHub Actions für CI/CD-Pipeline
- Automatisierte Tests bei jedem Pull Request
- Nightly Builds mit umfassenden Testsuiten

## Deployment-Strategie

### Kubernetes-Deployment

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: event-service
  namespace: brettspiel-platform
  labels:
    app: event-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: event-service
  template:
    metadata:
      labels:
        app: event-service
    spec:
      containers:
      - name: event-service
        image: ${REGISTRY}/event-service:${VERSION}
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_HOST
          valueFrom:
            configMapKeyRef:
              name: event-service-config
              key: database.host
        - name: DATABASE_PORT
          valueFrom:
            configMapKeyRef:
              name: event-service-config
              key: database.port
        - name: DATABASE_NAME
          valueFrom:
            configMapKeyRef:
              name: event-service-config
              key: database.name
        - name: DATABASE_USER
          valueFrom:
            secretKeyRef:
              name: event-service-db-credentials
              key: username
        - name: DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: event-service-db-credentials
              key: password
        - name: NATS_SERVER
          valueFrom:
            configMapKeyRef:
              name: event-service-config
              key: nats.server
        resources:
          limits:
            cpu: "1"
            memory: "512Mi"
          requests:
            cpu: "0.2"
            memory: "256Mi"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: event-service
  namespace: brettspiel-platform
spec:
  selector:
    app: event-service
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
```

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: event-service-config
  namespace: brettspiel-platform
data:
  database.host: "postgres-event-service"
  database.port: "5432"
  database.name: "event_service_db"
  nats.server: "nats://nats:4222"
  logging.level: "info"
```

### Canary-Deployment

Für die schrittweise Einführung des neuen Services ist ein Canary-Deployment geplant:

```yaml
# canary-deployment.yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: event-service
  namespace: brettspiel-platform
spec:
  hosts:
  - event-service
  http:
  - route:
    - destination:
        host: event-service-php
        subset: v1
      weight: 80
    - destination:
        host: event-service-nodejs
        subset: v1
      weight: 20
```

Schrittweise Erhöhung des Traffics für den neuen Service nach erfolgreicher Validierung.

## Erfolgskriterien

Folgende Erfolgskriterien werden für die Neuimplementierung definiert:

1. **Funktionale Äquivalenz**
   - Alle Funktionen des bestehenden Services sind im neuen Service verfügbar
   - API-Kompatibilität für Frontends und andere Services

2. **Performance**
   - Mindestens 20% Verbesserung der Antwortzeiten
   - Unterstützung für mindestens 2x mehr gleichzeitige Nutzer

3. **Stabilität**
   - 99.9% Verfügbarkeit während und nach der Migration
   - Keine kritischen Fehler nach der vollständigen Umstellung

4. **Entwicklungseffizienz**
   - Reduzierung der Zeit für neue Features um mindestens 30%
   - Verbesserte Testabdeckung von >80%

5. **Datenintegrität**
   - 100% korrekte Migration aller kritischen Daten
   - Keine Datenverluste während der Migration

## Ressourcenplanung

### Team

- 2 Backend-Entwickler (Node.js/TypeScript)
- 1 DevOps-Ingenieur
- 1 QA-Ingenieur
- 1 Produktmanager (Teilzeit)

### Zeitplan

- Gesamtdauer: 8-12 Wochen
- Vorbereitungsphase: Wochen 1-2
- Entwicklungsphase: Wochen 3-8
- Koexistenzphase: Wochen 9-10
- Übergangsphase: Wochen 11-12
- Abschlussphase: Woche 12

### Kostenabschätzung

- Entwicklungsaufwand: ~600-800 Personenstunden
- Infrastrukturkosten während der Koexistenzphase (erhöhte Ressourcen)
- Potenzielle Kostenreduzierung nach Migration durch verbesserte Skalierbarkeit und Ressourcennutzung

## Zusammenfassung

Die Neuimplementierung des Event-Service als Node.js-Anwendung bietet signifikante Vorteile für die Gesellschaftsspiel-Plattform. Durch die Vereinheitlichung des Technologiestacks wird die Entwicklung effizienter, die Integration mit dem Event-basierten System verbessert und die Wartbarkeit des Gesamtsystems erhöht.

Die schrittweise Migrationsstrategie minimiert Risiken während des Übergangs und stellt sicher, dass keine Daten verloren gehen oder Funktionen beeinträchtigt werden. Langfristig ermöglicht der neue Event-Service eine bessere Skalierbarkeit, schnellere Feature-Entwicklung und nahtlose Integration in die Data-Mesh-Architektur der Plattform.