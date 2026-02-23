# Planning: Release 2.4

## Themen & Fokuspunkte
*Hier sammeln wir kleinere Optimierungen (Quality of Life) und UI/UX-Verbesserungen, die als Zwischen-Release vor dem großen 3.0-Meilenstein eingeschoben werden.*
- **Sub-Routine Reordering:** Die Reihenfolge von Sub-Routinen soll im Dossier per Drag & Drop nachträglich anpassbar sein.
- **Installer Cleanup:** Entfernen fehlerhafter Code-Fragmente (Hyroglyphen) am Dateiende der `api/install.php`, da diese außerhalb des regulären PHP-Tags liegen.
- **UI Bugfix (Force Theme):** Der `CyberSelect` Dropdown-Layer für die Kategorie-Auswahl im "New Directive" Formular wird unten abgeschnitten (z-index / overflow Problem), wenn das Force-Theme (bzw. spezifische Themes) aktiv ist.
- **Kategorie Dropdown (Dashboard):** Auf der Directive Card soll die Kategorie über denselben `CyberSelect` Dropdown-Auswahllogik anpassbar sein wie im Dossier, anstatt simplem "Durchklicken".

## Neue User Stories

**US-2.4.1: Sub-Routinen per Drag & Drop sortieren**
* **Als** Nutzer
* **Möchte ich** die Reihenfolge meiner Sub-Routinen in einer Directive per Drag & Drop verändern können
* **Damit** ich auch im Nachhinein die Priorität oder den zeitlichen Ablauf der Teilschritte korrigieren kann, ohne sie löschen und neu anlegen zu müssen.
* **Akzeptanzkriterien:**
  - Im Directive Dossier wird neben jeder Sub-Routine ein "Drag Handle" (Zieh-Symbol) angezeigt.
  - Der Nutzer kann eine Sub-Routine per Maus festhalten und an eine andere Position in der Liste ziehen (Sortable List).
  - Beim Loslassen der Maus wird die neue Reihenfolge automatisch im Backend gespeichert.
  - Die geänderte Reihenfolge bleibt nach dem Neuladen der Seite bestehen.

**US-2.4.2: Category Dropdown auf Directive Cards**
* **Als** Nutzer
* **Möchte ich** auf der Task Card auf dem Dashboard bei der Kategorie ein Stylisches Dropdown (CyberSelect) öffnen, anstatt durch alle Kategorien zu cyclen
* **Damit** ich die Kategorie gezielt anpassen kann, im selben Look & Feel wie im Dossier
* **Akzeptanzkriterien:**
  - Klick auf das Kategorie-Badge öffnet ein Dropdown-Menü.
  - Das bisherige "Durchklicken" (On-Click Cycle) wird abgelöst.
  - Nach Auswahl schließt sich das Dropdown und speichert direkt in die Datenbank.

## Ergänzungen für den Testplan

**Zu US-2.4.1 (Sub-Routinen sortieren):**
- **Testfall:** Eine Directive mit drei Sub-Routinen (A, B, C) anlegen. Sub-Routine C per Drag & Drop an die erste Position ziehen. Modalschließen und neu laden. Prüfen, ob die Reihenfolge nun C, A, B ist.

**Zu US-2.4.2 (Category Dropdown Dashbaord):**
- **Testfall:** Auf dem Dashboard auf das Kategorie-Badge klicken. Das `CyberSelect` Dropdown öffnet sich. Neue Kategorie auswählen. Prüfen, dass sich das Badge sofort ändert und der Zustand nach Neuladen im Backend erhalten bleibt.
