# Planning: Release 3 Plus

*Hinweis: Dieses Release folgt konzeptionell nach der Einführung der Teamfunktionen in der 3.x-Reihe.*

## Themen & Fokuspunkte
Dieses Release fokussiert sich auf die Erschließung neuer Zielgruppen durch branchenspezifische Spezialisierungen. CyberTasker soll sich flexibel an verschiedene Arbeitsumgebungen anpassen lassen, während der originale Cyberpunk-Charme als Standard erhalten bleibt.

- **Installer-Auswahl:** Möglichkeit zur Wahl eines Branchen-Profils während der Initialinstallation.
- **Branchenspezifisches Branding:** Dynamische Anpassung von Bezeichnungen (Wording), Farben (Themes) und ggf. kleineren UI-Flows an spezifische Zielgruppen (z.B. Handwerksbetriebe, Gesundheitswesen).

## Neue User Stories

**US-3.P.1: Branchenauswahl im Installer**
* **Als** Administrator/Installateur
* **Möchte ich** bei der Installation von CyberTasker ein spezifisches Branchen-Branding (z.B. Handwerk, Medizin, Cyberpunk-Default) auswählen können
* **Damit** die Applikation direkt auf den Anwendungsfall meines Unternehmens zugeschnitten ist.
* **Akzeptanzkriterien:**
  - Neuer Auswahlschritt im Installations-Wizard (`api/install.php`).
  - Auswahl aus vordefinierten Branchen-Paketen (Cyberpunk ist Default).
  - Speicherung des gewählten Brandings sicher in der Systemkonfiguration (`config.local.php` oder Datenbank).

**US-3.P.2: Dynamisches Wording und Theming (Branchen-Profile)**
* **Als** System
* **Möchte ich** basierend auf der Installationskonfiguration automatisch das passende Branchen-Profil laden
* **Damit** die gesamte UI-Sprache und farbliche Gestaltung an die gewählte Branche angepasst wird.
* **Akzeptanzkriterien:**
  - Laden spezifischer Sprachdateien (Overrides für Standardtexte wie z.B. "Patientenakte" statt "Directive", "Materialbesorgung" statt "Sub-Routine").
  - Laden definierter Default-Themes für die Branche (z.B. clean/klinisch für Gesundheitswesen, robust für Handwerk).
  - Nahtlose Integration in das in Version 2.6 vorbereitete Architektur-Konstrukt der "Branding Engine".

**US-3.P.3: Management der Branchen-Profileinstellungen in Admin-Panel**
* **Als** Administrator
* **Möchte ich** das gewählte Branchen-Profil nachträglich im Admin-Panel anpassen können
* **Damit** Anpassungen möglich sind, falls sich die Struktur oder Vorliebe des Unternehmens ändert.
* **Akzeptanzkriterien:**
  - Ein Dropdown im Adminbereich erlaubt den Wechsel der Branche.
  - Änderungen erfordern eine Bestätigung und validieren ggf. verbundene Abhängigkeiten in der DB.

## Ergänzungen für den Testplan

**Zu US-3.P.1 & US-3.P.2 (Installer & dynamisches Profil):**
- **Testfall Installation:** Installationstool aufrufen, "Handwerksbetrieb" auswählen und abschließen. Einloggen und prüfen, ob branchenspezifische Begriffe geladen werden und das korrekte Default-Theme angewendet wird.
- **Testfall Fallback:** Reguläre Installation als "Cyberpunk" abschließen. Sicherstellen, dass die App exakt das originäre Look & Feel aufweist.

**Zu US-3.P.3 (Wechsel im Adminbereich):**
- **Testfall:** Von "Cyberpunk" im Adminbereich zu "Gesundheitswesen" wechseln. Neuladen. Prüfen ob Text-Strings sofort auf Klinik-Jargon gewechselt sind (z.B. Dashboard-Titel).
