# Planning: Release 2.7 (AI Lokalisierung)

## Themen & Fokuspunkte
*Dieses Release gliedert die KI-Übersetzungslogik aus dem großen Architektur-Umbau (Release 3.0) aus.*
- **Automatisierte Übersetzungen:** Einführung eines LLM-basierten Skripts (Gemini) zur intelligenten, kontext-bewussten Lokalisierung aller Zielsprachen.
- **CI/CD Workflow:** Etablierung eines inkrementellen Workflows, der in Zukunft automatisch nur neue Strings übersetzt und Ressourcen schont.

## Zielsetzung
Das primäre Ziel dieses Releases ist die vollständige und thematisch stringente Übersetzung der Applikation in alle 23 Zielsprachen unter Einhaltung der Cyberpunk-Guidelines.

## Epics / Aufgabenbereiche

### Epic 1: AI-basierte Lokalisierung
**US-2.7.1: Implementierung des Gemini API Translation-Skripts (Basis)**
* Neues Node-Skript (`scripts/translate_ai.js`) erstellen (wird lokal oder via CI ausgeführt).
* Integration der Gemini API zur intelligenten Lokalisierung.
* Einbettung der `TRANSLATION_GUIDELINES.md` als festen System-Prompt, um Kontext und Tonalität ("Löschen" statt "Löschen Sie") sicherzustellen.

**US-2.7.2: Der "Urknall" - Initiale Neu-Übersetzung aller Sprachen**
* Einmaliger Run des neuen LLM-Skripts mit dem Flag `--force-all`.
* Kompletter Re-Write aller Zielsprachen basierend auf der englischen Quell-Datei und den Cyberpunk/UI-Guidelines.
* Fallback-Sicherung auf reguläres Google Translate bei API Quota-Limits.

**US-2.7.3: Inkrementeller CI/CD Übersetzungs-Workflow**
* Das Skript verarbeitet standardmäßig nur noch Deltas: Nur neu hinzugefügte Keys werden an die API gesendet.
* Ausführliche Dokumentation der Aufrufparameter (`--force-all`, `--langs`) in den Guidelines.
