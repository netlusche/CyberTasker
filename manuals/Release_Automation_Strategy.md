# Release Automation Strategy (Draft)

Um zu verhindern, dass die Versionsnummer in Zukunft beim Release manuell vergessen oder falsch hochgezählt wird, sollten wir uns eine automatisierte Pipeline aufbauen.

Aktuell steuern wir die Version über die `package.json` (`"version": "2.4.0"`), welche dann während der Laufzeit vom React-Frontend für das Admin-Panel ausgelesen wird. 

## Ziel-Szenario: Der "One-Click-Release"

Anstatt die Datei per Hand anzupassen, können wir die integrierten Funktionen von Node/npm nutzen, gebündelt in einem automatischen Skript.

### 1. Das `npm version` Kommando nutzen
Node bringt von Haus aus den Befehl `npm version <major|minor|patch>` mit.
Dieser Befehl macht vollautomatisch Folgendes:
1. Er ändert die Versionsnummer in der `package.json` nach den Semantic Versioning Regeln.
2. Er erstellt automatisch einen Git Commit mit der Nachricht `X.X.X`.
3. Er erstellt automatisch einen Git Tag `vX.X.X`.

### 2. Ein zentrales Release-Skript (scripts/release.js)
Wir schreiben ein kleines interaktives Node-Skript, das den Release-Prozess steuert:

```javascript
// Beispiel-Ablauf des Skripts:
1. Skript prüft, ob wir auf dem Main-Branch sind und keine uncommitteten Änderungen haben.
2. Skript testet die CI-Sicherung: `npm run check:all` und `npm test`. Schlägt ein Test fehl, bricht das Release ab.
3. Skript fragt im Terminal: "Ist dies ein Major, Minor oder Patch Release?"
4. Skript führt `npm version <auswahl>` aus (updated package.json & committet).
5. Skript baut das Projekt: `npm run build`
6. Skript pusht den neuen Commit und den Tag zu GitHub: `git push --follow-tags`
```

### 3. Vorteile dieser Struktur
- **Kein Nachdenken:** Du rufst nur noch `npm run release` auf.
- **Konsistenz:** Die `package.json` ist immer die absolute "Source of Truth". Das Admin-Panel liest diesen Wert dynamisch.
- **Fehlervermeidung:** Der Tag und der Commit passen *immer* zur Version in der App, da sie im gleichen Millisekunden-Bruchteil vom System generiert werden.
- **Sicherheit:** Ein Release passiert nur, wenn alle Tests (i18n, Theme, E2E) grün sind.

*(Das Skript ließe sich in Release 2.6 einplanen und in 10-15 Minuten umsetzen)*
