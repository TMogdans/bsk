# Event Service API-Dokumentation

## Überblick

Die API des Event-Service stellt Funktionen zur Verfügung, um Veranstaltungen (Events) und deren Typen zu verwalten. Alle Anfragen und Antworten verwenden das JSON-Format.

## Basis-URL

```
/api
```

## Authentifizierung

Die Authentifizierung erfolgt über Bearer-Token. Für bestimmte Endpunkte ist eine Authentifizierung erforderlich.

```
Authorization: Bearer <token>
```

## Event-Endpunkte

### Alle Events abrufen

Gibt eine Liste aller zukünftigen, veröffentlichten Events zurück, gruppiert nach Monaten.

```
GET /api/events
```

#### Query-Parameter

| Parameter   | Typ     | Beschreibung                                     |
|-------------|---------|--------------------------------------------------|
| presence    | string  | 'online' oder 'offline' für Filterung nach Format |
| type        | string  | Nach Event-Typ filtern                           |
| barrierFree | boolean | Nach barrierefreien Events filtern                |
| entryFree   | boolean | Nach kostenlosen Events filtern                  |

#### Antwort

```json
{
  "heading": "Termine 2023",
  "months": [
    {
      "heading": "Mai 2023",
      "events": [
        {
          "id": 1,
          "name": "Spieleabend",
          "slug": "spieleabend",
          "type": {
            "name": "meeting",
            "translated": "Spieletreff"
          },
          "beginsAt": "2023-05-15T18:00:00.000Z",
          "endsAt": "2023-05-15T22:00:00.000Z",
          "zip": "12345",
          "location": "Spielecafé",
          "country": "de",
          "street": "Spielstraße 1",
          "description": "Gemeinsames Spielen von Brettspielen",
          "barrierFree": true,
          "entryFree": false,
          "onlineEvent": false,
          "published": true,
          "eventUrl": "https://example.com/spieleabend",
          "meta": {
            "url": "/events/spieleabend"
          }
        }
      ]
    }
  ]
}
```

### Event nach Slug abrufen

Gibt ein einzelnes Event anhand seines Slugs zurück.

```
GET /api/events/:slug
```

#### Antwort

```json
{
  "id": 1,
  "name": "Spieleabend",
  "slug": "spieleabend",
  "type": {
    "name": "meeting",
    "translated": "Spieletreff"
  },
  "beginsAt": "2023-05-15T18:00:00.000Z",
  "endsAt": "2023-05-15T22:00:00.000Z",
  "zip": "12345",
  "location": "Spielecafé",
  "country": "de",
  "street": "Spielstraße 1",
  "description": "Gemeinsames Spielen von Brettspielen",
  "barrierFree": true,
  "entryFree": false,
  "onlineEvent": false,
  "published": true,
  "eventUrl": "https://example.com/spieleabend",
  "createdAt": "2023-04-01T12:00:00.000Z",
  "updatedAt": "2023-04-01T12:00:00.000Z",
  "meta": {
    "url": "/events/spieleabend"
  }
}
```

### Neues Event erstellen

Erstellt ein neues Event.

```
POST /api/events
```

#### Anfrage-Body

```json
{
  "name": "Spieleabend",
  "type": "meeting",
  "beginsAt": "2023-05-15T18:00:00.000Z",
  "endsAt": "2023-05-15T22:00:00.000Z",
  "zip": "12345",
  "location": "Spielecafé",
  "country": "de",
  "street": "Spielstraße 1",
  "description": "Gemeinsames Spielen von Brettspielen",
  "barrierFree": true,
  "entryFree": false,
  "onlineEvent": false,
  "published": true,
  "eventUrl": "https://example.com/spieleabend",
  "createdBy": 1
}
```

#### Antwort

```json
{
  "id": 1,
  "name": "Spieleabend",
  "slug": "spieleabend",
  "type": {
    "name": "meeting",
    "translated": "Spieletreff"
  },
  "beginsAt": "2023-05-15T18:00:00.000Z",
  "endsAt": "2023-05-15T22:00:00.000Z",
  "zip": "12345",
  "location": "Spielecafé",
  "country": "de",
  "street": "Spielstraße 1",
  "description": "Gemeinsames Spielen von Brettspielen",
  "barrierFree": true,
  "entryFree": false,
  "onlineEvent": false,
  "published": true,
  "eventUrl": "https://example.com/spieleabend",
  "createdAt": "2023-04-01T12:00:00.000Z",
  "updatedAt": "2023-04-01T12:00:00.000Z",
  "createdBy": 1,
  "meta": {
    "url": "/events/spieleabend"
  }
}
```

### Event aktualisieren

Aktualisiert ein vorhandenes Event.

```
PUT /api/events/:id
```

#### Anfrage-Body

```json
{
  "name": "Großer Spieleabend",
  "description": "Gemeinsames Spielen von Brettspielen mit Turnieren"
}
```

#### Antwort

Das aktualisierte Event im gleichen Format wie bei der Event-Erstellung.

### Event löschen

Löscht ein Event (Soft-Delete).

```
DELETE /api/events/:id
```

#### Antwort

Status-Code 204 (No Content) bei Erfolg.

## Typ-Endpunkte

### Alle Typen abrufen

Gibt eine Liste aller Event-Typen zurück.

```
GET /api/types
```

#### Antwort

```json
[
  {
    "id": 1,
    "name": "convention",
    "translated": "Kongress"
  },
  {
    "id": 2,
    "name": "fair",
    "translated": "Messe"
  },
  {
    "id": 3,
    "name": "tournament",
    "translated": "Turnier"
  },
  {
    "id": 4,
    "name": "meeting",
    "translated": "Spieletreff"
  }
]
```

### Typ nach ID abrufen

Gibt einen Event-Typ anhand seiner ID zurück.

```
GET /api/types/:id
```

#### Antwort

```json
{
  "id": 4,
  "name": "meeting",
  "translated": "Spieletreff"
}
```

### Neuen Typ erstellen

Erstellt einen neuen Event-Typ.

```
POST /api/types
```

#### Anfrage-Body

```json
{
  "name": "workshop",
  "translations": {
    "de": "Workshop",
    "en": "Workshop"
  }
}
```

#### Antwort

```json
{
  "id": 5,
  "name": "workshop",
  "translated": "Workshop"
}
```

### Typ aktualisieren

Aktualisiert einen vorhandenen Event-Typ.

```
PUT /api/types/:id
```

#### Anfrage-Body

```json
{
  "translations": {
    "de": "Workshop",
    "en": "Workshop",
    "fr": "Atelier"
  }
}
```

#### Antwort

Das aktualisierte Typ-Objekt.

### Typ löschen

Löscht einen Event-Typ.

```
DELETE /api/types/:id
```

#### Antwort

Status-Code 204 (No Content) bei Erfolg.

## Fehler-Antworten

Bei Fehlern gibt die API eine JSON-Antwort mit Fehlerinformationen zurück:

```json
{
  "error": "Validation Error",
  "type": "ValidationError",
  "details": {
    "name": {
      "_errors": ["Required"]
    }
  }
}
```

Bekannte Fehlertypen:

- `ValidationError`: Ungültige Eingabedaten
- `NotFoundError`: Ressource nicht gefunden
- `BadRequestError`: Fehlerhafte Anfrage
- `ServerError`: Interner Serverfehler