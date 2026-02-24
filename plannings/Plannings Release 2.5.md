# Planning: Release 2.5

## Themen & Fokuspunkte
*Vorrangiges Ziel dieses Releases ist administrative Qualitätssicherung, Lokalisierung und Deployment Checkups.*
- **Erweiterte Theme-Auswahl:** Integration von 4 neuen, hochspezialisierten UI-Themes (Kraftwerk, Synthwave, Corp).
- **Lokalisierung XP-Dashboard-Box:** Übersetzung der aktuell rein englischsprachigen XP-Fortschrittsanzeige.
- **Admin-Hinweise & Qualitätssicherung:** Einfügen der Release-Version im Admin-Panel und Einführung strikterer PR-Checks für Theming und Lokalisierung.

## Neue User Stories

**US-2.5.0: Umfassendes Dokumentations-Update (Bereits umgesetzt)**
* **Als** Nutzer, Administrator und System-Operator
* **Möchte ich** eine detaillierte, bebilderte und strukturierte Systemdokumentation in meinem `/manuals` Ordner
* **Damit** ich alle Features (z.B. 2FA, Gamification) besser verstehe, das System administrieren kann und die technische Architektur nachvollziehbar ist.
* **Akzeptanzkriterien:**
  - Erstellung eines umfassenden `User_Guide.md` mit aktuellen Screenshots des Dashboards, Profils und Paginierung.
  - Erstellung eines modernisierten `CyberTasker_Admin_Guide.md` inkl. Zero-Config Sperre, 2FA-Management und Diagnose-Tools.
  - Erstellung einer `Technical_Reference.md` inkl. CI/CD Dokumentation, Architektur-Diagramm und Datenbank-ERD (als echte Grafiken konvertiert).
  - Design und Integration von neuen, horizontalen Cyberpunk-Logos.
  - Automatische Generierung aller Ressourcen in hochwertige PDFs (`User_Guide.pdf`, `CyberTasker_Admin_Guide.pdf`, `Technical_Reference.pdf`).
  - *(Status: Vollständig umgesetzt und abgeschlossen vor eigentlichem Release-Start)*

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

**US-2.5.6: Erstellung globaler THEME_GUIDELINES.md**
* **Als** Frontend-Entwickler / Designer
* **Möchte ich** eine zentrale Dokumentation aller Theme-Regeln haben
* **Damit** zukünftige Themes (sowohl Dark als auch Light Mode) konsistent umgesetzt werden und nicht mit dem "Anti-Hardcode-Checker" aus US-2.5.5 in Konflikt geraten.
* **Akzeptanzkriterien:**
  - Erstellung der Datei `manuals/THEME_GUIDELINES.md`.
  - Die Datei dokumentiert alle zwingend erforderlichen CSS-Variablen (`--color-bg-primary`, `--color-primary-glow`, etc.).
  - Die Datei definiert Best Practices für Light- vs. Dark-Mode Shadows.
  - Die Datei erklärt die Registrierung eines Themes in React (Context, Translation, und Profile-Card).

**US-2.5.7: Integration von 4 neuen UI-Themes**
* **Als** Nutzer
* **Möchte ich** eine größere Auswahl an visuellen Themes für mein Dashboard haben
* **Damit** ich das Aussehen der App noch besser an meinen persönlichen (Cyberpunk-/Retro-) Geschmack anpassen kann.
* **Akzeptanzkriterien:**
  - Implementierung von Theme 1: "Computerwelt" (Stil: Kraftwerk 1981 - Mattschwarz, Neongrün, Gelb).
  - Implementierung von Theme 2: "Mensch-Maschine" (Stil: Kraftwerk 1978 - Schwarz, Signalrot, Weiß).
  - Implementierung von Theme 3: "Neon Syndicate" (Stil: Synthwave/Outrun - Dunkelviolett, Magenta, Electric Blue).
  - Implementierung von Theme 4: "Megacorp Executive" (Stil: Elitärer Light Mode - Weiß, Hellgrau, Schwarz, Silber/Eisblau).
  - Alle Themes sind als CSS-Variablen in der `index.css` definiert und sauber im Profil-Modal (inkl. Icons/Namen) auswählbar.
  - Gewährleistung, dass das Skript `check-theme.js` weiterhin erfolgreich durchläuft.

**US-2.5.8: Validierung kritischer Auth-Voränge & PR-Checks**
* **Als** System-Operator
* **Möchte ich**, dass kritische Account-Funktionen (Registrierung, Login, 2FA, Email-Versand) automatisiert getestet werden
* **Damit** Updates nicht unbemerkt die Möglichkeit der Nutzer zur Anmeldung oder Sicherung ihrer Accounts zerstören.
* **Akzeptanzkriterien:**
  - Erstellung/Erweiterung der E2E-Tests für 2FA-Einrichtung und Email-Adressen-Updates.
  - Implementierung eines GitHub-Actions Workflows für Pull Requests, der streng prüft, ob (mindestens) Registrierung und Login noch 100% funktionsfähig sind.


## Ergänzungen für den Testplan

**Zu US-2.5.3 (Lokalisierung XP-Fortschrittsanzeige):**
- **Testfall (i18n):** Sprache in den Settings auf z.B. Deutsch umstellen. Das Dashboard aufrufen und überprüfen, ob sämtliche Texte innerhalb der XP-Fortschrittsanzeige korrekt auf Deutsch übersetzt sind.
- **Testfall (Layout-Stabilität):** Prüfen, dass sich das Layout der XP-Box nach der Sprachumstellung (auch bei längeren Texten) nicht unerwünscht verschiebt oder abschneidet.

**Zu US-2.5.4 (Versionsnummer im Admin-Panel):**
- **Testfall:** Als Admin einloggen und in das Admin-Panel navigieren. Ganz unten auf der Seite prüfen, ob der Text "CyberTracker vX.X.X" (mit korrekter Version) sichtbar ist.

**Zu US-2.5.5 (PR Konsistenzprüfungen):**
- **Testfall (Lokalisierung):** Eine Sub-Sprachdatei absichtlich um einen Key reduzieren und das Test-Skript lokal ausführen. Prüfen, ob das Skript mit einem Fehler/Warning abbricht.
- **Testfall (Theming):** Eine Komponente mit einem statischem Farbwert (z.B. `color: #000;`) versehen und linter/skript starten. Prüfen, ob eine Warnung wegen verbotener Hardcodes ausgelöst wird.

**Zu US-2.5.6 (Theme Guidelines):**
- **Testfall:** Die Datei `/manuals/THEME_GUIDELINES.md` auf inhaltliche Vollständigkeit prüfen (Variablen-Auflistung, Light/Dark Mode Hinweise, React-Einbindung).

**Zu US-2.5.7 (Neue UI-Themes):**
- **Testfall (Visuelle Kontrolle):** Im Profil alle 4 neuen Themes durchklicken und visuell prüfen, ob Farben und Hover-States konsistent wirken. Insbesondere den Light-Mode ("Megacorp") auf gute Lesbarkeit prüfen.
**Zu US-2.5.8 (Auth-Vorgänge & PR-Checks):**
- **Testfall (Playwright):** Ausführung der Testsuite für `11-advanced-auth.spec.js`. Prüfen, ob der Login-Flow, das Aktivieren der 2FA im Profil-Modal und das Simulieren eines Email-Adressen-Updates von Playwright als Passed markiert werden.
- **Testfall (CI/CD):** Prüfen, ob eine neue Datei `.github/workflows/pr-auth-check.yml` angelegt wurde, die den E2E-Test für Auth beim Erstellen eines Pull Requests triggert.
