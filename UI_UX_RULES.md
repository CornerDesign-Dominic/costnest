# UI/UX-Regeln für Costnest

## Produktname
Costnest

## Begriffswahl
- In der gesamten Anwendung wird konsequent der Begriff **Sammlung** verwendet.
- Begründung: Der Fokus liegt auf dem Sammeln, Vergleichen und Strukturieren von Produktlinks und Preisen, nicht auf klassischer Aufgabenverwaltung.

## Designziel
Costnest verfolgt eine moderne, klare und hochwertige Oberfläche mit ruhiger visueller Hierarchie.
Die Gestaltung ist seriös, aber frisch und richtet sich an junge sowie mittlere Altersgruppen.
Die Anwendung vermeidet sowohl verspielte Effekte als auch eine sterile ERP-/Behörden-Anmutung.

## Farbpalette (verbindlich)
- Hintergrund: `#F5F7FA`
- Cards und Flächen: `#FFFFFF`
- Primärtext: `#1F2937`
- Primärfarbe (Hauptbuttons, aktive Navigation, FAB): `#2563EB`
- Hover-Zustand Primärfarbe: `#1D4ED8`
- Positiv (günstiger, Ersparnis): `#16A34A`
- Negativ (teurer, Überschreitung): `#DC2626`

## Typografie
- Primärschrift: `"Segoe UI", "Aptos", "Helvetica Neue", sans-serif`.
- Fließtext: ruhige Lesbarkeit mit Zeilenhöhe um `1.5`.
- Überschriften sind klar gewichtet und leicht enger gespaced.
- KPI-Zahlen sind visuell stärker als KPI-Labels.

## Microcopy-Prinzip
- Grundsatz: **UI erklärt, Text unterstützt**.
- Texte sind kurz, präzise, direkt.
- Redundante Erklärungen werden entfernt.
- Keine langen Fließtexte unter Formularfeldern, wenn der Kontext klar ist.

## Microcopy-Limits
- Buttons: maximal `1-2` Wörter (z. B. `Speichern`, `Export`, `Starten`).
- Labels: maximal `1` Wort, nur wenn nötig `2` (z. B. `Link`, `Preis`, `Wunsch`, `Menge`).
- Empty State Titel: maximal `3` Wörter.
- Empty State Hinweis: maximal `3` Wörter.
- Toasts: maximal `1` Wort (z. B. `Gespeichert`, `Gelöscht`, `Aktualisiert`).

## Microcopy Vorher/Nachher
- Vorher: `Neuen Eintrag anlegen`
- Nachher: `Neuer Eintrag`
- Vorher: `Eintrag wirklich löschen?`
- Nachher: `Löschen?`
- Vorher: `Mit den aktuellen Filtern ...`
- Nachher: `Filter anpassen.`
- Vorher: `Aktueller Preis (optional)`
- Nachher: `Preis`

## Spacing-System
- Basisraster: 4/8 px.
- Standard-Card-Innenabstand: 16–24 px.
- Einheitliche Gaps für Kopfbereiche, KPI-Reihen, Formularfelder und Actions.
- Kein zufälliges Mixing aus engen und sehr großen Abständen.

## Schatten, Rahmen, Flächen
- Karten auf weißer Fläche mit dezenten, hellen Rahmen.
- Schatten weich und zurückhaltend zur Ebenentrennung.
- Keine harten, dunklen Blockrahmen.

## Sammlungskarten
- Gliederung in:
  - Kopfbereich: Sammlungsname links, Eintragsanzahl rechts, Stift-Hinweis dezent beim Namen.
  - Kennzahlenbereich: Shoppreise gesamt, Wunschpreise gesamt, Differenz.
- Kennzahlen wirken wie ruhige Informationszeile statt „Kästchen im Kasten“.
- Wichtigste Information bleibt der Sammlungsname.

## Eintragskarten (Item-Cards)
- Gliederung in:
  - Default (collapsed): Titel/Domain, Menge, IST-Gesamtpreis, farbige Gesamtdifferenz
  - Expanded on demand: Berechnungen, Notiz, Alternativen, Actions
- Preise und Differenz sind visuell klar gewichtet.
- Link ist gut klickbar und sauber integriert.
- Actions erscheinen erst im Expanded-State (Details on demand).
- Keine unnötigen Wiederholungstexte innerhalb der Card; Zahlen sind die primäre Information.
- Box-in-Box-Effekt vermeiden: keine Kachel-in-Kachel-Struktur.
- Die gesamte Card ist als Hauptinteraktion klickbar.

## Progressive Disclosure
- Item-Cards starten standardmäßig eingeklappt.
- Detailinformationen werden nur bei Bedarf eingeblendet.
- Collapsed-State zeigt nur die Kernkennzahlen für schnelle Orientierung.
- Expanded-State zeigt Rechenweg, Alternativen, Notiz und Bearbeitungsaktionen.
- Prinzip: **Zahlen > Text** und **Weniger sichtbar, mehr bei Bedarf**.

## Hierarchy First (Detailseite)
- Die visuelle Hierarchie priorisiert:
  - 1) Titel
  - 2) Menge
  - 3) IST-Gesamtpreis
  - 4) Gesamtdifferenz
- Sekundäre Informationen erscheinen erst im Expanded-State.
- Status ist bewusst zurückgenommen und nicht dominierend.

## Section Strength
- Weniger Einzelboxen, dafür stärkere Hauptflächen.
- Keine kleinteilige Box-in-Box-Struktur innerhalb der Item-Cards.
- Bereiche werden primär über Abstand, Typografie und leichte Tonwerte getrennt, nicht über harte Linien.
- Filter- und Gesamtbereich bleiben funktional, aber visuell nachgeordnet gegenüber den Item-Zahlen.

## Preisdarstellung in Item-Cards
- Aufbau immer in zwei Blöcken:
  - Block A: `IST` und `WUNSCH` nebeneinander (mobil untereinander)
  - Block B: `Differenz pro Stück` und `Differenz gesamt` darunter
- Darstellung je Seite:
  - Primär: Gesamtpreis
  - Sekundär: Rechenweg `Preis × Menge`
- Gesamtpreise sind die visuell dominantesten Zahlen im Preisbereich.
- Rechenwege sind kleiner und ruhiger (dezentere Farbe).
- Die Gesamtdifferenz ist stärker gewichtet als die Stückdifferenz.
- Farben:
  - Grün = günstiger
  - Rot = teurer
- Zahlen haben stets Vorrang vor Labels.

## Alternativen (collapsible)
- Alternativen sind standardmäßig eingeklappt.
- Toggle steht direkt über der Liste und zeigt die Anzahl im Format `Alternativen (N)`.
- Geöffneter Zustand ist visuell markiert und klar von geschlossen unterscheidbar.
- In der Liste werden kurze Linkdarstellungen verwendet (Domain/kurzer Text), keine langen URLs.
- Hinzufügen und Löschen bleiben direkt in der Card möglich.

## Status-Badges
- Status ist immer sichtbar (`Geplant` / `Gekauft`).
- Farbgebung bleibt dezent und klar verständlich.
- Status darf als kompakte Direktaktion genutzt werden, ohne visuelle Dominanz.
- Gekaufte Einträge bleiben standardmäßig sichtbar, wirken jedoch leicht abgeschwächt, ohne Interaktionen einzuschränken.

## KPI-Karten
- Summenbereiche nutzen denselben KPI-Stil.
- KPI-Label klein und ruhig, KPI-Wert klar hervorgehoben.
- Positive/negative Abweichungen nur über definierte Statusfarben darstellen.
- KPI-Bereiche einer Seite wirken als zusammengehörige Familie.

## Action-Platzierung in Cards
- Card-Actions liegen in der oberen Kontextzone.
- Reihenfolge und Gewichtung:
  - neutrale Aktionen zuerst
  - destruktive Aktion (`Löschen`) klar markiert, aber nicht dominant
- Löschaktionen benötigen immer Bestätigung.

## Filterleiste (Sammlungsdetail)
- Filterleiste bleibt kompakt und ruhig oberhalb der Item-Liste.
- Enthält Suche, Statusfilter, Option „Gekaufte ausblenden“ und Sortierung.
- Standardansicht zeigt alle Einträge; gekaufte Einträge werden nicht automatisch ausgeblendet.
- Filter betreffen ausschließlich die Listenansicht, nicht KPI-/Summenberechnungen.
- Bei widersprüchlichen Zuständen hat die Statusauswahl Vorrang.

## Modal- und Formularstil
- Modals folgen einer konsistenten Struktur: Kopf -> Inhalt -> Actions.
- Eingabefelder erhalten einheitliche Höhe, Radius und Fokusdarstellung.
- Fehlermeldungen direkt am Feld, knapp und verständlich.

## Leere Zustände
- Leere Zustände sind ruhig, zentriert und handlungsorientiert.
- Keine technischen Platzhalterformulierungen.
- Immer klarer nächster Schritt für Nutzende.

## Startseite
- Startseite bleibt kompakt und nutzt maximal drei Sektionen: Hero, Nutzenblock, optional kurzer Hinweis.
- Ziel ist sofortiges Verständnis in wenigen Sekunden: Was macht Costnest und was ist der nächste Klick.
- Keine technischen Begriffe im Introtext; Fokus auf Nutzen und Entscheidungssicherheit.

## Responsive Verhalten
- Desktop priorisiert: klare Hierarchie und breite, ruhige Lesefläche.
- Mobil: KPI- und Action-Bereiche sauber einspaltig.
- Klickziele bleiben ausreichend groß.

## Footer (global)
- Footer ist auf allen Seiten einheitlich vorhanden und liegt am Seitenende, nicht als fixiertes Element.
- Hintergrund dezent hellgrau, klare Trennlinie nach oben, zurückhaltende Typografie.
- Linkbereich enthält mindestens `Impressum` und `Datenschutz`.
- Footer-Text ist kleiner als Fließtext und visuell nachgeordnet.

## Erweiterbarkeit dieser Datei
Diese Datei ist die zentrale Sammelstelle für alle aktuellen und zukünftigen UI/UX-Regeln von Costnest.
Neue Regeln werden abschnittsweise ergänzt, ohne bestehende Kernregeln unstrukturiert zu überschreiben.

