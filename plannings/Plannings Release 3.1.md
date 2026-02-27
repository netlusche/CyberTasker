# Planning Release 3.1: "Grid Sync"

## Themen & Fokuspunkte
*Hier sammeln wir im Laufe unserer Planung die übergeordneten Ziele und Features für Release 3.1. Dieses Release entwickelt CyberTasker von einer Einzelnutzer-Lösung zu einer kollaborativen Multi-Tenant-Plattform weiter.*

- **Team-Management & neue Rollen (RBAC):** Einführung einer neuen Benutzerrolle "Manager" (sowie Ablösung des statischen `is_admin`-Flags) und von "Teams", um kollaboratives Arbeiten und teaminterne Directive-Verwaltung abzubilden.
- **Directive-Zuweisungen:** Manager können Directives innerhalb ihres Teams an spezifische Nutzer delegieren.
- **Datenmigration & Sicherheit:** Etablierung sauberer Upgrade-Pfade (`users` -> `roles`, `teams`, `user_teams`) für bestehende Instanzen und strikte Data-Isolation zwischen den Teams auf API-Ebene.

## Neue User Stories
*Hier formulieren wir die daraus resultierenden konkreten User Stories.*

**US-3.1.1: Ablösung des Legacy is_admin Flags durch ein Rollenkonzept**
* **Als** System-Architekt
* **Möchte ich** das bisherige `is_admin` Boolean-Feld in der Datenbank durch ein erweiterbares Rollenschema (`role` ENUM oder Tabelle) ersetzen
* **Damit** CyberTasker künftig neben Admin und User auch spezialisierte Rollen wie "Manager" abbilden kann.
* **Akzeptanzkriterien:**
  - In der Datenbank (SQLite & MariaDB) wurde das Feld `is_admin` migriert/ersetzt durch eine saubere Logik für "Globale Systemrollen" (Admin, Manager, User).
  - Bestehende, rein auf `is_admin` basierte Abfragen im Backend (`AdminAuthMiddleware` etc.) wurden auf das neue Rollenschema umgeschrieben.

**US-3.1.2: Einführung der internen Rolle "Manager" (Globale Systemrolle)**
* **Als** Systemarchitekt / Admin
* **Möchte ich** auf globaler Systemebene neben "Admin" und "User" künftig auch die Rolle "Manager" vergeben können
* **Damit** es eine klare Unterscheidung zwischen Systemadministratoren (globale Verwaltung) und Team-Koordinatoren gibt.
* **Akzeptanzkriterien:**
  - In der Benutzerverwaltung (Admin Panel) gibt es beim Role-Dropdown/Selektor nun die Optionen: Admin, Manager, User.
  - Das Backend validiert und speichert die neue Rolle (`role` = 'manager').
  - Authentifizierungs- und Rechte-Middlewares erkennen die neue primäre Nutzerrolle fehlerfrei.
  - *WICHTIG:* Die globale Systemrolle definiert Basisrechte (z.B. Admin-Panel Zugang vs. nicht). Die eigentliche Zugriffsebene auf Directives regelt sich über die *Team-Zugehörigkeit*. Ein Admin kann (und wird meist) zusätzlich als Manager oder User in diversen Teams agieren. Ein Admin hat also theoretisch die Rollen "Manager UND Admin" inne.

**US-3.1.3: Team-Erstellung und Default-Struktur**
* **Als** Admin
* **Möchte ich** Arbeitsteams (z.B. "Web Development", "Marketing") erstellen und diesen Nutzern (Users/Managers/Admins) zuordnen können
* **Damit** die Applikation organisatorische Strukturen abweichend von reinen Einzelplayern abbilden kann.
* **Akzeptanzkriterien:**
  - Admins (ausschließlich Admins) können im Admin Panel Teams anlegen, bearbeiten und löschen.
  - Bei einer frischen Installation (`install.php` oder Migration) werden automatisch zwei Default-Teams generiert: `Admin` und `Default`.
  - Jeder registrierte Nutzer wird bei Neuanmeldung oder Registrierung standardmäßig dem Team `Default` zugewiesen (falls der Admin es nicht umkonfiguriert).
  - Jedem Nutzer kann im Backend-Profil ein oder manuell mehrere Teams zugewiesen werden.
  - Eine saubere, normalisierte Datenbankstruktur (z.B. `teams` und `user_teams` Tabellen) speichert die Relationen.

**US-3.1.4: Erweiterte Manager-Rechte und Directive-Zuweisung innerhalb von Teams**
* **Als** Manager (oder Admin in Manager-Funktion eines Teams)
* **Möchte ich** die Directives meines Teams koordinieren, indem ich Aufgaben gezielt an (normale) User oder andere Teammitglieder zuweise, sie ihnen wieder entziehe oder neu delegiere
* **Damit** ich mein Team steuern und Aufgaben effizient verteilen kann, während die User-UI übersichtlich bleibt.
* **Akzeptanzkriterien:**
  - Ein Teammitglied mit der globalen Rolle "Manager" (oder "Admin") hat innerhalb seiner Teams Lese-, Schreib- und *Zuweisungsrechte* für alle Directives dieses Teams.
  - Manager sehen auf einem speziellen "Team Board" (oder durch Filter im Dashboard) alle Directives ihres Teams inkl. des aktuellen Bearbeiters (Assignee).
  - Ein Manager kann in der UI (z.B. via Dropdown in der Card/Dossier) den Assignee einer Directive innerhalb des Teams ändern.
  - Manager haben *keinen* Zugriff auf Directives von Teams, in denen sie selbst nicht Mitglied sind.
  - Normale "User" sehen (gefiltert nach Teams) primär nur Directives, die entweder allgemein für ihr Team offen sind ("Unassigned") oder spezifisch ihnen zugewiesen wurden.
  - Die UI (Dashboard) bietet sowohl für User (in mehreren Teams) als auch Manager Filter-/Tagging-Möglichkeiten, um den Überblick zu bewahren (z.B. "Zeige Directives aus Team X").

**US-3.1.5: Sichere Upgrades (Migration bestehender Nutzer/Daten)**
* **Als** bestehender Nutzer
* **Möchte ich**, dass nach einem Update auf Release 3.1 alle meine bestehenden Directives erhalten bleiben und ich weiterhin normal weiterarbeiten kann
* **Damit** es durch den Major-Release keinen Datenverlust oder Login-Fehler gibt.
* **Akzeptanzkriterien:**
  - Es existiert ein robustes Migrations-Script, welches alte Single-User Instanzen beim ersten Start aktualisiert.
  - Alle existierenden User werden dabei automatisch in das Team `Default` migriert.
  - Alle existierenden Directives eines Users werden mit dessen ID als "Assignee" versehen und an das Team gebunden, dem er nun angehört.
  - Admins erhalten bei der Migration automatisch die Rollen Admin + Manager im Default/Admin Team.


## Ergänzungen für den Testplan
*Hier notieren wir uns, welche Testfälle neu in den Master Testplan aufgenommen werden müssen.*

**Zu US-3.1.1 bis US-3.1.4 (RBAC, Teams & Manager-Rolle):**
- **Testfall [Installation/Migration]:** Migration/Neuinstallation prüfen: Sind die Teams `Admin` und `Default` direkt nach Setup in der Datenbank vorhanden und sind die Systemrollen korrekt migriert?
- **Testfall [Management]:** Admin legt "Team Delta" an. Admin weist dem Team "User A" (als System-Rolle User) und "User B" (als System-Rolle Manager) zu. Admin weist sich selbst auch "Team Delta" zu.
- **Testfall [Delegation]:** "User B" (Manager) loggt sich ein und kann auf dem Dashboard oder im Team-Board "Team Delta" Directives anlegen und via UI aktiv an "User A" zuweisen oder ihm wieder entziehen.
- **Testfall [Data Isolation]:** Ein dritter "User C" (kein Team / fremdes Team) loggt sich ein; "User B" darf dessen Daten unter keinen Umständen per API (z.B. manipulierte Requests) oder UI aufrufen.
- **Testfall [User View]:** "User A" loggt sich ein und sieht logisch gefiltert die ihm durch "User B" zugewiesenen Directives in "Team Delta" sowie ggf. offene "Unassigned" Directives dieses Teams.

**Zu US-3.1.5 (Migration):**
- **Testfall [Upgrade Pipeline]:** Lokale Kopie einer alten v3.0 SQLite-Datenbank einspielen. `install.php` oder Upgrade-Routine triggern. Clicks im Dashboard prüfen -> Alte Daten müssen dem `Default` Team zugeordnet sein und der Login funktioniert unverändert.
