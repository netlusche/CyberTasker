# Planning: Release 3.0 (Architektur & Basis für Multitenancy)

## Themen & Fokuspunkte
*Dieses Release ist das Fundament für die Zukunft von CyberTasker. Ursprünglich als 2.7 (Tech Debt) geplant, ist der Umfang des Refactorings so signifikant, dass wir es zum Major-Release 3.0 aufwerten. Der Fokus liegt auf massiven Code-Konsolidierungen und architektonischen Umbauten, um das System auf Mandantenfähigkeit (Teams, Release 3.1) und Whitelabeling (Branchen, Release 3.2) vorzubereiten.*

**Wichtige Architektonische Leitplanke:**
CyberTasker muss zwingend mit einfachen Shared-Hosting Umgebungen (wie z.B. **Strato Hosting Plus**) kompatibel bleiben. Das Backend bleibt Vanilla PHP (kein Node.js Daemon, keine komplexen Build-Pipelines auf dem Server). Moderne Architekturmuster (Middlewares, Repositories) müssen rein in PHP 8+ abgebildet werden.

- **Applikationslogik-Analyse:** Identifizierung von Flaschenhälsen, Redundanzen und inkonsistenten Architektur-Ansätzen.
- **Refactoring:** Saubere Trennung von UI-Komponenten (React) und streng typisierter Business-Logik (PHP).
- **Infrastruktur-Vorbereitung:** Grundlegung der Datenarchitektur für kommende Team-Funktionen sowie die Architekturkomponenten für dynamisches Branding.

## Zielsetzung
Das primäre Ziel dieses Releases ist **nicht** die Einführung neuer sichtbarer Features für den Endnutzer, sondern die Verbesserung der internen Code-Qualität, Wartbarkeit und Performance für zukünftige Skalierung auf einem Shared Host.

## Neue Epics / Aufgabenbereiche

### Epic 1: AI-basierte Lokalisierung
**US-3.0.1: Implementierung des Gemini API Translation-Skripts (Basis)**
* Neues Node-Skript (`scripts/translate_ai.js`) erstellen (wird lokal oder via CI ausgeführt, nicht auf dem Prod-Server).
* Integration der Gemini API (o.ä. LLM) zur intelligenten Lokalisierung.
* Einbettung der `TRANSLATION_GUIDELINES.md` als festen System-Prompt, um Kontext und Tonalität ("Löschen" statt "Löschen Sie") sicherzustellen.

**US-3.0.2: Der "Urknall" - Initiale Neu-Übersetzung aller Sprachen**
* Einmaliger Run des neuen LLM-Skripts mit dem Flag `--force-all`.
* Kompletter Re-Write aller Zielsprachen basierend auf der englischen Quell-Datei und den Cyberpunk/UI-Guidelines.
* Manuelle QA und Bereinigung von LLM-Artefakten.

**US-3.0.3: Inkrementeller CI/CD Übersetzungs-Workflow**
* Anpassung des Skripts für den normalen Entwickler-Alltag: Nur noch neu hinzugefügte Keys werden an die API gesendet.
* Schonung von Token-Kontingenten und Verhinderung ungewollter Änderungen.

### Epic 2: Frontend-Architektur (React)
**US-3.0.4: Frontend State-Management Architektur (Zustand/Context)**
* **Aktion:** Einführung eines sauberen, globalen und skalierbaren Store-Managements (z.B. Zustand oder React Context).
* **Ziel:** Prop-Drilling rigoros eliminieren. Vorbereitung eines `TenantStore` und `ThemeStore`, auf den spätere Whitelabel-Komponenten zugreifen können. Aktiver Mandant, User-Session und aktives Theme dürfen in der React-Hierarchie nicht mehr als Props durchgereicht werden.

### Epic 3: Backend-Architektur (Vanilla PHP für Shared Hosting)
**US-3.0.5: Data Access Layer (DAL) / Repository Pattern für PHP**
* **Aktion:** Direkte PDO/MySQL/SQLite Aufrufe aus den Controllern in spezielle Klassen (Repositories, z.B. `TaskRepository`) verschieben.
* **Ziel:** Dies ist der künftige Flaschenhals, an dem wir in Release 3.1 in *allen* Queries die `tenant_id` (Team ID) erzwingen können, ohne sie manuell in Controllern anhängen zu müssen. Kein Controller enthält noch direkte SQL-Strings. Kompatibel mit einfachem PHP-Hosting.

**US-3.0.6: API Middleware & Standardisierung**
* **Aktion:** Zentralisierung des API-In- und Outputs auf Basis von purem PHP. Alle Responses nutzen ein strenges JSON-Format via Helper-Klassen (z.B. `JsonResponse`). Fehler werfen standardisierte Exceptions, die von einem globalen Exception-Handler gefangen werden.
* **Ziel:** Strict Typing (Type-Hints und Return-Types für alle Methoden). Vorbereitung des Kern-Routings, damit Middleware-Checks (Auth, Tenant-Context) einfach vorgeschaltet werden können.

**US-3.0.7: Schema-Migration Engine Update**
* **Aktion:** Das Datenbank-Initialisierungs-Skript (`install.php` o.ä.) so umbauen, dass wir in Zukunft non-destruktive `ALTER TABLE` Migrationen fahren können.
* **Ziel:** Für Release 3.1 werden wir an fast jede Tabelle eine `team_id` hängen müssen. Dies erfordert ein System, das Schema-Updates auf Hostern wie Strato ohne Datenverlust anwendet.


## Ergänzungen für den Testplan
*(Wird nach Festlegung der genauen Refactoring-Ziele definiert. Fokus wird auf umfassenden Regressionstests liegen, um sicherzustellen, dass die bestehende Funktionalität durch das Refactoring exakt erhalten bleibt und auf Standard-Hostern stabil läuft.)*
