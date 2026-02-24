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

**US-2.5.7b: Dokumentation der neuen UI-Themes in der System Help**
* **Als** Nutzer
* **Möchte ich** eine thematisch passende Beschreibung der neuen Themes (Computerwelt, Mensch-Maschine, Neon Syndicate, Megacorp Executive) in der integrierten System Help lesen können
* **Damit** das immersive Cyberpunk-Gefühl beim Lesen der Anleitung erhalten bleibt.
* **Akzeptanzkriterien:**
  - Die englische Basis-Lokalisierung `translation.json` wird im Bereich `help.sections.visual_interface` um 4 neue Keys ergänzt.
  - Die neuen englischen Beschreibungen nutzen denselben Jargon ("Protocols", "Data streams", "Chassis") wie bestehende Themes.
  - Die Ergänzungen werden über das Übersetzungs-Skript in alle unterstützten Sprachen übersetzt.

**US-2.5.8: Validierung kritischer Auth-Voränge & PR-Checks**
* **Als** System-Operator
* **Möchte ich**, dass kritische Account-Funktionen (Registrierung, Login, 2FA, Email-Versand) automatisiert getestet werden
* **Damit** Updates nicht unbemerkt die Möglichkeit der Nutzer zur Anmeldung oder Sicherung ihrer Accounts zerstören.
* **Akzeptanzkriterien:**
  - Erstellung/Erweiterung der E2E-Tests für 2FA-Einrichtung und Email-Adressen-Updates.
  - Implementierung eines GitHub-Actions Workflows für Pull Requests, der streng prüft, ob (mindestens) Registrierung und Login noch 100% funktionsfähig sind.

**US-2.5.9: E-Mail-Zwang bei der System-Initialisierung**
* **Als** System-Installer
* **Möchte ich** bei der Erstinstallation im Setup-Screen zwingend aufgefordert werden, eine gültige E-Mail-Adresse für den primären Admin-Account anzugeben
* **Damit** der Master-Account einen Kommunikationskanal für E-Mail-2FA und Passwort-Recovery besitzt.
* **Akzeptanzkriterien:**
  - Der Installer (`install.html` / `install.php`) enthält ein Pflichtfeld für die E-Mail-Adresse des Admins.
  - Das Backend verweigert die Anlage des Master-Accounts, falls die E-Mail ungültig oder leer ist.

**US-2.5.10: Globale Policy "Enforce Email 2FA"**
* **Als** Administrator
* **Möchte ich** in der Admin-Konsole einen globalen Schalter "Enforce Email 2FA" aktivieren können
* **Damit** ich systemweit für alle Nutzer ohne Ausnahme eine Zwei-Faktor-Authentifizierung beim Login erzwingen kann.
* **Akzeptanzkriterien:**
  - Ein neuer Toggle-Switch im Admin-Panel (oberhalb der Strict Password Policies) für `enforce_email_2fa`.
  - Ist der Schalter aktiv, so löst der Login-Prozess auch für Nutzer *ohne* aktivierte Authenticator-App zwingend den Versand eines 6-stelligen Codes per E-Mail aus, der eingegeben werden muss.
  - Hat der Nutzer **bereits eine App-basierte TOTP-2FA** aktiviert, so greift primär diese (um E-Mail-Spam zu vermeiden) und der Email-Code wird *nicht* verschickt.

**US-2.5.10b: Transparenz bei erzwungener 2FA (Aktive Sessions)**
* **Als** eingelogger Nutzer
* **Möchte ich** in meinem operativem Profil visuell darauf hingewiesen werden, falls Administratoren 2FA zwingend vorschreiben
* **Damit** ich beim nächsten Login nicht von einer Codeabfrage überrascht werde und idealerweise direkt auf eine sicherere TOTP-App wechsle.
* **Akzeptanzkriterien:**
  - Ist `enforce_email_2fa` global aktiv und der Nutzer hat selbst noch keine App-2FA konfiguriert, erscheint im Modal (`ProfileModal.jsx`) unter BIO-LOCK SECURITY ein pulsierender Informationsbanner.
  - Der Text "SYSTEM DIRECTIVE [Admin Policy]: EMAIL UPLINK ENFORCED" wird durchgängig über i18next in alle Sprachen übersetzt, unter strikter Einhaltung des Klammer-Kontextes.

**US-2.5.10c: Kontext-Aufklärung beim Login-Flow**
* **Als** Nutzer, der sich neu anmeldet
* **Möchte ich** bei einer unerwarteten E-Mail-Code-Abfrage sofort den administrativen Grund dafür erfahren
* **Damit** ich nicht annehme, mein Account sei gehackt oder fehlerhaft konfiguriert worden.
* **Akzeptanzkriterien:**
  - Fordert das Backend beim Login (`AuthForm.jsx`) einen E-Mail-Code an, weil `enforce_email_2fa` greift, wird direkt über dem Eingabefeld der "SYSTEM DIRECTIVE" Banner angezeigt.
  - Auch hierbei werden die Klammer-Translation-Guidelines angewandt.

**US-2.5.11: Initiale Sicherheits-Direktive (Cyberpunk-Jargon)**
* **Als** frisch installierter Default-Admin
* **Möchte ich** direkt nach der Installation eine vordefinierte Direktive in meinem Dossier finden
* **Damit** ich thematisch motiviert daran erinnert werde, die 2FA-Policy scharfzuschalten.
* **Akzeptanzkriterien:**
  - Nach Ausführen des Installers liegt eine Aufgabe für den Admin vor: "ACTIVATE ENCRYPTED COMMLINKS: Enforce 2FA Protocol across the grid".
  - Titel und Beschreibung sind selbstverständlich voll über das i18next-System lokalisiert.

**US-2.5.12: Skalierbares Cyber-Badge System (Core Logic)**
* **Als** Entwickler
* **Möchte ich** eine skalierbare Logik implementieren, die aus einem numerischen User-Level dynamisch ein zweigeteiltes Badge berechnet (Tier + Titel)
* **Damit** das Gamification-System nicht bei einem Hardcap endet, sondern strukturiert bis Level 50 wachsen kann, ohne dass Code dupliziert werden muss.
* **Akzeptanzkriterien:**
  - Erstellung eines API/Frontend-Utils `badgeMapping.js`.
  - Die Funktion `calculateBadge(level)` nimmt das User-Level entgegen und berechnet das aktuelle 'Tier' (1-5, rotiert z.B. alle Level) und den 'Titel' (1-10, rotiert alle 5 Level).
  - Folgende 5 Tiers müssen gemappt sein: 1:`Novice`, 2:`Adept`, 3:`Veteran`, 4:`Elite`, 5:`Prime`.
  - Folgende 10 Titles müssen gemappt sein: 1 (Lvl 1-5):`Script Kiddie`, 2 (Lvl 6-10):`Console Cowboy`, 3:`Netrunner`, 4:`Cyberdoc`, 5:`Chrome-Junkie`, 6:`System Architect`, 7:`Ghost in the Shell`, 8:`Neuromancer`, 9:`Digital God`, 10:`Singularity`.

**US-2.5.13: Gamification UX & Bracket-Translation**
* **Als** ambitionierter Operative
* **Möchte ich** mein aktuelles Cyber-Badge (z.B. "Veteran Netrunner") prominent im XP-Dashboard sehen
* **Damit** mein Fortschritt motivierend und thematisch passend visualisiert wird, auch wenn ich die UI-Sprache wechsle.
* **Akzeptanzkriterien:**
  - Das aus `US-2.5.12` berechnete Badge wird im Dashboard gut sichtbar über dem XP-Fortschrittsbalken gerendert.
  - **Kritisch:** Alle Tiers und Titles werden in der `en/translation.json` zwingend mit beschreibendem Klammer-Kontext angelegt (z.B. `"tier_1": "Novice [Skill Level]"`, `"title_2": "Console Cowboy [Hacker Role]"`).
  - Das Python-Updateskript `translate_json.py` muss diese neuen Strukturen fehlerfrei in alle unterstützten Sprachen übersetzen können.

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

**Zu US-2.5.7b (Theme Doku System Help):**
- **Testfall:** Im Dashboard die System Help öffnen, zum Abschnitt "VISUAL INTERFACE" scrollen und prüfen, ob die 4 neuen Themes (Computerwelt, Mensch-Maschine, Neon Syndicate, Megacorp Executive) mitsamt Beschreibung aufgelistet werden. Die Prüfung muss auch in einer übersetzten Sprache (z.B. Deutsch) erfolgen.
**Zu US-2.5.8 (Auth-Vorgänge & PR-Checks):**
- **Testfall (Playwright):** Ausführung der Testsuite für `11-advanced-auth.spec.js`. Prüfen, ob der Login-Flow, das Aktivieren der 2FA im Profil-Modal und das Simulieren eines Email-Adressen-Updates von Playwright als Passed markiert werden.
- **Testfall (CI/CD):** Prüfen, ob eine neue Datei `.github/workflows/pr-auth-check.yml` angelegt wurde, die den E2E-Test für Auth beim Erstellen eines Pull Requests triggert.

**Zu US-2.5.9 (E-Mail Setup-Zwang):**
- **Testfall:** Eine saubere SQLite-Installation starten. Versuchen, den Admin ohne E-Mail-Adresse anzulegen – System muss mit Fehlermeldung blockieren.

**Zu US-2.5.10 (Enforce Email 2FA):**
- **Testfall:** Im Admin-Panel "Enforce Email 2FA" aktivieren. Mit einem frisch erstellten User (ohne App-2FA) einloggen. Es muss eine E-Mail mit einem Code simuliert abgeschickt und das Login-Prompt-Modal angezeigt werden.

**Zu US-2.5.10b (Profil Banner für aktive Sessions):**
- **Testfall:** Als normaler User ohne eingerichtete 2FA einloggen, während die Policy "Enforce Email 2FA" aktiv ist. Das Profilfenster öffnen. Es muss zwingend der warnende Banner ("SYSTEM DIRECTIVE [Admin Policy]: EMAIL UPLINK ENFORCED") im Sicherheits-Tab erscheinen. Nach Aktivierung der normalen App-2FA muss der Banner verschwinden.

**Zu US-2.5.10c (Login Context-Banner):**
- **Testfall:** Mit einem User ohne TOTP-2FA einloggen, wenn die Policy aktiv ist. In Phase 2 des Logins (Eingabe des Zugangscodes) prüfen, ob der Erklär-Banner über dem Eingabefeld gerendert wird.

**Zu US-2.5.11 (Initiale Direktive):**
- **Testfall:** Nach Neuinstallation mit dem Admin einloggen und prüfen, ob die Direktive zur 2FA-Verschlüsselung auf dem Dashboard liegt und bei einem Sprachwechsel (z.B. auf Spanisch) korrekt übersetzt wird.

**Zu US-2.5.12 (Cyber-Badges System / Core):**
- **Testfall:** Eine Unit-Test-Funktion oder ein Konsolen-Log ausführen, das `calculateBadge(level)` für die Level 1, 13, 25 und 50 aufruft. Prüfen, ob für Level 13 z.B. "Tier 3, Title 3" (Veteran Netrunner) zurückgegeben wird.

**Zu US-2.5.13 (Gamification UX & i18n):**
- **Testfall (Visuell):** Einem Test-User manuell in der DB exakt 160.000 XP und Level 38 zuweisen ("Veteran Neuromancer"). Das Dashboard aufrufen und prüfen, ob das Badge gerendert wird.
- **Testfall (Translation):** Die UI-Sprache auf Spanisch umstellen und prüfen, ob sich der Badge-Name anpasst, ohne dass unsinnige Grammatik entstanden ist.
