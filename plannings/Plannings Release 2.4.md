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
  - **Theming & Multi-Language:** Das Dropdown muss das aktuell gewählte Theme adaptieren und mehrsprachig unterstützt werden (falls hier feste Texte existieren).

**US-2.4.3: Keyboard Shortcuts (Quick Actions & Navigation)**
* **Als** Nutzer
* **Möchte ich** grundlegende Aktionen mit der Tastatur durchführen können (z.B. `N` für "New", `/` für Suche)
* **Damit** ich die App schneller und ohne Maus steuern kann, was meinen Workflow deutlich beschleunigt.
* **Akzeptanzkriterien:**
  - `N` öffnet das Formular für eine "New Directive".
  - `/` fokussiert die Suchleiste auf dem Dashboard.
  - `Esc` schließt alle geöffneten Modals oder Layer zuverlässig.

**US-2.4.4: Directive Duplizieren (1-Klick Template)**
* **Als** Nutzer
* **Möchte ich** eine bestehende Directive mit einem Klick duplizieren können
* **Damit** ich schnell ähnliche Aufgaben anlegen kann, bei denen Titel, Kategorie und Beschreibung bereits vorausgefüllt sind.
* **Akzeptanzkriterien:**
  - Im Directive Dossier existiert ein kleiner "Duplicate"-Action-Button.
  - Klickt man darauf, öffnet sich das reguläre "New Directive" Formular.
  - Das Formular ist mit den relevanten Daten der Ursprungs-Directive vorausgefüllt.

**US-2.4.5: Globale Quick-Filter "Pills" (Dashboard)**
* **Als** Nutzer
* **Möchte ich** auf dem Dashboard per Klick auf kleine "Pills" vordefinierte Filter setzen (z.B. "Nur Offene", "Überfällig")
* **Damit** ich schneller die Ansicht anpassen kann, ohne Suchbegriffe einzutippen.
* **Akzeptanzkriterien:**
  - An der Suchleiste werden 2-4 klickbare Filter-Pills eingeblendet.
  - Die Pills werden platzsparend horizontal nebeneinander gerendert (auf Desktop direkt neben der Suchleiste, responsive umbrechend).
  - **Wichtig:** Bei MouseOver auf eine Pill wird ein Tooltip angezeigt, der als Text kurz erklärt, was der Filter exakt tut.
  - Ein Klick auf die Pill wendet den Filter direkt auf die Cards auf dem Dashboard an. Erneuter Klick hebt die Filterung auf.
  - **Theming & Multi-Language:** Die Pills und deren Tooltips müssen ihre Texte über Keys aus den Lokalisierungsdateien (i18n) beziehen und sich farblich dynamisch in das jeweilige Theme einfügen.

**US-2.4.6: Pre-Release Translation Check Protocol**
* **Als** Maintainer/Developer
* **Möchte ich** vor jedem neuen Release automatisch oder systematisch prüfen, ob alle Übersetzungen vollständig sind
* **Damit** keine lückenhaften Sprachdateien ausgeliefert werden und das Fallback nicht einspringen muss.
* **Akzeptanzkriterien:**
  - In den Release-Prozess (bspw. Master Testplan oder Pull Request Guidelines) wird ein fixer Check integriert.
  - Ein Prüfskript (z.B. `check-translations.js`) kann verwendet werden, um festzustellen, ob alle Keys aus dem englischen Baseline-File in allen anderen Sprachen vorhanden sind.
  - **Wichtig:** English (`en`) ist ab sofort die globale Fallback-Sprache für alle Übersetzungen.

## Ergänzungen für den Testplan

**Zu US-2.4.1 (Sub-Routinen sortieren):**
- **Testfall:** Eine Directive mit drei Sub-Routinen (A, B, C) anlegen. Sub-Routine C per Drag & Drop an die erste Position ziehen. Modalschließen und neu laden. Prüfen, ob die Reihenfolge nun C, A, B ist.

**Zu US-2.4.2 (Category Dropdown Dashbaord):**
- **Testfall:** Auf dem Dashboard auf das Kategorie-Badge klicken. Das `CyberSelect` Dropdown öffnet sich. Neue Kategorie auswählen. Prüfen, dass sich das Badge sofort ändert und der Zustand nach Neuladen im Backend erhalten bleibt.
- **Testfall (Theming/i18n):** Wechsel der Sprache und des Themes in den Einstellungen. Prüfen, dass das Dropdown korrekt im neuen Theme gerendert wird und (falls zutreffend) übersetzte Texte anzeigt.

**Zu US-2.4.3 (Keyboard Shortcuts):**
- **Testfall:** Dashboard öffnen, Taste `N` drücken. Prüfen, dass das "New Directive"-Formular geöffnet wird. ESC drücken. Prüfen, dass das Formular geschlossen wird. Taste `/` drücken. Prüfen, dass die Suchleiste fokussiert ist.

**Zu US-2.4.4 (Directive Duplizieren):**
- **Testfall:** Directive Dossier einer existierenden Aufgabe (z.B. mit Titel "Bugfix" und Kategorie "Bug") öffnen. Auf den Duplizieren-Button klicken. Prüfen, dass sich das "New Directive" Formular öffnet und die Eingabefelder vorausgefüllt sind.

**Zu US-2.4.5 (Globale Quick-Filter "Pills"):**
- **Testfall:** Dashboard aufrufen. Über eine Filter-Pill hovern und prüfen, ob der Tooltip-Text korrekt angezeigt wird. Auf die Pill klicken und verifizieren, dass das Dashboard gefiltert wird. Erneuter Klick hebt den Filter wieder auf.
- **Testfall (Theming/i18n):** Wechsel der Sprache in den Settings. Prüfen, dass die Pill-Texte und Tooltips umgehend in der neuen Sprache angezeigt werden. Prüfung, dass die visuellen Effekte der Pills (Hover, Active State) dem aktuellen Theme entsprechen.

**Zu US-2.4.6 (Pre-Release Translation Check):**
- **Testfall:** Vor dem Build-Schritt sicherstellen, dass das Translation-Check-Skript (oder manueller Review) durchläuft. Verifizieren, dass als globale `fallbackLng` in `src/i18n.js` der Wert `en` gesetzt ist.
