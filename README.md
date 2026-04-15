# Costnest

Costnest ist eine lokal ausführbare Webanwendung zum Sammeln von Produktlinks und Preisständen aus Online-Shops.
Die App läuft ohne Build-Prozess, ohne Frameworks und speichert alle Daten ausschließlich im `localStorage`.

## Geplante Domain

- Ausgewählte spätere Domain: `costnest.de`

## Was gebaut wurde

- Startseite mit Hero-Bereich und direktem Einstieg in die Sammlungsübersicht
- Sammlungsübersicht mit:
  - Anzeige aller Sammlungen als klickbare Karten
  - Kennzahlen pro Sammlung (Einträge, Shoppreis-Summe, Wunschpreis-Summe)
  - Modal zum Erstellen und Bearbeiten von Sammlungsnamen
- Sammlungsdetailseite mit:
  - eintragsbezogener Listenansicht
  - Filter, Suche und Sortierung
  - Einträge hinzufügen, bearbeiten, löschen und Status wechseln
  - Alternativen je Eintrag (kompakt, aufklappbar)
  - Summenkarte
  - CSV-Export der aktuellen Sammlung
- Persistenz über `localStorage` inkl. Migration älterer Datenstrukturen

## Struktur

```text
.
|-- index.html
|-- pages/
|   |-- collections.html
|   `-- collection-detail.html
|-- assets/
|   |-- css/
|   |   |-- base.css
|   |   |-- layout.css
|   |   |-- components.css
|   |   `-- pages.css
|   `-- js/
|       |-- core/
|       |   |-- namespace.js
|       |   `-- bootstrap.js
|       |-- pages/
|       |   |-- home-page.js
|       |   |-- collections-page.js
|       |   `-- collection-detail-page.js
|       |-- ui/
|       |   |-- header.js
|       |   |-- footer.js
|       |   |-- modal.js
|       |   `-- toast.js
|       |-- data/
|       |   |-- collection-repository.js
|       |   `-- item-repository.js
|       |-- storage/
|       |   `-- local-storage-service.js
|       `-- utils/
|           |-- currency.js
|           |-- id.js
|           |-- item-view.js
|           `-- validation.js
|-- UI_UX_RULES.md
`-- README.md
```

## Lokal öffnen

1. `index.html` direkt im Browser öffnen.
2. Über den Header zu **Sammlungen** wechseln.
3. Eine neue Sammlung erstellen.
4. Sammlung öffnen und Einträge verwalten.

## Datenspeicherung

- Hauptschlüssel: `costnest.appData.v2`
- Aktuelle Struktur:
  - `collections`: Liste der Sammlungen (`id`, `name`, `createdAt`)
  - `items`: Liste der Einträge (`id`, `collectionId`, `shopLink`, `title`, `currentPrice`, `targetPrice`, `quantity`, `status`, `note`, `alternatives`, `createdAt`)
- UI-View-State pro Sammlung:
  - Schlüssel: `costnest.collectionDetailView.v1.<collectionId>`

## Migration und Rückwärtskompatibilität

- Alte Daten mit `projects` werden automatisch als `collections` gelesen.
- Alte Einträge mit `projectId` werden automatisch auf `collectionId` übernommen.
- Alte App-Daten unter `costrack.appData.v2` werden weiterhin automatisch geladen.
- Legacy-Eintragslisten aus `costrack.projectEntries.v1` und `costrack.collectionEntries.v1` bleiben lesbar.
- Zusätzlich werden Übergangs-Keys `costnest.projectEntries.v1` und `costnest.collectionEntries.v1` unterstützt.
- Bereits gespeicherte Filterzustände aus `costrack.collectionDetailView.v1.<id>`, `costrack.projectDetailView.v1.<id>` und `costnest.projectDetailView.v1.<id>` werden als Fallback weiterverwendet.

