# Mikroservices

Dieses Verzeichnis enthält alle Mikroservices der BSK-Plattform (Brettspiel-Kommunikation). Jeder Service ist in einem eigenen Unterverzeichnis mit seiner kompletten Implementierung und Konfiguration enthalten.

## Serviceübersicht

| Service | Beschreibung | Technologie | Status |
|---------|-------------|-------------|--------|
| [library-service](./library-service) | Verwaltet die Brettspieldatenbank mit Informationen zu Spielen, Kategorien, Mechaniken, Autoren und Verlagen | Node.js/TypeScript | Aktiv |
| [rating-write-service](./rating-write-service) | Verarbeitet eingehende Bewertungen und speichert sie in die Datenbank | Node.js/TypeScript | Aktiv |
| [rating-read-service](./rating-read-service) | Bietet Zugriff auf aggregierte Bewertungsdaten | Node.js/TypeScript | Aktiv |

## Architekturprinzipien

Jeder Mikroservice in diesem Verzeichnis folgt diesen Grundprinzipien:

1. **Unabhängigkeit**: Jeder Service hat seine eigene Codebasis, Datenbank und Konfiguration
2. **Event-basierte Kommunikation**: Services kommunizieren über NATS als Message Broker
3. **REST-APIs**: Für direkte Anfragen stellen die Services REST-Endpoints bereit
4. **Containerisierung**: Jeder Service hat eigene Dockerfile(s) für Entwicklung und Produktion

## Entwicklung

### Lokale Entwicklung

Die primäre Methode für die lokale Entwicklung ist Docker Compose. Alle Services werden im Root-Docker-Compose-File konfiguriert:

```bash
# Im Root-Verzeichnis des Projekts
docker-compose up -d
```

### Kubernetes-Entwicklung (fortgeschritten)

Für Tests in einer Kubernetes-Umgebung ist jeder Service mit entsprechenden K8s-Ressourcen konfiguriert:

```bash
# Im Root-Verzeichnis des Projekts
tilt up
```

## Hinzufügen neuer Services

Neue Services sollten stets in diesem Verzeichnis angelegt werden, mit folgender Grundstruktur:

```
services/
└── new-service/
    ├── api/             # Hauptcode des Service
    ├── deployment/      # Deployment-Konfiguration
    │   ├── development/ # Entwicklungsumgebung
    │   └── production/  # Produktionsumgebung
    └── _documentation/  # Servicespezifische Dokumentation
```

## Deployment

Die Services werden über GitHub Actions automatisch in die Zielumgebungen deployed, basierend auf den konfigurierten Kubernetes-Manifesten im jeweiligen `deployment/production/k8s/` Verzeichnis. Die Workflow-Definitionen befinden sich im `.github/workflows/` Verzeichnis des Hauptprojekts.

## Weitere Dokumentation

Zusätzliche Architekturinformationen und Diagramme finden sich im `_documentation/` Verzeichnis des Root-Projekts.