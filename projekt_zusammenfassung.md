# Brettspiel-Plattform: Projektübersicht

## Kurzbeschreibung
Dieses Projekt ist eine umfassende Plattform für Brettspiel-Enthusiasten, die als moderne Mikroservice-Architektur konzipiert ist. Die Plattform dient als Informationsquelle, soziales Netzwerk und Eventmanagement-Tool für die Brettspiel-Community.

## Architektur

### Mikroservice-Landschaft
Die Anwendung basiert auf einer Mikroservice-Architektur mit event-basierter Kommunikation via NATS als Message Broker. Jeder Service ist für eine bestimmte Geschäftsdomäne verantwortlich und verfügt über eine eigene Datenbank.

### Hauptkomponenten

1. **Library-Service**
   - Verwaltet Informationen zu Brettspielen, Kategorien, Mechaniken, Autoren und Verlagen
   - PostgreSQL-Datenbank für Spieledaten
   - Stellt Spieldaten für andere Services bereit

2. **Rating-Services**
   - **Rating-Write-Service**: Erfasst und speichert Nutzerbewertungen
   - **Rating-Read-Service**: Liest und aggregiert Bewertungsdaten, nutzt Redis für Caching
   - **Rating-View-Service**: Frontend-Komponenten zur Anzeige von Bewertungen

3. **Event-Service**
   - Verwaltet Events und Veranstaltungen
   - Unterstützt verschiedene Event-Typen und Terminserien
   - Teilnehmermanagement

4. **Zukünftige Services (geplant)**
   - Community-Service für soziale Netzwerkfunktionen
   - Marketplace-Service für Handel zwischen Nutzern
   - Content-Service für Spielerezensionen und Tutorials
   - Search-Service für übergreifende Suchfunktionalität
   - Recommendation-Service für personalisierte Empfehlungen

### Technologie-Stack

- **Backend**: Hauptsächlich Node.js/TypeScript mit Express
- **Datenbanken**: PostgreSQL für strukturierte Daten, Redis für Caching
- **Messaging**: NATS als Event-Bus
- **Frontend**: React/TypeScript-basierte Single-Page-Application
- **Deployment**: Docker und Kubernetes für Containerisierung und Orchestrierung
- **Monitoring**: Prometheus und Grafana

## Konzeptionelle Besonderheiten

### Data-Mesh-Ansatz
Das Projekt implementiert ein Data-Mesh-Paradigma, bei dem:
- Daten dezentral verwaltet werden
- Jeder Service für seine Datendefinition, -qualität und -bereitstellung verantwortlich ist
- Daten als Produkte behandelt werden, die für andere Services konsumierbar sind
- Eine föderierte Governance-Struktur existiert

### Domain-Driven Design
- Services sind entlang von Geschäftsdomänen organisiert
- Klare Bounded Contexts mit definierten Schnittstellen
- Ubiquitous Language innerhalb der Domänen

### Event-Driven Architecture
- Services kommunizieren durch Events wie "game-rated", "boardgame-provided", "event-created"
- Publish-Subscribe-Muster für Service-übergreifende Ereignisse
- Lose Kopplung zwischen Services für unabhängige Entwicklung und Skalierung

## Entwicklungsstatus

Die Plattform befindet sich in aktiver Entwicklung mit:
- Implementierten Kernfunktionen (Spielebibliothek, Bewertungssystem, grundlegende Event-Funktionen)
- Mehrstufigem Entwicklungsplan für weitere Services und Features
- CI/CD-Pipelines für automatisierte Deployments

## Projektstruktur

Das Repository ist wie folgt organisiert:
- `/services`: Enthält die einzelnen Mikroservices
- `/packages`: Shared Libraries für die Services
- `/design`: Design-System und UI-Komponenten
- `/frontend`: Hauptfrontend-Anwendung
- `/deployment`: Kubernetes und Terraform Konfigurationen
- `/_documentation`: Umfangreiche Projektdokumentation und Architekturdiagramme
- `/_concept`: Konzeptionelle Dokumente zur Plattform-Vision und -Roadmap

## Projektvisionen & Ziele

1. **Umfassende Spielebibliothek** mit detaillierten Informationen
2. **Community-Funktionen** für soziales Spielen
3. **Event-Management** für Spieletreffen und Conventions
4. **Spielemarktplatz** für Handel zwischen Spielern
5. **Inhaltsplattform** für Rezensionen und Tutorials

Das Projekt kombiniert moderne Softwarepraktiken mit einem innovativen Datenansatz, um eine skalierbare, wartbare Plattform zu schaffen, die kontinuierlich weiterentwickelt werden kann.