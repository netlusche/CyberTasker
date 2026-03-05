# Planning: Release 4.0

*Hinweis: Dieses Release folgt konzeptionell nach der Einführung der Teamfunktionen in Release 3.1.*

## Themen & Fokuspunkte
Dieses Release fokussiert sich auf die Erschließung neuer Zielgruppen durch branchenspezifische Spezialisierungen. CyberTasker soll sich flexibel an verschiedene Arbeitsumgebungen anpassen lassen, während der originale Cyberpunk-Charme als Standard erhalten bleibt.

- **Installer-Auswahl:** Möglichkeit zur Wahl eines Branchen-Profils während der Initialinstallation.
- **Branchenspezifisches Branding:** Dynamische Anpassung von Bezeichnungen (Wording), Farben (Themes) und ggf. kleineren UI-Flows an spezifische Zielgruppen (z.B. Handwerksbetriebe, Gesundheitswesen).

## Neue User Stories

**US-4.0.1: Branchenauswahl im Installer**
* **Als** Administrator/Installateur
* **Möchte ich** bei der Installation von CyberTasker ein spezifisches Branchen-Branding (z.B. Handwerk, Medizin, Cyberpunk-Default) auswählen können
* **Damit** die Applikation direkt auf den Anwendungsfall meines Unternehmens zugeschnitten ist.
* **Akzeptanzkriterien:**
  - Neuer Auswahlschritt im Installations-Wizard (`api/install.php`).
  - Auswahl aus vordefinierten Branchen-Paketen (Cyberpunk ist Default).
  - Speicherung des gewählten Brandings sicher in der Systemkonfiguration (`config.local.php` oder Datenbank).

**US-4.0.2: Dynamisches Wording und Theming (Branchen-Profile)**
* **Als** System
* **Möchte ich** basierend auf der Installationskonfiguration automatisch das passende Branchen-Profil laden
* **Damit** die gesamte UI-Sprache und farbliche Gestaltung an die gewählte Branche angepasst wird.
* **Akzeptanzkriterien:**
  - Laden spezifischer Sprachdateien (Overrides für Standardtexte wie z.B. "Patientenakte" statt "Directive", "Materialbesorgung" statt "Sub-Routine").
  - Laden definierter Default-Themes für die Branche (z.B. clean/klinisch für Gesundheitswesen, robust für Handwerk).
  - Nahtlose Integration in das in Version 3.0 vorbereitete Architektur-Konstrukt der "Branding Engine".

**US-4.0.3: Management der Branchen-Profileinstellungen in Admin-Panel**
* **Als** Administrator
* **Möchte ich** das gewählte Branchen-Profil nachträglich im Admin-Panel anpassen können
* **Damit** Anpassungen möglich sind, falls sich die Struktur oder Vorliebe des Unternehmens ändert.
* **Akzeptanzkriterien:**
  - Ein Dropdown im Adminbereich erlaubt den Wechsel der Branche.
  - Änderungen erfordern eine Bestätigung und validieren ggf. verbundene Abhängigkeiten in der DB.

**US-4.0.4: Modulares Feature-Toggling pro Branchen-Profil**
* **Als** Installer / System
* **Möchte ich**, dass unpassende Features (wie z.B. "Gamification/XP") in seriösen Settings (wie Arztpraxen) hart ausgeblendet werden
* **Damit** die Applikation professionell und exakt auf den Use-Case zugeschnitten wirkt, ohne den User durch überflüssige Menüpunkte zu irritieren.
* **Akzeptanzkriterien:**
  - Die Branchen-Config (JSON/DB) erhält Boolsche Flags (z.B. `gamification_enabled: false`).
  - Das React-Frontend nutzt die Context-API, um diese UI-Elemente (Top-Bar XP, Leaderboard) bei entsprechendem Flag komplett aus dem DOM zu entfernen.

**US-4.0.5: Custom Logo Upload für Whitelabeling**
* **Als** Administrator
* **Möchte ich** im Admin-Panel das CyberTasker-Standardlogo durch das Firmenlogo meines Unternehmens ersetzen können
* **Damit** das Branding gegenüber meinen Mitarbeitern konsistent erscheint und Whitelabel-Ansprüche der 4.0er Version erfüllt werden.
* **Akzeptanzkriterien:**
  - Ein simpler Upload-Button im Admin-Backend erlaubt den Upload einer PNG/SVG Datei.
  - Das System speichert das Logo ab und ersetzt das Default-Top-Left-Logo in der React Navbar sowie auf dem Login-Screen.
  - Falls kein Logo hochgeladen wurde, greift der Fallback auf das Default-Logo.


## Ergänzungen für den Testplan

**Zu US-4.0.1 & US-4.0.2 (Installer & dynamisches Profil):**
- **Testfall Installation:** Installationstool aufrufen, "Handwerksbetrieb" auswählen und abschließen. Einloggen und prüfen, ob branchenspezifische Begriffe geladen werden und das korrekte Default-Theme angewendet wird.
- **Testfall Fallback:** Reguläre Installation als "Cyberpunk" abschließen. Sicherstellen, dass die App exakt das originäre Look & Feel aufweist.

**Zu US-4.0.3 (Wechsel im Adminbereich):**
- **Testfall:** Von "Cyberpunk" im Adminbereich zu "Gesundheitswesen" wechseln. Neuladen. Prüfen ob Text-Strings sofort auf Klinik-Jargon gewechselt sind (z.B. Dashboard-Titel).
