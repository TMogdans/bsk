# Community-Service Konzept

## Übersicht

Der Community-Service ist ein zentraler Baustein der Gesellschaftsspiel-Plattform und verwaltet alle sozialen Aspekte, Benutzerprofile und Spielegruppen. Er ermöglicht es den Nutzern, sich zu vernetzen, gemeinsame Spieleinteressen zu entdecken und Spielegruppen zu organisieren.

## Funktionale Anforderungen

### 1. Benutzerprofil-Management

#### 1.1 Öffentliches Profil
- **Profilbild und Benutzername**
- **Standort** (optional, auf Stadt/Region beschränkbar)
- **Über mich** - Freitextbeschreibung
- **Spielerfahrung** (Anfänger, Gelegenheitsspieler, Enthusiast, Experte)
- **Bevorzugte Spieletypen** und Mechaniken
- **Öffentliche Spielestatistiken**:
  - Anzahl der gespielten verschiedenen Spiele
  - Lieblingsgenres
  - Durchschnittliche Bewertung
- **Achievements/Badges** (z.B. "Hat 100 Spiele bewertet", "Besucht regelmäßig Events")

#### 1.2 Persönliche Spielesammlung
- **Eigene Spiele** erfassen und verwalten
- **Wunschliste** für gewünschte Spiele
- **Spielehistorie** - Protokollieren von Spielesessions
- **Favoriten** markieren
- **Kategorisierung** der eigenen Sammlung (z.B. nach Thema, Mechanik, Komplexität)
- **Ausleihstatus** der Spiele (verfügbar, verliehen an XY)

#### 1.3 Privatsphäre-Einstellungen
- Granulare Kontrolle darüber, welche Profilinformationen öffentlich, nur für Freunde oder privat sind
- Sichtbarkeit der Spielesammlung einstellbar
- Opt-in/Opt-out für verschiedene Benachrichtigungen

### 2. Soziale Vernetzung

#### 2.1 Freundschaftssystem
- **Freundschaftsanfragen** senden und annehmen
- **Kontakte** verwalten und kategorisieren
- **Freunde-Suche** nach verschiedenen Kriterien (Standort, gemeinsame Spiele, etc.)
- **Freundesvorschläge** basierend auf ähnlichen Interessen

#### 2.2 Kommunikation
- **Direktnachrichten** zwischen Nutzern
- **Chatfunktion** für Echtzeit-Kommunikation
- **Benachrichtigungssystem** für Aktivitäten (Freundschaftsanfragen, Event-Einladungen, etc.)
- **@Mentions** in Kommentaren und Diskussionen

#### 2.3 Aktivitäten-Feed
- Personalisierter Feed mit:
  - Updates von Freunden
  - Neue Bewertungen von Freunden
  - Anstehende Events im Umkreis
  - Empfehlungen basierend auf Spieleinteressen
- Möglichkeit, Beiträge zu kommentieren und zu "liken"

### 3. Spielgruppen

#### 3.1 Gruppenverwaltung
- **Erstellen öffentlicher oder privater Gruppen**
- **Einladungen** an Nutzer senden
- **Mitgliederrollen** definieren (Admin, Moderator, Mitglied)
- **Gruppeneinstellungen** verwalten (Name, Beschreibung, Bild, Sichtbarkeit)

#### 3.2 Gruppenfunktionen
- **Gruppenkalender** für regelmäßige Spieletreffen
- **Gemeinsame Spielesammlung** - Übersicht über verfügbare Spiele aller Mitglieder
- **Abstimmungssystem** für die Spieleauswahl
- **Diskussionsforum** für gruppenspezifische Themen
- **Fotoalbum** für Spieleabende

#### 3.3 Spieleabend-Organisation
- **Terminplanung** mit Zusagen/Absagen
- **Standortverwaltung** (wechselnde Orte bei privaten Treffen)
- **Spielevorschläge** basierend auf Teilnehmerzahl und -präferenzen
- **Automatische Erinnerungen** an bevorstehende Treffen

### 4. Community-Engagement

#### 4.1 Community-Challenges
- Zeitlich begrenzte Herausforderungen (z.B. "Spiele 5 Kooperativspiele in einem Monat")
- Ranglisten für verschiedene Achievements
- Saisonale Events und Challenges

#### 4.2 Community-Beiträge
- Möglichkeit, eigene Spielevarianten zu teilen
- Fragen und Antworten zu Spielregeln
- Teilen von Spieleerlebnissen und -berichten

#### 4.3 Lokale Communities
- Geografisch basierte Gruppen
- Lokale Spieletreffs entdecken
- Integration mit Event-Service für lokale Veranstaltungen

## Technische Architektur

### Mikroservice-Integration

Der Community-Service wird als eigenständiger Mikroservice implementiert, der mit folgenden bestehenden Services interagiert:

- **Library-Service**: Für Spieleinformationen und -metadaten
- **Rating-Service**: Für Bewertungen und Spielerfahrungen
- **Event-Service**: Für Spieletreffen und Veranstaltungen

### Datenmodell

#### User
```
User {
  id: UUID
  username: String
  email: String
  passwordHash: String
  displayName: String
  profileImage: String
  location: {
    city: String
    country: String
    coordinates: GeoPoint (optional)
  }
  preferences: {
    favoriteCategories: [CategoryID]
    favoriteMechanics: [MechanicID]
    playerType: Enum(CASUAL, ENTHUSIAST, EXPERT)
    minComplexity: Number
    maxComplexity: Number
    preferredPlayerCount: [Number]
  }
  privacy: {
    profileVisibility: Enum(PUBLIC, FRIENDS_ONLY, PRIVATE)
    collectionVisibility: Enum(PUBLIC, FRIENDS_ONLY, PRIVATE)
    locationPrecision: Enum(EXACT, CITY, REGION, COUNTRY, HIDDEN)
  }
  stats: {
    gamesPlayed: Number
    eventsAttended: Number
    averageRating: Number
  }
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Friendship
```
Friendship {
  id: UUID
  requesterId: UserID
  addresseeId: UserID
  status: Enum(PENDING, ACCEPTED, DECLINED, BLOCKED)
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### UserGameCollection
```
UserGameCollection {
  id: UUID
  userId: UserID
  gameId: GameID
  status: Enum(OWNED, WISHLIST, PREVIOUSLY_OWNED)
  acquisitionDate: Date (optional)
  notes: String
  loanStatus: {
    isLoaned: Boolean
    loanedTo: UserID (optional)
    loanDate: DateTime (optional)
    returnDate: DateTime (optional)
  }
  playCount: Number
  lastPlayed: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Group
```
Group {
  id: UUID
  name: String
  description: String
  image: String
  isPrivate: Boolean
  location: {
    city: String
    country: String
    coordinates: GeoPoint (optional)
  }
  createdBy: UserID
  members: [
    {
      userId: UserID
      role: Enum(ADMIN, MODERATOR, MEMBER)
      joinedAt: DateTime
    }
  ]
  settings: {
    joinApprovalRequired: Boolean
    postApprovalRequired: Boolean
    visibleInSearch: Boolean
  }
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### GroupEvent
```
GroupEvent {
  id: UUID
  groupId: GroupID
  title: String
  description: String
  startTime: DateTime
  endTime: DateTime
  location: {
    name: String
    address: String
    coordinates: GeoPoint (optional)
  }
  hostId: UserID
  maxParticipants: Number (optional)
  proposedGames: [GameID]
  participants: [
    {
      userId: UserID
      status: Enum(ATTENDING, MAYBE, DECLINED)
      responseTime: DateTime
    }
  ]
  createdAt: DateTime
  updatedAt: DateTime
}
```

### API-Endpunkte

#### Benutzer-Endpunkte
- `GET /users/:id` - Benutzerprofil abrufen
- `PUT /users/:id` - Benutzerprofil aktualisieren
- `GET /users/:id/collection` - Spielesammlung eines Benutzers abrufen
- `POST /users/:id/collection` - Spiel zur Sammlung hinzufügen
- `PUT /users/:id/collection/:gameId` - Spielinformationen aktualisieren
- `DELETE /users/:id/collection/:gameId` - Spiel aus Sammlung entfernen

#### Freundschafts-Endpunkte
- `GET /users/:id/friends` - Freundesliste abrufen
- `POST /users/:id/friends/requests` - Freundschaftsanfrage senden
- `PUT /users/:id/friends/requests/:requestId` - Anfrage annehmen/ablehnen
- `DELETE /users/:id/friends/:friendId` - Freundschaft entfernen

#### Gruppen-Endpunkte
- `GET /groups` - Gruppen auflisten/suchen
- `POST /groups` - Neue Gruppe erstellen
- `GET /groups/:id` - Gruppeninformationen abrufen
- `PUT /groups/:id` - Gruppeninformationen aktualisieren
- `DELETE /groups/:id` - Gruppe löschen
- `GET /groups/:id/members` - Mitglieder einer Gruppe abrufen
- `POST /groups/:id/members` - Mitglied hinzufügen/einladen
- `DELETE /groups/:id/members/:userId` - Mitglied entfernen

#### Gruppen-Event-Endpunkte
- `GET /groups/:id/events` - Gruppenevents abrufen
- `POST /groups/:id/events` - Neues Gruppenevent erstellen
- `GET /groups/:id/events/:eventId` - Event-Details abrufen
- `PUT /groups/:id/events/:eventId` - Event aktualisieren
- `DELETE /groups/:id/events/:eventId` - Event löschen
- `PUT /groups/:id/events/:eventId/rsvp` - Teilnahmestatus aktualisieren

### Event-Publikationen (NATS)

Der Community-Service veröffentlicht und abonniert verschiedene Events über den NATS-Message-Broker:

#### Publizierte Events
- `user-profile-updated`: Wenn ein Benutzer sein Profil aktualisiert
- `group-created`: Wenn eine neue Gruppe erstellt wird
- `group-event-created`: Wenn ein neues Gruppenevent erstellt wird
- `game-collection-updated`: Wenn ein Benutzer seine Spielesammlung aktualisiert

#### Abonnierte Events
- `game-provided`: Um neue/aktualisierte Spieleinformationen zu erhalten
- `rating-submitted`: Um Bewertungsinformationen für Benutzerprofile zu aktualisieren
- `event-created`: Um öffentliche Events für Gruppenkalender einzubinden

## Implementierungsstrategie

### Phase 1: Grundlegende Benutzerverwaltung
- Benutzerprofile mit grundlegenden Informationen
- Einfache Spielesammlungsverwaltung 
- Freundschaftssystem (Anfrage, Akzeptieren, Ablehnen)

### Phase 2: Erweiterte Soziale Funktionen
- Direktnachrichten und Chat
- Aktivitäten-Feed
- Erweiterte Profildetails und Statistiken

### Phase 3: Gruppenfeatures
- Gruppenerstellung und -verwaltung
- Gruppenkalender und Events
- Gruppendiskussionen

### Phase 4: Erweitertes Community-Engagement
- Community-Challenges und Gamification
- Lokale Communities
- Integration mit Marketplace für Spieleverleihe

## Sicherheits- und Datenschutzaspekte

- **DSGVO-Compliance**: Vollständige Unterstützung für Datenexport und Löschung
- **Privatsphäre-Kontrollen**: Granulare Einstellungen für Sichtbarkeit von Profildaten
- **Sichere Kommunikation**: Verschlüsselung aller Kommunikation
- **Moderationswerkzeuge**: Für Gruppenadministratoren zum Verwalten von Inhalten
- **Missbrauchsmeldungen**: System zum Melden unangemessener Inhalte/Verhaltensweisen
- **Blockierungsfunktion**: Möglichkeit für Benutzer, unerwünschte Kontakte zu blockieren