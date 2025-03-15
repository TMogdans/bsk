# Mikrofrontend-Architektur für die Gesellschaftsspiel-Plattform

## Übersicht

Dieses Dokument beschreibt die Mikrofrontend-Architektur für die Gesellschaftsspiel-Plattform. Es erläutert den gewählten Ansatz, die technische Implementierung, Vorteile und Herausforderungen sowie konkrete Umsetzungsschritte für das Entwicklerteam.

## Was sind Mikrofrontends?

Mikrofrontends sind ein Architekturansatz, bei dem eine Frontend-Anwendung in kleinere, unabhängig voneinander entwickelbare, testbare und bereitstellbare Teile aufgeteilt wird. Dieser Ansatz erweitert das Konzept der Microservices auf den Frontend-Bereich.

### Kernprinzipien

1. **Unabhängige Teams**: Jedes Team kann autonom an seinem Teil des Frontends arbeiten
2. **Technologische Unabhängigkeit**: Freiheit bei der Wahl von Frameworks und Bibliotheken (mit sinnvollen Einschränkungen)
3. **Isolierte Codebasis**: Jedes Mikrofrontend hat seine eigene Codebasis
4. **Unabhängige Bereitstellung**: Separate CI/CD-Pipelines je Mikrofrontend
5. **Resiliente Anwendung**: Fehler in einem Mikrofrontend beeinflussen nicht die gesamte Anwendung

## Architektur

Die Mikrofrontend-Architektur der Gesellschaftsspiel-Plattform basiert auf einem "Runtime Integration"-Ansatz mit Webpack Module Federation.

### Komponenten der Architektur

```
┌─────────────────────────────────────────┐
│               Browser                   │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │           Shell-App             │    │
│  │  ┌───────────────────────────┐  │    │
│  │  │  Layout (Header, Footer)  │  │    │
│  │  │  Navigation               │  │    │
│  │  │  Routing                  │  │    │
│  │  │  Authentifizierung        │  │    │
│  │  └───────────────────────────┘  │    │
│  │                                 │    │
│  │  ┌─────────┐  ┌─────────────┐   │    │
│  │  │ Library │  │    Event    │   │    │
│  │  │   MFE   │  │     MFE     │   │    │
│  │  └─────────┘  └─────────────┘   │    │
│  │                                 │    │
│  │  ┌─────────┐  ┌─────────────┐   │    │
│  │  │Community│  │ Marketplace │   │    │
│  │  │   MFE   │  │     MFE     │   │    │
│  │  └─────────┘  └─────────────┘   │    │
│  │                                 │    │
│  │  ┌─────────────────────────┐    │    │
│  │  │ Shared Component Library│    │    │
│  │  └─────────────────────────┘    │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Shell-Anwendung (Container)

Die **Shell-Anwendung** ist die zentrale Komponente der Mikrofrontend-Architektur und erfüllt folgende Aufgaben:

1. **Orchestrierung der Mikrofrontends**:
   - Dynamisches Laden und Entladen der Mikrofrontends
   - Routing zu den entsprechenden Mikrofrontends basierend auf URL

2. **Bereitstellung gemeinsamer UI-Elemente**:
   - Header mit Navigation, Suche und Benutzermenü
   - Footer mit Links und Informationen
   - Globale Benachrichtigungen

3. **Verwaltung globaler Zustände**:
   - Authentifizierungsstatus
   - Benutzereinstellungen
   - Aktive Benachrichtigungen

4. **Konsistentes Benutzererlebnis**:
   - Einheitliches Styling
   - Konsistente Navigation
   - Nahtlose Übergänge zwischen Mikrofrontends

### Mikrofrontends

Unsere Plattform wird in folgende Mikrofrontends aufgeteilt:

1. **Library-MFE**:
   - Spielebibliothek-Ansicht
   - Spieldetailseiten
   - Spielsuche und -filter

2. **Event-MFE**:
   - Veranstaltungskalender
   - Event-Details
   - Event-Anmeldung und -Verwaltung

3. **Community-MFE**:
   - Benutzerprofile
   - Spielesammlungen
   - Freundschaftsverwaltung
   - Gruppen und Aktivitäten

4. **Messaging-MFE**:
   - Direktnachrichten
   - Benachrichtigungszentrale
   - Gruppenunterhaltungen

5. **Marketplace-MFE**:
   - Inserate erstellen und durchsuchen
   - Verkaufs- und Tauschabwicklung
   - Bewertungen und Feedback

### Shared Component Library

Eine zentrale Komponenten-Bibliothek stellt sicher, dass alle Mikrofrontends ein konsistentes Erscheinungsbild und Verhalten aufweisen:

- UI-Komponenten (Buttons, Forms, Cards, etc.)
- Design-Tokens (Farben, Typografie, Abstände)
- Utility-Funktionen
- API-Client-Abstraktion
- Authentifizierungs-Hooks

## Technische Implementierung

### Module Federation

Wir setzen auf **Webpack Module Federation** als Integrationsmethode für unsere Mikrofrontends. Dieser Ansatz ermöglicht:

- Dynamisches Laden von JavaScript-Modulen zur Laufzeit
- Teilen von gemeinsamen Abhängigkeiten
- Echte JavaScript-Integration (im Gegensatz zu iFrames)

#### Beispiel-Konfiguration

**Shell-App (webpack.config.js)**:

```javascript
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  // ... andere webpack-Konfigurationen
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        libraryApp: 'libraryApp@http://localhost:3001/remoteEntry.js',
        eventApp: 'eventApp@http://localhost:3002/remoteEntry.js',
        communityApp: 'communityApp@http://localhost:3003/remoteEntry.js',
        messagingApp: 'messagingApp@http://localhost:3004/remoteEntry.js',
        marketplaceApp: 'marketplaceApp@http://localhost:3005/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, eager: true, requiredVersion: '^18.0.0' },
        '@brettspiel/design-system': { singleton: true, eager: true },
      },
    }),
  ],
};
```

**Library-MFE (webpack.config.js)**:

```javascript
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  // ... andere webpack-Konfigurationen
  plugins: [
    new ModuleFederationPlugin({
      name: 'libraryApp',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App',
        './GameDetails': './src/components/GameDetails',
        './GameList': './src/components/GameList',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        '@brettspiel/design-system': { singleton: true },
      },
    }),
  ],
};
```

### Routing

Das Routing erfolgt auf zwei Ebenen:

1. **Shell-Routing**: Leitet zu den entsprechenden Mikrofrontends
2. **Mikrofrontend-internes Routing**: Verwaltet Routes innerhalb des Mikrofrontends

**Beispiel für Shell-Routing mit React Router**:

```jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const LibraryApp = lazy(() => import('libraryApp/App'));
const EventApp = lazy(() => import('eventApp/App'));
const CommunityApp = lazy(() => import('communityApp/App'));
const MessagingApp = lazy(() => import('messagingApp/App'));
const MarketplaceApp = lazy(() => import('marketplaceApp/App'));

function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/library/*" element={<LibraryApp />} />
          <Route path="/events/*" element={<EventApp />} />
          <Route path="/community/*" element={<CommunityApp />} />
          <Route path="/messages/*" element={<MessagingApp />} />
          <Route path="/marketplace/*" element={<MarketplaceApp />} />
          <Route path="/" element={<Navigate to="/library" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### State Management

Der Zustandsmanagement-Ansatz besteht aus mehreren Ebenen:

1. **Globaler Zustand** in der Shell-App:
   - Authentifizierung
   - Globale Benutzereinstellungen
   - App-übergreifende Benachrichtigungen

2. **Mikrofrontend-lokaler Zustand**:
   - Feature-spezifischer Zustand
   - UI-Zustand innerhalb des Mikrofrontends

3. **Zustandsaustausch zwischen Mikrofrontends**:
   - Event-basierte Kommunikation
   - Zustandssynchronisation über einen gemeinsamen Store
   - URL-Parameter für einfache Datenübergabe

**Beispiel für globalen Auth-Kontext**:

```jsx
// In der Shell-App
export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auth-Status abrufen
    authService.getCurrentUser()
      .then(user => {
        setUser(user);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      <AppLayout>
        <AppRouter />
      </AppLayout>
    </AuthContext.Provider>
  );
}
```

## Umsetzungsstrategie für das 1-2 Entwickler-Team

Für ein Team mit 1-2 Entwicklern ist eine effiziente Umsetzungsstrategie besonders wichtig:

### 1. Inkrementeller Ansatz

1. **Basis-Shell zuerst entwickeln**:
   - Grundlegende Navigation und Layout
   - Authentifizierungslogik
   - Routing-Grundstruktur

2. **Shared Component Library parallel aufbauen**:
   - Design-System-Grundlagen
   - Häufig genutzte UI-Komponenten
   - Utility-Funktionen und Hooks

3. **Ein Mikrofrontend nach dem anderen entwickeln**:
   - Mit dem wichtigsten Mikrofrontend beginnen (vermutlich Library-MFE)
   - Dann Event-MFE als zweiten Schwerpunkt
   - Schrittweise weitere Mikrofrontends hinzufügen

### 2. Entwicklungsworkflow

1. **Lokale Entwicklung**:
   - Shell-App und aktives Mikrofrontend parallel starten
   - Hot Module Replacement für schnelles Feedback
   - Storybook für isolierte Komponentenentwicklung

2. **Gemeinsame Codebasis**:
   - Monorepo-Ansatz mit pnpm Workspaces
   - Gemeinsame Konfigurationen und Abhängigkeiten
   - Konsistente Linting- und Formatting-Regeln

3. **Shared Components zuerst**:
   - UI-Komponenten vorab in Storybook entwickeln
   - Gemeinsame Funktionalität extrahieren
   - Strikte Vertragstests für Schnittstellen

### 3. Priorisierte Entwicklungsroadmap

#### Phase 1: Basis-Infrastruktur (1 Monat)
- Shell-App mit grundlegender Navigation
- Design-System-Grundlagen
- Authentication-Workflow
- Erste gemeinsame Komponenten

#### Phase 2: Erste Mikrofrontends (2-3 Monate)
- Library-MFE: Spielebibliothek und -details
- Event-MFE: Veranstaltungskalender und -details

#### Phase 3: Community-Integration (2-3 Monate)
- Community-MFE: Profile und Spielesammlungen
- Integration zwischen den ersten drei Mikrofrontends

#### Phase 4: Kommunikation und Erweiterung (2-3 Monate)
- Messaging-MFE
- Marketplace-MFE (Basisversion)

### 4. Einsatz externer Unterstützung

- **Architektur-Setup**: Externe Hilfe für die initiale Konfiguration der Mikrofrontend-Architektur
- **Design-System**: Unterstützung bei der Entwicklung des Basis-Design-Systems
- **Review-Prozesse**: Regelmäßige externe Reviews der Architektur und Implementierung

## Vorteile der Mikrofrontend-Architektur für die Gesellschaftsspiel-Plattform

1. **Strukturierte Entwicklung**:
   - Klare Abgrenzung der Funktionsbereiche
   - Reduzierte Komplexität pro Mikrofrontend
   - Einfachere Wartung und Erweiterung

2. **Unabhängiges Deployment**:
   - Separate Deployments pro Mikrofrontend möglich
   - Geringeres Risiko bei Änderungen
   - Schnellere Iteration für einzelne Features

3. **Bessere Skalierbarkeit**:
   - Horizontale Skalierung verschiedener Mikrofrontends
   - Gezielte Performance-Optimierung
   - Ausfallsicherheit durch Isolation

4. **Zukunftssicherheit**:
   - Einfachere technologische Aktualisierung
   - Graduelle Migration möglich
   - Flexibilität für zukünftige Teams und Skalierung

## Herausforderungen und Mitigationsstrategien

### Herausforderungen

1. **Konsistenz wahren**:
   - Design-Konsistenz über Mikrofrontends hinweg
   - Gemeinsame UX-Patterns sicherstellen
   - Verhaltenskonsistenz bei gemeinsamen Funktionen

2. **Overhead für kleine Teams**:
   - Zusätzliche Komplexität in der Build-Konfiguration
   - Mehr zu wartende Repositories/Projekte
   - Mehr Testing-Aufwand

3. **Performance-Overhead**:
   - Zusätzliche HTTP-Requests für Mikrofrontends
   - Größere Bundle-Größen durch duplizierte Abhängigkeiten
   - Komplexeres Caching

### Mitigationsstrategien

1. **Für Konsistenz**:
   - Starkes Shared Component Library
   - Automatisierte Stil- und Accessibility-Tests
   - Regelmäßige Design-Reviews

2. **Für Team-Overhead**:
   - Monorepo-Ansatz zur Reduzierung der Repository-Verwaltung
   - Automatisierte Prozesse für häufige Aufgaben
   - Modulare Architektur mit klaren Verträgen

3. **Für Performance**:
   - Gemeinsame Abhängigkeiten korrekt konfigurieren
   - Aggressive Caching-Strategien
   - Lazy-Loading und Code-Splitting

## Konkrete Beispiele für Mikrofrontends

### Library-MFE
```jsx
// src/App.js im Library-MFE
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GameLibrary from './pages/GameLibrary';
import GameDetails from './pages/GameDetails';
import { useSharedAuth } from '@brettspiel/shared/hooks';

export default function LibraryApp() {
  const { user, isLoading } = useSharedAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="library-app">
      <Routes>
        <Route path="/" element={<GameLibrary />} />
        <Route path="/games/:gameId" element={<GameDetails />} />
      </Routes>
    </div>
  );
}
```

### Event-MFE
```jsx
// src/App.js im Event-MFE
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EventCalendar from './pages/EventCalendar';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import { useSharedAuth } from '@brettspiel/shared/hooks';

export default function EventApp() {
  const { user, isLoading } = useSharedAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="event-app">
      <Routes>
        <Route path="/" element={<EventCalendar />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route 
          path="/create" 
          element={user ? <CreateEvent /> : <Navigate to="/auth/login" />} 
        />
      </Routes>
    </div>
  );
}
```

## Sicherheit und Compliance

Bei der Implementierung der Mikrofrontend-Architektur müssen folgende Sicherheitsaspekte beachtet werden:

1. **Cross-Origin Resource Sharing (CORS)**:
   - Korrekte CORS-Konfiguration für alle Mikrofrontends
   - Sichere Header-Konfiguration

2. **Content Security Policy (CSP)**:
   - Strikte CSP für die Shell-Anwendung
   - Dynamisches Nachladen von Skripten berücksichtigen

3. **Authentifizierung und Autorisierung**:
   - Sichere Token-Speicherung
   - Einheitliche Berechtigungsprüfung
   - Schutz vor CSRF und XSS

4. **Datenschutz**:
   - DSGVO-konforme Datenhaltung
   - Minimierung von geteilten Benutzerdaten

## Fazit

Die Mikrofrontend-Architektur bietet für die Gesellschaftsspiel-Plattform einen strukturierten Ansatz zur Entwicklung eines komplexen Frontends. Besonders für ein kleines Entwicklerteam ermöglicht sie eine fokussierte, inkrementelle Entwicklung mit klaren Grenzen zwischen Funktionsbereichen.

Durch den strategischen Einsatz von Module Federation, einer starken Shared Component Library und einem inkrementellen Entwicklungsansatz kann auch ein 1-2 Entwickler-Team eine skalierbare, wartbare Frontend-Architektur aufbauen.

Der Schlüssel zum Erfolg liegt in der richtigen Balance zwischen Unabhängigkeit der Mikrofrontends und Konsistenz des Gesamtsystems, was durch die Shell-Anwendung und die gemeinsame Komponentenbibliothek gewährleistet wird.