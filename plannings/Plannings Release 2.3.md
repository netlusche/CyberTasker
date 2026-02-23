# Planning: Release 2.3

## Themen & Fokuspunkte
*Hier sammeln wir im Laufe unserer Planung die übergeordneten Ziele und Features für Release 2.3. Dies ist ein fokussiertes "Workflow & Stability" Update, bevor die große Multi-Tenant-Architektur in 3.0 ansteht.*
- **Cross-Database Reliability:** Implementierung einer automatisierten E2E-Test-Pipeline, um sicherzustellen, dass die Applikation nahtlos auf SQLite und SQLite/MariaDB funktioniert.
- **Sub-Routinen (Checklisten):** Möglichkeit, große Directives im Dossier in kleinere, abhakbare Teilaufgaben (Sub-Routinen) zu unterteilen, inkl. Fortschrittsanzeige auf dem Dashboard.
- **Scheduled Protocols:** Wiederkehrende Aufgaben, die sich nach Abschluss nach einem definierten Muster (täglich, wöchentlich, monatlich) neu generieren.

## Neue User Stories
*Hier formulieren wir die daraus resultierenden konkreten User Stories.*

**US-2.3.1: Automated Cross-Database E2E Pipeline**
* **Als** System-Architekt
* **Möchte ich**, dass die E2E Playwright-Tests automatisiert nach jedem Push gegen SQLite *und* MariaDB/MySQL validiert werden
* **Damit** inkonsistente SQL-Syntax (die z.B. nur unter MariaDB knallt) direkt geblockt wird.
* **Akzeptanzkriterien:**
  - GitHub Actions Workflow (`.github/workflows/e2e-tests.yml`) testet beide Datenbank-Engines parallel durch.

**US-2.3.2: Sub-Routinen in Directives anlegen**
* **Als** Nutzer
* **Möchte ich** im Directive Dossier Teilaufgaben (Sub-Routinen) zu einer Directive hinzufügen, bearbeiten und löschen können
* **Damit** ich komplexe Aufgaben besser in machbare Einzelschritte strukturieren kann.
* **Akzeptanzkriterien:**
  - Im Directive Dossier gibt es einen Bereich für Sub-Routinen.
  - Sub-Routinen können als erledigt (abgehakt) oder offen markiert werden.
  - Sub-Routinen können inline per Klick auf den Text editiert werden (ähnlich dem Haupttitel).
  - Der Zustand der Sub-Routinen wird im Backend gespeichert.

**US-2.3.3: Fortschrittsanzeige für Sub-Routinen auf dem Dashboard**
* **Als** Nutzer
* **Möchte ich** auf der Directive Card auf dem Dashboard direkt sehen, wie viele Sub-Routinen bereits abgeschlossen sind (z. B. "3/5")
* **Damit** ich den Fortschritt meiner laufenden Aufgaben auf einen Blick erfassen kann, ohne das Dossier extra öffnen zu müssen.
* **Akzeptanzkriterien:**
  - Jede Directive Card mit konfigurierten Sub-Routinen zeigt visuell den aktuellen Fortschritt an.
  - Sind bei einer Directive keine Sub-Routinen definiert, wird auch keine Fortschrittsanzeige gerendert.

**US-2.3.4: Scheduled Protocols (Wiederkehrende Directives)**
* **Als** Nutzer
* **Möchte ich** beim Erstellen oder Bearbeiten einer Directive festlegen können, dass diese wiederkehrend ist (z.B. täglich, wöchentlich, monatlich)
* **Damit** mir Routineaufgaben nach deren Abschluss automatisch für den nächsten Rhythmus neu angelegt werden.
* **Akzeptanzkriterien:**
  - Im Dossier kann ein Wiederholungsintervall ausgewählt werden (None, Daily, Weekly, Monthly etc.).
  - Optional kann ein "Enddatum" (recurrence_end_date) definiert werden, bis zu dem Aufgaben wiederholt werden.
  - Wird eine solche Directive "gehackt" (abgeschlossen), generiert das System automatisch zur Laufzeit *genau eine* neue, offene Directive mit denselben Eigenschaften. Dies verhindert von vornherein unendliche Aufgaben-Warteschlangen.
  - Das Fälligkeitsdatum (Due Date) der neuen Directive wird basierend auf dem Intervall korrekt in die Zukunft gesetzt.
  - **Auto-Fälligkeit:** Wird für eine wiederkehrende Directive kein Fälligkeitsdatum (Due Date) gesetzt, wird dies beim Speichern serverseitig automatisch auf "Heute" initialisiert, um den Start des Wiederholungs-Zyklus sicherzustellen.
  - Liegt das neu berechnete Fälligkeitsdatum nach dem definierten Enddatum, bricht die Kette ab und es wird keine neue Directive generiert.
  - **Holo-Projektionen:** In der Kalender-Ansicht generiert das Backend virtuelle "Projektionen" dieser wiederkehrenden Aufgaben in die Zukunft (z.B. Daily=14, Weekly=10, Monthly=10 Termine), damit der Nutzer weitreichend planen kann, ohne dass die Datenbank vollgemüllt wird.


## Ergänzungen für den Testplan
*Hier notieren wir uns, welche Testfälle neu in den Testplan aufgenommen werden müssen.*

**Zu US-2.3.1 (Cross-Database E2E Pipeline):**
- **Testfall:** Manueller Start der Workflow-Datei in GitHub ("workflow_dispatch"). Verifizieren, dass der MariaDB-Job grün wird und die identische Codebase wie unter SQLite vollständig sauber läuft.

**Zu US-2.3.2 & 2.3.3 (Sub-Routinen):**
- **Testfall:** Neue Directive erstellen, drei Sub-Routinen hinterlegen. Auf dem Dashboard prüfen, ob der Indikator "0/3" anzeigt.
- **Testfall:** Im Dossier eine der Sub-Routinen abhaken. Auf dem Dashboard prüfen, ob "1/3" sichtbar wird.
- **Testfall:** Auf den Text einer Sub-Routine klicken, den Text verändern und speichern (Blur/Enter). Die geänderte Sub-Routine wird nach Neuladen weiterhin korrekt angezeigt. Die abgehakte Routine löschen -> "0/2".

**Zu US-2.3.4 (Scheduled Protocols):**
- **Testfall (Regulär):** Directive als "Weekly" anlegen und Due Date auf "Heute" setzen. Directive als "Done" markieren. Prüfen, ob das System im Rahmen der Speicherung eine zweite, offene Directive mit Datum "Heute + 7 Tage" anlegt, welche exakt dieselben Inhalte und das Weekly-Intervall besitzt.
- **Testfall (Enddatum erreicht):** Directive als "Daily" anlegen, Due Date auf "Heute" und Enddatum auf "Gestern" (bzw. ein Datum in der Vergangenheit) setzen. Task als "Done" markieren. Prüfen, dass **kein** weiterer Task generiert wird.
- **Testfall (Ohne Startdatum):** Directive als "Daily" anlegen, jedoch *kein* Due Date setzen. Speichern. Überprüfen, dass die Directive in der Liste und im Kalender auftaucht und automatisch den heutigen Tag als Fälligkeitsdatum ("Today") zugewiesen bekommen hat.
- **Testfall (Holo-Projektionen):** Directive als "Weekly" anlegen. Kalender öffnen und prüfen, dass für die nächsten 10 Wochen virtuelle Kopien (Projektionen) dieses Tasks angezeigt werden, welche sich grafisch von echten Tasks unterscheiden.
