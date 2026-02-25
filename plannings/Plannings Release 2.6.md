# Planning: Release 2.6

> [!IMPORTANT]
> **Branching-Strategie:** Sämtliche Entwicklungsarbeiten für dieses Release finden exklusiv auf dem Branch `next-up_2.6` statt. Falls dieser Branch noch nicht existiert, muss er initial abgeleitet werden.

## Themen & Fokuspunkte
*Vorrangiges Ziel dieses Releases ist die Verbesserung der Barrierefreiheit (Accessibility) und der Usability durch durchgängige Tooltips und eine konsistente Tastatursteuerung. Diese Features wurden aufgrund ihrer Komplexität im Test-Setup aus Release 2.5 verschoben.*
- **Systemweite Tooltips:** Hinzufügen von erklärenden Kurztexten (MouseOver) an relevanten Bedienelementen, wo diese aktuell fehlen. Vollständig multilingual.
- **Tastaturnavigation (Tab-Routing):** Vereinheitlichung und Sicherstellung einer logischen, applikationsweiten Navigation primär per Tabulator-Taste.
- **Automatisierte Release Pipeline:** Ersetzung des unsicheren manuellen Vorgehens durch ein Skript, welches Test-Validierung, Package-Versions-Bumping und Git-Tagging fehlerfrei und synchron zusammenfasst.
- **Striktes QA & Tagging (Rollback-Sicherheit):** Da die Usability-Updates (2.6.1 und 2.6.2) tiefgreifende DOM- und Fokus-Änderungen an fast allen Komponenten verursachen, werden nach Abschluss kritischer Stories harte Git-Tags gesetzt, um bei UI-Regressionen sofort zurückrollen zu können. Die QA-Prüfsteine sind:
  - **Nach US-2.6.1 (Tooltips):** Tag `v2.6.0-dev1` setzen und **manueller Durchlauf des *Master Test Plans***.
  - **Nach US-2.6.2 (Tab-Navigation):** Tag `v2.6.0-dev2` setzen und **erneuter manueller Durchlauf des *Master Test Plans***.
  - **Nach US-2.6.3 (Release Skript):** Tag `v2.6.0-dev3` setzen. (Hier entfällt der Master Test Plan, da das CLI-Skript weder Frontend noch Backend der Applikation tangiert).
  - **Nach US-2.6.8 (Backend & QoL Block):** Tag `v2.6.0-dev4` setzen nach Abschluss von 2.6.4 bis 2.6.8. (Kein Master Test Plan nötig, nur isolierte Thementests).
  - **Nach US-2.6.9 (Mobile Drag & Drop):** Tag `v2.6.0-dev5` setzen. Zwingend **manueller Durchlauf des "Task & Directive Management"** Testblocks (Desktop & Mobile-Simulation) zur Vermeidung von Drag-and-Drop Regressionen.

## Neue User Stories

**US-2.6.1: Multilinguale Tooltips für Bedienelemente (Verschoben aus 2.5)**
* **Als** Nutzer
* **Möchte ich** beim Hovern über Icons, Buttons und komplexe Bedienelemente einen kurzen, erklärenden Text (Tooltip) sehen
* **Damit** ich die Funktion des Elements ohne Ausprobieren sofort verstehe, insbesondere bei neuen oder selten genutzten Features.
* **Akzeptanzkriterien:**
  - Tooltips werden nach einer kurzen Verzögerung beim MouseOver auf relevanten UI-Elementen (ohne offensichtliche Text-Labels) angezeigt.
  - Alle Tooltip-Texte sind konsequent in das bestehende i18n-System integriert und unterstützen alle verfügbaren Sprachen.
  - Visuelles Design der Tooltips fügt sich nahtlos in das aktuelle Theme ein.
> [!WARNING]
> **Komplexitäts-Hinweis zur Test-Umsetzung:** Bei der ursprünglichen Implementierung in Release 2.5 hat sich gezeigt, dass die Kombination aus React-Portal-basierten Tooltips, synthetischen Hover-Events und Playwright E2E-Tests extrem fehleranfällig ist. Die Hover-Interaktionen wurden oft flakig oder vom Playwright-Runner nicht zuverlässig registriert.
> **Strategie für 2.6:** Wir benötigen ein robustes Konzept zur Testbarkeit. Idealerweise sollte eine Lösung gefunden werden, bei der der Tooltip-Text direkt an den Trigger-Komponenten mittels Data-Attributen exakt ablesbar ist (z.B. `data-tooltip-content="..."`), ohne visuelle Hover-Overlays erzwingen zu müssen, um die Tests drastisch zu beschleunigen und zu stabilisieren.

**US-2.6.2: Applikationsweites Navigationskonzept per Tab-Taste (Verschoben aus 2.5)**
* **Als** (Power-)Nutzer oder Nutzer mit Einschränkungen
* **Möchte ich** die gesamte Applikation logisch und konsistent per Tab-Taste bedienen können
* **Damit** ich Formulare, Listen und Aktionen schnell ohne Mausbefehle durchlaufen und auslösen kann.
* **Akzeptanzkriterien:**
  - Konsequente Vergabe bzw. Bereinigung von `tabindex`-Attributen oder Nutzung semantischen HTMLs über alle Views hinweg.
  - Sichtbarer, barrierefreier Fokus-State (passend zum Theme) für das aktuell per Tab fokussierte Element.
  - Modals/Layer fangen den Tab-Fokus ein ("Focus Trap"), solange sie geöffnet sind, damit man nicht unsichtbar im Hintergrund weiternavigiert.

**US-2.6.3: Automatisierter "One-Click-Release" Prozess**
* **Als** Entwickler/Release-Manager
* **Möchte ich** einen zentralen Terminal-Befehl ausführen können, der den gesamten Release-Prozess absichert
* **Damit** Versionen, Git Tags und Commits in Zukunft immer zu 100% synchron sind und ich nicht versehentlich defekten Code durch kaputte Tests freigebe.
* **Akzeptanzkriterien:**
  - Erstellung eines interaktiven Node-Skripts (`scripts/release.js`).
  - Das Skript erzwingt vor jedem Start ein `npm run check:all` (i18n & Theme-Checks) und `npm run test` (E2E Playwright CI-Tests).
  - Das Skript nutzt den nativen `npm version <auswahl>` Mechanismus, um die `package.json` abzugraden sowie den Commit und den `vX.X.X` Tag in der korrekten Reihenfolge zu generieren.

**US-2.6.4: "Daily Megacorp Quote" (Message of the Day)**
* **Als** Nutzer
* **Möchte ich** jeden Tag ein passendes Cyberpunk-Zitat ("Quote of the Day") im Dashboard sehen
* **Damit** eine kleine Quality-of-Life-Wertung die thematische Immersion stärkt und die Applikation lebendiger wirkt.
* **Akzeptanzkriterien:**
  - Einbindung einer visuell passenden "Message of the Day"-Anzeige im Kopfbereich des Dashboards.
  - Das System enthält eine Liste von themenbezogenen Zitaten (z.B. Konzern-Ansagen wie "Remember: Efficiency is mandatory." oder Hacker-Sprüche wie "Push the payload, break the ice.").
  - Ein Pseudo-Zufallsgenerator wählt basierend auf dem aktuellen Datum ein Zitat aus, sodass dieses zuverlässig jeden Tag wechselt.
**US-2.6.5: Multilinguales Setup & Installer-Lokalisierung**
* **Als** System-Installer (Nutzer)
* **Möchte ich** den Installationsprozess direkt in meiner bevorzugten Sprache durchführen können
* **Damit** ich alle Setup-Anweisungen fehlerfrei verstehe und mein initialer Admin-Account direkt mit den richtigen Spracheinstellungen konfiguriert wird.
* **Akzeptanzkriterien:**
  - Der Installer (`install.php` / Backend-Setup) ist vollständig lokalisiert und enthält alle Übersetzungen für die unterstützten Sprachen.
  - Der Benutzer muss im allerersten Schritt der Installation zwingend eine Sprache aus einem Dropdown/Auswahlmenü wählen.
  - Die hier ausgewählte Sprache wird als `language`-Präferenz für den bei der Installation angelegten Master-Admin-Account in der Datenbank hinterlegt.

**US-2.6.6: Lokalisierung aller vom System generierten E-Mails**
* **Als** Nutzer
* **Möchte ich** System-E-Mails (Account-Verifizierung, 2FA-Codes, Passwort-Reset) in der Sprache erhalten, die ich im Interface ausgewählt habe
* **Damit** ich auch bei sicherheitskritischen Vorgängen genau verstehe, was von mir verlangt wird.
* **Akzeptanzkriterien:**
  - Sämtliche E-Mail-Templates (Betreff und Body) werden aus statischen Texten gelöst und über Lokalisierungs-Keys abgebildet.
  - Vor dem Versand einer E-Mail prüft das Backend die Sprache: Befindet sich der Nutzer im Login/Registrierungs-Screen, wird die dort aktiv ausgewählte Sprache für den Versand genutzt.
  - Löst ein bereits eingeloggter Nutzer eine E-Mail aus (z.B. Profiländerungen), wird die in seinem Nutzerprofil gespeicherte Präferenz verwendet.

**US-2.6.7: Sichtbarkeit von Groß-/Kleinschreibung in Auth-Eingabefeldern**
* **Als** Nutzer
* **Möchte ich** bei der Eingabe meiner Login-Daten (Benutzername und Passwort) exakt sehen können, ob ich einen Groß- oder Kleinbuchstaben tippe
* **Damit** ich mich nicht permanent vertippe, weil das aktive UI-Theme alle Buchstaben künstlich als Großbuchstaben rendert, das Backend aber Case-Sensitive prüft.
* **Akzeptanzkriterien:**
  - In allen Eingabefeldern für Login und Registrierung (Codename, Access Key, etc.) wird systemweit via CSS erzwungen, dass `text-transform: none;` greift.
  - Diese Regel überschreibt hart alle potenziellen `text-transform: uppercase;` Konstanten, die ein Cyberpunk-Theme (z.B. Neon Syndicate) versehentlich auf `<input>` Felder vererbt.
  - Die Backend-Validierung für Usernamen und Passwörter bleibt strikt Case-Sensitive.

**US-2.6.8: Verbesserte Lesbarkeit von System-E-Mails (Accessibility)**
* **Als** Nutzer
* **Möchte ich**, dass wichtige Informationen (wie der 6-stellige 2FA-Code) in System-E-Mails deutlich lesbar sind
* **Damit** ich den Code schnell und fehlerfrei abtippen kann, unabhängig davon, ob mein E-Mail-Client im Light- oder Dark-Mode läuft.
* **Akzeptanzkriterien:**
  - Die Textfarbe für den hervorgehobenen 2FA-Überprüfungscode in den E-Mail-Templates (`api/helpers/mail_helper.php`) wird von dem schwer lesbaren hellen Neon-Cyan auf ein satteres, kontrastreicheres Standard-Blau geändert.
  - Der neue Farbton muss sowohl auf einem rein weißen Hintergrund (Light Mode) als auch auf einem dunklen Hintergrund (Dark Mode) visuell gut lesbar sein (Accessibility/WCAG-konform).

**US-2.6.9: Mobile Touch-Unterstützung für Sub-Routinen Drag & Drop**
* **Als** mobiler Nutzer (Smartphone / Tablet)
* **Möchte ich** meine Sub-Routinen im Directive Dossier durch Wischen (Touch & Drag) genauso flüssig sortieren können wie am Desktop
* **Damit** ich auch von unterwegs meine Workloads effizient priorisieren kann, ohne an den PC wechseln zu müssen.
* **Akzeptanzkriterien:**
  - Das aktuelle native HTML5 Drag-and-Drop (`draggable="true"`, `onDragStart`), welches auf iOS/Android Touch-Screens ignoriert wird, wird vollständig entfernt.
  - Implementierung einer robusten Touch-Lösung durch saubere Migration auf eine moderne React-Bibliothek (`@dnd-kit/core` und `@dnd-kit/sortable`).
  - Wischen/Ziehen an den bestehenden Drag-Handles verschiebt Items sauber und flüssig auf mobilen Geräten (Smartphones, Tablets).
  - Die visuelle Rückmeldung (Das Sortier-Overlay und die Einrast-Animationen) wird durch die nativen Mechanismen von `@dnd-kit` bereitgestellt und an den Cyber-Tasker Stil angepasst.

## Ergänzungen für den Testplan

**Zu US-2.6.1 (Multilinguale Tooltips):**
- **Testfall:** Dashboard und Directive Dossier öffnen. Mit der Maus über verschiedene Icon-Buttons hovern. Prüfen, ob der Tooltip erscheint und der Text korrekt ist.
- **Testfall (i18n):** Sprache in den Settings umstellen. Erneut über dieselben Elemente hovern und prüfen, ob die Tooltips in der neuen Sprache angezeigt werden.
- **E2E Strategie:** E2E Tests sollten die Anwesenheit der Tooltip-Data-Attribute anstatt visuelles Hovering überprüfen (siehe Strategie Hinweis in US).

**Zu US-2.6.2 (Tab-Navigation):**
- **Testfall:** Applikation laden. Ausschließlich mit der `Tab`-Taste durch das Dashboard navigieren. Prüfen, ob der Fokus logisch wandert und der Fokus-State deutlich sichtbar ist.
- **Testfall (Focus Trap):** Ein Modal öffnen. Mit `Tab` durch die Felder navigieren. Prüfen, dass der Fokus innerhalb des Modals bleibt und nicht auf das dahinterliegende Dashboard springt.

**Zu US-2.6.3 (Release Automation):**
- **Testfall (Sicherung):** Absichtlich einen Fehler in einen der Tests einbauen (z.B. falsche Farbe in React-File) und das Release-Skript starten. Prüfen, ob das Skript hart abbricht, bevor die Versionsnummer geändert wird.

**Zu US-2.6.4 (Quote of the Day):**
- **Testfall:** Dashboard laden und prüfen, ob ein Zitat im Kopfbereich angezeigt wird.
- **Testfall (Datumswechsel):** Durch manuelles Vorstellen des Datums prüfen, ob der Pseudo-Zufallsgenerator das Zitat am Folgetag zuverlässig wechselt.

**Zu US-2.6.5 (Installer-Lokalisierung):**
- **Testfall:** Eine frische Installation mit komplett leerer Datenbank anstoßen. Im Setup-Screen die Sprache z. B. auf "Französisch" wechseln und prüfen, ob die UI des Installers übersetzt wird. Nach der Fertigstellung mit dem neuen Admin-Account einloggen und sicherstellen, dass das Dashboard automatisch in der ausgewählten Sprache (Französisch) lädt.

**Zu US-2.6.6 (E-Mail Lokalisierung):**
- **Testfall (Passwort Reset):** Auf dem Login-Screen die Sprache auf "Spanisch" umstellen und einen Passwort-Reset anfordern. In der `mail_log.txt` (bzw. dem echten Mail-Postfach) verifizieren, dass der Betreff und Inhalt der E-Mail auf Spanisch ist.
- **Testfall (Eingeloggter User):** Im Nutzerprofil die Sprache auf "Deutsch" stellen und ein 2FA-Backup anfordern. Die entsprechende E-Mail muss zwingend auf Deutsch ankommen.

**Zu US-2.6.7 (Auth Case Visibility):**
- **Testfall:** Ein stark stilisiertes Theme (z.B. "Computerwelt" oder "Neon Syndicate") aktivieren. Zum Login-Screen wechseln. In das Feld "Codename" das Wort "aBcDeF" tippen. Prüfen, ob optisch exakt die Mischung aus Groß- und Kleinbuchstaben zu sehen ist und keine automatische Uppercase-Formatierung stattfindet.

**Zu US-2.6.8 (E-Mail Lesbarkeit):**
- **Testfall (Visuell):** Eine E-Mail mit 2FA-Code (z.B. Emergency Override) auslösen. Den generierten HTML-Code der E-Mail im Browser öffnen und den Hintergrund testweise rein weiß sowie rein schwarz färben. Prüfen, ob der 6-stellige Code in dem neuen, satteren Blau unter beiden Bedingungen komfortabel lesbar ist.

**Zu US-2.6.9 (Mobile Drag & Drop):**
- **Testfall:** DevTools öffnen, auf "Device Toolbar" (Mobile-Ansicht, z.B. iPhone 12) umschalten und Touch-Events simulieren. Ein Dossier öffnen, das Sub-Routinen enthält. Den Drag-Handle einer Sub-Routine "antappen" und verschieben. Prüfen, ob die Position nach dem Loslassen korrekt gespeichert wird.
- **Regressionstest:** Prüfen, ob das Drag-and-Drop auf dem Desktop weiterhin reibungslos mit der klassischen Maus funktioniert.
