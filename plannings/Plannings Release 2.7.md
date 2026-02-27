# Planning: Release 2.6 (Stub)

## Themen & Fokuspunkte
*Dies ist ein Architektur- und Refactoring-Release (Tech Debt). Bevor neue große Features entwickelt werden, findet eine tiefgreifende Analyse und Bereinigung der Kernlogik statt.*
- **Applikationslogik-Analyse:** Identifizierung von Flaschenhälsen, Redundanzen und inkonsistenten Architektur-Ansätzen.
- **Refactoring:** Verbesserung der Code-Qualität, saubere Trennung von UI-Komponenten und Business-Logik, sowie Optimierung von Datenstrukturen.
- **Vorbereitung Team-Struktur & Branchen-Spezialisierung:** Grundlegung der Datenarchitektur für kommende Team-Funktionen (Release 3.0) sowie die Architekturkomponenten für dynamisches Branding (Release 3 Plus).

## Zielsetzung
Das primäre Ziel dieses Releases ist **nicht** die Einführung neuer sichtbarer Features für den Endnutzer, sondern die Verbesserung der internen Code-Qualität, Wartbarkeit und Performance für zukünftige Skalierung.

## Neue Epics / Aufgabenbereiche (Draft)

**US-2.7.1: Implementierung des Gemini API Translation-Skripts (Basis)**
* Neues Python- oder Node-Skript (`scripts/translate_ai.py` bzw. `.js`) erstellen.
* Integration der Gemini API (o.ä. LLM) zur intelligenten Lokalisierung.
* Einbettung der `TRANSLATION_GUIDELINES.md` als festen System-Prompt, um Kontext und Tonalität ("Löschen" statt "Löschen Sie") sicherzustellen.

**US-2.7.2: Der "Urknall" - Initiale Neu-Übersetzung aller Sprachen**
* Einmaliger Run des neuen LLM-Skripts mit dem Flag `--force-all`.
* Kompletter Re-Write aller 23 Zielsprachen basierend auf der englischen Quell-Datei und den Cyberpunk/UI-Guidelines.
* Manuelle QA und Bereinigung von LLM-Artefakten (z.B. Markdown-Blöcke im JSON).

**US-2.7.3: Inkrementeller CI/CD Übersetzungs-Workflow**
* Anpassung des Skripts für den normalen Entwickler-Alltag: Nur noch neu hinzugefügte Keys (die in der Quell-Datei vorhanden sind, aber in der Zielsprache fehlen) werden an die API gesendet.
* Schonung von Token-Kontingenten und Verhinderung ungewollter Änderungen an bereits verifizierten Übersetzungen.

**US-2.7.4: Analyse und Konsolidierung der Frontend-Logik**
* Untersuchung des State-Managements und Datenflusses zwischen den React-Komponenten.
* Identifizierung von Refactoring-Potential (z.B. Ersetzen komplexer Prop-Drillings durch effizienteres State-Management, Reduzierung unnötiger Re-Renders).

**US-2.7.5: Analyse und Konsolidierung der Backend-API**
* Review sämtlicher PHP-Endpunkte.
* Vereinheitlichung der Response-Formate, Error-Handling-Mechanismen und Datenbankzugriffe.

**US-2.7.6: Architektur-Vorbereitung für Team-Strukturen und Branchen-Spezialisierungen**
* Konzeptionierung und Vorbereitung der Datenarchitektur auf die Einführung mandantenfähiger Team-Strukturen (vorgesehen für Release 3.0), um spätere, extrem komplexe Datenmigrationen zu minimieren.
* Konzeptionierung und erste Implementierung einer flexiblen Theming- und Wording-Architektur (Branding-Engine).
* Vorbereitung darauf, dass die Anwendung später (in Release 3 Plus) basierend auf einer Konfiguration alle Texte, Themes und evtl. spezifische UI-Elemente dynamisch an eine Branche (z.B. Handwerk, Gesundheitswesen) anpassen kann.
* Strikte Trennung von Core-Logik und Branchen-spezifischem Wording/Styling; Vorbereitung des Settings-States für dynamische Installationsparameter (die dann z.B. pro Team oder Instanz greifen können).

## Ergänzungen für den Testplan
*(Wird nach Festlegung der genauen Refactoring-Ziele definiert. Fokus wird auf umfassenden Regressionstests liegen, um sicherzustellen, dass die bestehende Funktionalität durch das Refactoring exakt erhalten bleibt.)*
