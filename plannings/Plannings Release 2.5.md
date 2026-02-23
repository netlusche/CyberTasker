# Planning: Release 2.5

## Themen & Fokuspunkte
*Vorrangiges Ziel dieses Releases ist die Verbesserung der Barrierefreiheit (Accessibility) und der Usability durch durchgängige Tooltips und eine konsistente Tastatursteuerung.*
- **Systemweite Tooltips:** Hinzufügen von erklärenden Kurztexten (MouseOver) an relevanten Bedienelementen, wo diese aktuell fehlen. Vollständig multilingual.
- **Tastaturnavigation (Tab-Routing):** Vereinheitlichung und Sicherstellung einer logischen, applikationsweiten Navigation primär per Tabulator-Taste.
- **Lokalisierung XP-Dashboard-Box:** Übersetzung der aktuell rein englischsprachigen XP-Fortschrittsanzeige.
- **Admin-Hinweise & Qualitätssicherung:** Einfügen der Release-Version im Admin-Panel und Einführung strikterer PR-Checks für Theming und Lokalisierung.

## Neue User Stories

**US-2.5.1: Multilinguale Tooltips für Bedienelemente**
* **Als** Nutzer
* **Möchte ich** beim Hovern über Icons, Buttons und komplexe Bedienelemente einen kurzen, erklärenden Text (Tooltip) sehen
* **Damit** ich die Funktion des Elements ohne Ausprobieren sofort verstehe, insbesondere bei neuen oder selten genutzten Features.
* **Akzeptanzkriterien:**
  - Tooltips werden nach einer kurzen Verzögerung beim MouseOver auf relevanten UI-Elementen (ohne offensichtliche Text-Labels) angezeigt.
  - Alle Tooltip-Texte sind konsequent in das bestehende i18n-System integriert und unterstützen alle verfügbaren Sprachen.
  - Visuelles Design der Tooltips fügt sich nahtlos in das aktuelle Theme ein.

**US-2.5.2: Applikationsweites Navigationskonzept per Tab-Taste**
* **Als** (Power-)Nutzer oder Nutzer mit Einschränkungen
* **Möchte ich** die gesamte Applikation logisch und konsistent per Tab-Taste bedienen können
* **Damit** ich Formulare, Listen und Aktionen schnell ohne Mausbefehle durchlaufen und auslösen kann.
* **Akzeptanzkriterien:**
  - Konsequente Vergabe bzw. Bereinigung von `tabindex`-Attributen oder Nutzung semantischen HTMLs über alle Views hinweg.
  - Sichtbarer, barrierefreier Fokus-State (passend zum Theme) für das aktuell per Tab fokussierte Element.
  - Modals/Layer fangen den Tab-Fokus ein ("Focus Trap"), solange sie geöffnet sind, damit man nicht unsichtbar im Hintergrund weiternavigiert.

**US-2.5.3: Lokalisierung der XP-Fortschrittsanzeige**
* **Als** (nicht englischsprachiger) Nutzer
* **Möchte ich** die XP-Fortschrittsbox auf dem Dashboard in meiner ausgewählten Sprache sehen
* **Damit** ich die angezeigten Level- und Fortschrittstexte verstehen kann und das UI konsistent erscheint.
* **Akzeptanzkriterien:**
  - Alle Texte innerhalb der XP-Box (wie z.B. "Level", "XP to next level", etc.) beziehen ihre Werte aus der i18n-Übersetzungsdatei.
  - Gewährleistung, dass auch bei langen Übersetzungen das Layout der Box auf dem Dashboard nicht zerbricht.

**US-2.5.4: Anzeige der Versionsnummer im Admin-Panel**
* **Als** Administrator
* **Möchte ich** im Admin-Panel auf einen Blick sehen, in welcher Version das System aktuell läuft
* **Damit** ich bei Support-Anfragen oder Updates sofort die korrekte Versionsnummer ("CyberTracker vX.X.X") parat habe.
* **Akzeptanzkriterien:**
  - Am unteren Rand der Admin-Konsole wird dezent (kleine Schriftart) die aktuelle Version angezeigt.
  - Die Version wird dynamisch aus einer zentralen Konfigurations- oder Konstanten-Datei gelesen.

**US-2.5.5: CI/CD Pipeline-Erweiterung für Konsistenzprüfungen**
* **Als** Entwickler
* **Möchte ich**, dass Pull Requests automatisch auf fehlende Übersetzungen und inkonsistente Theme-Variablen geprüft werden
* **Damit** keine UI-Bugs durch vergessene Lokalisierungs-Keys oder hartcodierte Farben (statt CSS-Variablen) in den Haupt-Branch gelangen.
* **Akzeptanzkriterien:**
  - **i18n-Check:** Automatisches Skript, das die Standard-Sprachdatei (z.B. Englisch) mit allen anderen Sprachen vergleicht und warnt, falls Keys fehlen.
  - **Theme-Check:** Linter-Erweiterung oder Regex-Skript, das PRs daraufhin untersucht, ob in neuen React-Komponenten illegale statische Farbcodes (z.B. `#ff0000`) anstelle von validen Theme-Variablen (`var(--color-primary)`) verwendet werden.

## Ergänzungen für den Testplan

**Zu US-2.5.1 (Multilinguale Tooltips):**
- **Testfall:** Dashboard und Directive Dossier öffnen. Mit der Maus über verschiedene Icon-Buttons hovern. Prüfen, ob der Tooltip erscheint und der Text korrekt ist.
- **Testfall (i18n):** Sprache in den Settings umstellen. Erneut über dieselben Elemente hovern und prüfen, ob die Tooltips in der neuen Sprache angezeigt werden.

**Zu US-2.5.2 (Tab-Navigation):**
- **Testfall:** Applikation laden. Ausschließlich mit der `Tab`-Taste durch das Dashboard navigieren. Prüfen, ob der Fokus logisch wandert und der Fokus-State deutlich sichtbar ist.
- **Testfall (Focus Trap):** Ein Modal öffnen. Mit `Tab` durch die Felder navigieren. Prüfen, dass der Fokus innerhalb des Modals bleibt und nicht auf das dahinterliegende Dashboard springt.

**Zu US-2.5.3 (Lokalisierung XP-Fortschrittsanzeige):**
- **Testfall (i18n):** Sprache in den Settings auf z.B. Deutsch umstellen. Das Dashboard aufrufen und überprüfen, ob sämtliche Texte innerhalb der XP-Fortschrittsanzeige korrekt auf Deutsch übersetzt sind.
- **Testfall (Layout-Stabilität):** Prüfen, dass sich das Layout der XP-Box nach der Sprachumstellung (auch bei längeren Texten) nicht unerwünscht verschiebt oder abschneidet.

**Zu US-2.5.4 (Versionsnummer im Admin-Panel):**
- **Testfall:** Als Admin einloggen und in das Admin-Panel navigieren. Ganz unten auf der Seite prüfen, ob der Text "CyberTracker vX.X.X" (mit korrekter Version) sichtbar ist.

**Zu US-2.5.5 (PR Konsistenzprüfungen):**
- **Testfall (Lokalisierung):** Eine Sub-Sprachdatei absichtlich um einen Key reduzieren und das Test-Skript lokal ausführen. Prüfen, ob das Skript mit einem Fehler/Warning abbricht.
- **Testfall (Theming):** Eine Komponente mit einem statischem Farbwert (z.B. `color: #000;`) versehen und linter/skript starten. Prüfen, ob eine Warnung wegen verbotener Hardcodes ausgelöst wird.
