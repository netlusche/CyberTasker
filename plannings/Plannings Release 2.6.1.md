# Planning: Release 2.6.1 (The Admin & QoL Polish)

## Themen & Fokuspunkte
*Dieses Minor-Release dient als "Clean Slate" Maßnahme, bevor die massiven Architektur-Umbauten von Release 3.0 beginnen. Das primäre Ziel ist es, alle aktuell offenen GitHub-Issues (Quality of Life & Administration) abzuarbeiten, um ohne funktionale Altlasten in den kommenden Major-Zyklus zu starten.*

- **Dashboard QoL:** Kleine, aber wertvolle UX-Verbesserungen auf dem Operative Dashboard für mehr Übersicht.
- **Flotten-Administration:** Automatisierte und manuelle Bereinigungs-Protokolle für das Admin-Panel, um die Datenbank vor dem Release 3.0 Schema-Wandel von "Dateileichen" zu befreien.

## Neue Epics / Aufgabenbereiche

### Epic 1: Quality of Life (Frontend & Dashboard)

**US-2.6.1.1: Datei-Indikator auf der Directive Card (Issue #25)**
* Wenn ein Task in seinem `files` Array angehängte Assets oder Links (`attachments`) besitzt, soll auf der entsprechenden `TaskCard` im Dashboard ein kleines visuelles Icon (z.B. eine Büroklammer oder ein Ordner-Symbol) angezeigt werden, damit der User sofort sieht, ob zusätzliches Material im Dossier vorhanden ist.

**US-2.6.1.2: Bulk-Löschung abgeschlossener Tasks (Issue #21)**
* Implementierung eines Buttons (z.B. im Filter-Bereich oder Footer), der es dem User erlaubt, mit einem einzigen Klick **alle** derzeit von ihm abgeschlossenen Directives (Status `1`) endgültig aus der Datenbank zu löschen.
* Absicherung zwingend über ein CyberConfirm-Modal.

**US-2.6.1.6: Filter-Pill für erledigte Aufgaben (Issue #26)**
* Erweiterung der Quick-Filter Pills um einen "Erledigte"-Button, rechts neben dem "Hohe Prio" Button.
* Dieser Filter muss global und paginiert arbeiten, um ausschließlich Tasks mit `status = 1` auf dem Dashboard darzustellen.
* Das Playwright E2E-Test Szenario für die Filterbox (`08-dashboard-qol.spec.js`) muss die Funktionalität dieses neuen Buttons abdecken.

### Epic 2: Flotten-Administration (Backend & Admin Panel)

**US-2.6.1.3: Automatisiertes Löschen inaktiver Operatives (Issue #24)**
* Erweiterung des Admin-Panels um eine Select-Auswahl (1 Jahr, 2 Jahre, ..., 10 Jahre) und einen Button, welche die Datenbank nach "Ghost-Accounts" scannt (z.B. `last_login` älter als die gewählte Zeit) und diese rückstandsfrei (inklusive Tasks und Kategorien) aus der Datenbank purged.

**US-2.6.1.4: Purge unverifizierter Accounts (Issue #22)**
* Ähnlich wie US-2.6.1.3, jedoch fokussiert auf Accounts, die zwar erstellt, aber nie mittels E-Mail-Token verifiziert wurden (`is_verified = 0`) und deren Erstellung (oder `created_at` / `last_login = NULL`) länger als 14 Tage zurückliegt.
* Blockiert Spam-Registrierungen und hält die Tabelle sauber.

**US-2.6.1.5: UI-Fix: Admin-Lösch-Modal (Issue #23)**
* Behebung eines kosmetischen Fehlers: Wenn ein Admin versucht, einen User zu löschen, übernimmt das auftauchende Warn-Modal ("Bist du sicher?") aktuell nicht die korrekten CSS-Variablen des aktiven Themes (z.B. blinkt es nicht neon-cyan im Cyberpunk-Theme).

## Ergänzungen für den Testplan
* Die Lösch-Logiken im Backend (US-2.6.1.2, .3, .4) extrem gut absichern und via E2E-Tests durchspielen, da hier massiv in die Datenintegrität eingegriffen wird. 
* Für E2E-Tests müssen ggf. im Seeder-Skript alte Ghost-Accounts erzeugt werden, um das Löschen validieren zu können.

## UI & Lokalisierung
* Alle neuen UI-Elemente müssen den `THEME_GUIDELINES.md` entsprechen (keine harten HEX-Farben, Nutzung von Tailwind/Theme-Variablen, Legibility im Auge behalten).
* Neue Texte und Buttons müssen nach `TRANSLATION_GUIDELINES.md` übersetzt werden (klare englische Basis, nutzen von Keys in `translation.json`).
