# Marketplace-Service Konzept

## Übersicht

Der Marketplace-Service ermöglicht den Kauf, Verkauf und Tausch von Gesellschaftsspielen zwischen Nutzern der Plattform. Er bietet eine sichere und strukturierte Umgebung für den Handel mit gebrauchten Spielen, Sammlerstücken und Zubehör, wodurch die Community weiter gestärkt wird.

## Funktionale Anforderungen

### 1. Inserate und Angebote

#### 1.1 Inserat-Erstellung
- **Verkaufs-Inserate** für gebrauchte Spiele erstellen
- **Tauschangebote** mit Wunsch- und Angebotsliste
- **Verleih-Angebote** für temporäre Nutzung
- **Sammlerstücke** mit speziellem Sammlerwert
- **Zubehör** (Organizer, Sleeves, etc.)
- **Detaillierte Zustandsbeschreibung**:
  - Neu/Ungeöffnet
  - Wie neu (gespielt, aber perfekter Zustand)
  - Gut (leichte Gebrauchsspuren)
  - Akzeptabel (deutliche Gebrauchsspuren)
  - Beschädigt (mit Angabe der Mängel)
- **Bilderupload** (min. 1, max. 10 Bilder)
- **Automatische Verknüpfung** mit der Spieledatenbank des Library-Service

#### 1.2 Preisgestaltung und Optionen
- **Festpreis** für direkten Kauf
- **Verhandlungsbasis** für Preisvorschläge
- **Auktionsformat** mit Mindestgebot und Dauer
- **Kombinationsangebote** für mehrere Spiele
- **Preisvorschläge** durch Interessenten
- **Preisschätzungs-Tool** basierend auf historischen Daten und Zustand

#### 1.3 Angebotsdetails
- **Versandoptionen** (Versand, Abholung, persönliche Übergabe)
- **Versandkosten** nach Region/Land
- **Zahlungsmethoden**
- **Gültigkeitsdauer** des Angebots

### 2. Suche und Entdeckung

#### 2.1 Suchfunktionen
- **Umfangreiche Filtermöglichkeiten**:
  - Spieltyp, Zustand, Preisspanne
  - Standort/Entfernung
  - Nur Abholung/nur Versand
  - Nur Tausch/nur Verkauf/beides
- **Sortieroptionen** nach Relevanz, Preis, Entfernung, Aktualität
- **Erweiterte Suche** nach bestimmten Spielen, Editionen oder Ausstattungen

#### 2.2 Empfehlungen
- **Personalisierte Empfehlungen** basierend auf Wunschliste und Interessen
- **"In deiner Nähe"**-Angebote
- **Ähnliche Angebote** beim Betrachten eines Inserats
- **Kürzlich reduzierte** Angebote

#### 2.3 Benachrichtigungen
- **Suchalarme** für gespeicherte Suchanfragen
- **Preisbenachrichtigungen** bei Angeboten unter einem definierten Schwellenwert
- **Neue Angebote** in der Nähe
- **Auktionsende**-Benachrichtigungen

### 3. Transaktionsabwicklung

#### 3.1 Kommunikation
- **In-App-Messaging** zwischen Käufer und Verkäufer
- **Standardisierte Nachrichten** für häufige Anfragen
- **Verhandlungshistorie** zur Nachverfolgung
- **Termin-Koordination** für persönliche Übergabe

#### 3.2 Kaufabwicklung
- **Reservierungsoption** für interessierte Käufer
- **Kauf-/Verkaufsvertrag** (automatisch generiert)
- **Sichere Zahlungsabwicklung** mit Treuhandfunktion (optional)
- **Statusverfolgung** (angefragt, reserviert, bezahlt, versendet, abgeschlossen)
- **Versandverfolgung** mit Tracking-Nummern

#### 3.3 Tausch-/Verleihmanagement
- **Tauschvorschläge** mit alternativen Angeboten
- **Verleihzeitraum**-Festlegung
- **Kaution**-Verwaltung für Verleih
- **Rückgabe**-Bestätigung und Zustandsprüfung

### 4. Bewertungs- und Schutzsystem

#### 4.1 Nutzerbewertungen
- **Transaktionsbewertungen** nach Abschluss
- **Bewertungskriterien**: Kommunikation, Zustandsbeschreibung, Versand, Gesamtzufriedenheit
- **Kommentare** zu Transaktionen
- **Verkäufer-Profil** mit Bewertungsübersicht

#### 4.2 Sicherheit und Schutz
- **Verifizierungssystem** für Nutzer
- **Meldefunktion** für verdächtige Angebote
- **Streitschlichtung**-Verfahren
- **Betrugsprävention**-Mechanismen
- **Käuferschutz** für abgesicherte Zahlungen

#### 4.3 Qualitätssicherung
- **Manuelle Prüfung** besonders wertvoller oder ungewöhnlicher Angebote
- **Community-Flagging** von problematischen Inseraten
- **Überprüfung** von Nutzern mit negativen Bewertungen

### 5. Spezielle Marketplace-Funktionen

#### 5.1 Sammlerbörse
- **Sonderbereich** für seltene oder wertvolle Spiele
- **Authentifizierungssystem** für wertvolle Sammlerstücke
- **Wertschätzungen** durch Experten (optional)
- **Auktionen** mit Mindestgeboten

#### 5.2 Lokale Spielemärkte
- **Lokale Tauschbörsen** organisieren
- **Pop-up Märkte** in Zusammenarbeit mit lokalen Läden
- **Spieleflohmarkt**-Events verwalten und bewerben

#### 5.3 Integration mit anderen Services
- **Automatische Aktualisierung** der persönlichen Sammlung nach Kauf/Verkauf
- **Event-Integration** für Spieleflohmarkt-Veranstaltungen
- **Wunschlisten-Integration** für Benachrichtigungen

## Technische Architektur

### Mikroservice-Integration

Der Marketplace-Service wird als eigenständiger Mikroservice implementiert, der mit folgenden bestehenden Services interagiert:

- **Library-Service**: Für Spieleinformationen und -metadaten
- **Community-Service**: Für Benutzerprofile, Bewertungen und soziale Verbindungen
- **Event-Service**: Für Marketplace-Events wie Flohmärkte

### Datenmodell

#### Listing (Inserat)
```
Listing {
  id: UUID
  sellerId: UserID
  gameId: GameID (Referenz zum Library-Service)
  title: String
  description: String
  condition: Enum(NEW, LIKE_NEW, GOOD, ACCEPTABLE, DAMAGED)
  conditionDescription: String
  completeness: Enum(COMPLETE, MISSING_MINOR, MISSING_MAJOR)
  missingParts: String (optional)
  images: [ImageURL]
  listingType: Enum(SALE, TRADE, LOAN, AUCTION)
  price: {
    amount: Number (optional für Tausch)
    currency: String
    negotiable: Boolean
  }
  tradeFor: [GameID] (optional, für Tausch)
  auction: {
    startingBid: Number
    currentBid: Number
    endTime: DateTime
    minimumBidIncrement: Number
  } (optional, für Auktion)
  shipping: {
    localPickup: Boolean
    shipping: Boolean
    shippingCosts: [
      {
        region: String
        cost: Number
      }
    ]
  }
  location: {
    city: String
    postalCode: String
    country: String
    coordinates: GeoPoint (optional)
  }
  status: Enum(ACTIVE, RESERVED, SOLD, CANCELLED, EXPIRED)
  expiresAt: DateTime
  reservedFor: UserID (optional)
  reservedUntil: DateTime (optional)
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Transaction (Transaktion)
```
Transaction {
  id: UUID
  listingId: ListingID
  sellerId: UserID
  buyerId: UserID
  type: Enum(SALE, TRADE, LOAN)
  status: Enum(INITIATED, PAYMENT_PENDING, PAID, SHIPPED, COMPLETED, CANCELLED, DISPUTED)
  amount: {
    price: Number
    shipping: Number
    total: Number
    currency: String
  }
  paymentMethod: String
  paymentDetails: Object (abhängig von Zahlungsmethode)
  shippingAddress: Address (optional)
  trackingInfo: {
    carrier: String
    trackingNumber: String
    shippedAt: DateTime
  } (optional)
  messageThread: ThreadID (Referenz zum Nachrichtensystem)
  exchangeItems: [GameID] (optional, für Tausch)
  loanPeriod: {
    startDate: DateTime
    endDate: DateTime
    deposit: Number
  } (optional, für Verleih)
  disputeInfo: {
    disputedAt: DateTime
    reason: String
    status: Enum(OPEN, RESOLVED_BUYER, RESOLVED_SELLER, CLOSED)
    resolution: String
  } (optional)
  notes: String
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Rating (Bewertung)
```
MarketplaceRating {
  id: UUID
  transactionId: TransactionID
  fromUserId: UserID
  toUserId: UserID
  userRole: Enum(BUYER, SELLER)
  rating: Number (1-5)
  communication: Number (1-5)
  accuracy: Number (1-5)
  shipping: Number (1-5) (optional)
  comment: String
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Offer (Angebot)
```
Offer {
  id: UUID
  listingId: ListingID
  buyerId: UserID
  type: Enum(PRICE_OFFER, TRADE_OFFER)
  priceOffer: {
    amount: Number
    currency: String
  } (optional)
  tradeOffer: [GameID] (optional)
  message: String
  status: Enum(PENDING, ACCEPTED, DECLINED, EXPIRED)
  expiresAt: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

### API-Endpunkte

#### Inserat-Endpunkte
- `GET /listings` - Inserate durchsuchen/filtern
- `GET /listings/:id` - Inserat-Details abrufen
- `POST /listings` - Neues Inserat erstellen
- `PUT /listings/:id` - Inserat aktualisieren
- `DELETE /listings/:id` - Inserat löschen/deaktivieren
- `GET /users/:id/listings` - Inserate eines Benutzers abrufen
- `POST /listings/:id/reserve` - Inserat reservieren

#### Angebots-Endpunkte
- `POST /listings/:id/offers` - Angebot für ein Inserat abgeben
- `GET /listings/:id/offers` - Angebote für ein Inserat abrufen (für Verkäufer)
- `GET /users/:id/offers` - Eigene Angebote abrufen
- `PUT /offers/:id` - Angebot akzeptieren/ablehnen/ändern
- `DELETE /offers/:id` - Angebot zurückziehen

#### Transaktions-Endpunkte
- `GET /transactions` - Eigene Transaktionen auflisten
- `GET /transactions/:id` - Transaktionsdetails abrufen
- `POST /transactions` - Transaktion initiieren (nach Angebotsannahme)
- `PUT /transactions/:id` - Transaktionsstatus aktualisieren
- `POST /transactions/:id/shipping` - Versandinformationen hinzufügen
- `POST /transactions/:id/dispute` - Konflikt melden
- `POST /transactions/:id/complete` - Transaktion abschließen

#### Bewertungs-Endpunkte
- `POST /transactions/:id/ratings` - Bewertung für Transaktion abgeben
- `GET /users/:id/marketplace-ratings` - Marketplace-Bewertungen eines Benutzers abrufen

#### Suchfunktions-Endpunkte
- `GET /marketplace/search` - Erweiterte Suche im Marketplace
- `POST /marketplace/saved-searches` - Suchanfrage speichern
- `GET /marketplace/saved-searches` - Gespeicherte Suchanfragen abrufen
- `DELETE /marketplace/saved-searches/:id` - Gespeicherte Suchanfrage löschen

### Event-Publikationen (NATS)

Der Marketplace-Service veröffentlicht und abonniert verschiedene Events über den NATS-Message-Broker:

#### Publizierte Events
- `listing-created`: Wenn ein neues Inserat erstellt wird
- `listing-updated`: Wenn ein Inserat aktualisiert wird
- `transaction-completed`: Wenn eine Transaktion abgeschlossen wird
- `game-ownership-changed`: Wenn ein Spiel den Besitzer wechselt

#### Abonnierte Events
- `user-profile-updated`: Um aktuelle Nutzerinformationen zu erhalten
- `game-provided`: Um neue/aktualisierte Spieleinformationen zu erhalten

## Implementierungsstrategie

### Phase 1: Grundlegende Marketplace-Funktionen
- Erstellung, Bearbeitung und Suche von Verkaufsangeboten
- Einfache Kommunikation zwischen Käufern und Verkäufern
- Grundlegende Transaktionsabwicklung

### Phase 2: Erweiterte Handelsfunktionen
- Tauschangebote und Verleihoptionen
- Preisvorschlagssystem
- Bewertungssystem für Käufer und Verkäufer

### Phase 3: Sicherheit und Zahlungen
- Sichere Zahlungsabwicklung mit Treuhandfunktion
- Käuferschutz-Mechanismen
- Streitschlichtungssystem
- Verifizierungsprozesse

### Phase 4: Spezialfunktionen
- Sammlerbörse mit Authentifizierung
- Auktionssystem
- Integration mit Events und Community-Funktionen
- Mobile App-Integration mit Barcode-Scanner für schnelles Erstellen von Inseraten

## Sicherheits- und Datenschutzaspekte

- **Sichere Zahlungen**: Integration mit vertrauenswürdigen Zahlungsdienstleistern
- **Identitätsüberprüfung**: Optional für höherwertige Transaktionen
- **Adressverifizierung**: Für sichere Versandabwicklung
- **Datenschutz**: Keine Weitergabe persönlicher Daten ohne Zustimmung
- **Betrugsbekämpfung**:
  - Automatische Erkennung verdächtiger Angebote
  - Überwachung von Preisanomalien
  - Nutzer-Verhaltensanalyse
- **Transaktionssicherheit**:
  - Escrow-Service für hochpreisige Objekte
  - Versicherungsoptionen für Versand
  - Dokumentation der gesamten Kommunikation

## Geschäftsmodell

- **Grundfunktionen kostenlos**
- **Premium-Listings**: Hervorgehobene Platzierung in Suchergebnissen
- **Transaktionsgebühren**: Prozentsatz des Verkaufspreises (3-8%)
- **Werbefreier Marketplace** für Premium-Mitglieder
- **Versicherungsschutz** für hochwertige Sendungen (optional)
- **Authentifizierungsservice** für Sammlerstücke (gegen Gebühr)
- **Werbeerlöse** durch kontextbezogene Anzeigen (z.B. für Spielezubehör)