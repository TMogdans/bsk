# Diagramm-Richtlinien

## Wann welches Tool verwenden

| Diagrammtyp | Tool | Begründung |
|-------------|------|------------|
| System-Kontext | PlantUML | Komplexe Beziehungen, detailliertere Styling-Optionen |
| Service-Übersicht | Mermaid | Direkte Einbettung in GitHub, einfach zu aktualisieren |
| Datenmodell | PlantUML | Bessere Unterstützung für Klassendiagramme und Beziehungen |
| Prozessablauf | Mermaid | Einfache Flowcharts, direkte Integration |
| Sequenzabläufe | Je nach Komplexität | Mermaid für einfache, PlantUML für komplexe Abläufe |

## Farben und Styling

### Services
- Library-Service: #d5e8d4 (Hellgrün)
- Rating-Services: #ffe6cc (Hellorange)
- Event-Service: #dae8fc (Hellblau)

### Infrastruktur
- Datenbanken: #f5f5f5 (Hellgrau)
- Message Bus: #e1d5e7 (Helllila)

## Speicherorte
- PlantUML-Dateien: `_documentation/diagrams/plantuml/`
- Mermaid-Dateien: `_documentation/diagrams/mermaid/`
- Gerenderte Bilder: `_documentation/diagrams/rendered/`