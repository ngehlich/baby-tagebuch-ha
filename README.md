# Baby-Tagebuch für Home Assistant

> **Hinweis:** Dieses Projekt wurde mit KI (Claude von Anthropic) erstellt und von mir für den Privatgebrauch getestet. Es ist **kein Medizinprodukt**; Perzentilen und Hinweise ersetzen keine ärztliche Beurteilung. Nutzung auf eigene Verantwortung.

Eine Baby-Tagebuch-App als eigener Menüpunkt in Home Assistant. Die Daten liegen lokal in Home Assistant (`/config/.storage/baby_tagebuch`) und werden zwischen allen Geräten abgeglichen – zu Hause, unterwegs und in der Companion-App.

## Funktionen

- **Stillen:** Timer mit Seitenwechsel links/rechts, Pause, Vorschlag für die nächste Seite, Nachtragen
- **Fläschchen und Abpumpen** in ml
- **Windeln:** nass/Stuhl mit Stuhlfarbe (Hinweis bei auffälligen Farben)
- **Schlaf** als Timer oder nachgetragen
- **Wachstum:** Gewicht, Länge, Kopfumfang mit Perzentile und SDS, Kurven von 0 bis 3 Jahren, Gewichtsverlauf in % vom Geburtsgewicht
- **Vorsorge:** U1–U9 mit Zeitfenstern ab Geburtsdatum, Impfliste, tägliche Häkchen (z. B. Vitamin D)
- Temperatur, Medikamente, Notizen, Meilensteine, 7-Tage-Statistik
- **Rückgängig** für die letzten Aktionen, Nachtmodus, Export als JSON/CSV
- **Offline-App:** startet auch ganz ohne Verbindung, Abgleich mit Home Assistant sobald wieder Netz da ist

## Offline-App fürs Handy

Der Menüpunkt in Home Assistant braucht eine Verbindung. Für Orte ohne Netz (z. B. Krankenhaus) gibt es zusätzlich eine eigene App, die komplett auf dem Handy läuft:

1. In Home Assistant: *Baby-Tagebuch → Mehr → Offline-App öffnen* (öffnet die https-Adresse, z. B. über Nabu Casa).
2. Im Browser zum Startbildschirm hinzufügen (iPhone: Safari → Teilen → *Zum Home-Bildschirm*; Android: Menü → *App installieren*).
3. Die App über das neue Symbol öffnen und einmal mit Home Assistant anmelden.

Danach startet die App auch ohne Verbindung. Einträge bleiben auf dem Handy und werden automatisch abgeglichen, sobald Home Assistant wieder erreichbar ist. Offline funktioniert nur über eine https-Adresse, nicht über die lokale IP. Klappt die Anmeldung nicht, kann unter *Mehr* ein langlebiges Zugangstoken eingefügt werden.

## Sprachsteuerung (z. B. Alexa)

Die Integration bringt Aktionen mit, die den Still-Timer der App steuern:

| Aktion | Wirkung |
|---|---|
| `baby_tagebuch.stillen_starten` | startet links/rechts/nächste Seite, bzw. wechselt dorthin |
| `baby_tagebuch.stillen_wechseln` | wechselt auf die andere Seite |
| `baby_tagebuch.stillen_beenden` | beendet und speichert die Mahlzeit |
| `baby_tagebuch.stillen_umschalten` | startet, wenn nichts läuft, sonst beenden |

Jede Aktion gibt einen Satz zurück (`nachricht`), den ein Skript vorlesen lassen kann. Für Alexa: Skripte anlegen, die diese Aktionen aufrufen, an Alexa freigeben (Home Assistant Cloud) und in der Alexa-App eine Routine mit eigenem Sprachbefehl darauf legen.

## Installation über HACS

1. HACS → ⋮ → *Benutzerdefinierte Repositories* → `https://github.com/ngehlich/baby-tagebuch-ha`, Typ *Integration*
2. „Baby-Tagebuch“ herunterladen und Home Assistant neu starten
3. *Einstellungen → Geräte & Dienste → Integration hinzufügen → Baby-Tagebuch*

Danach erscheint „Baby-Tagebuch“ in der Seitenleiste.

## Updates und neue Versionen

HACS bietet nur veröffentlichte Releases als Update an. Änderungen auf `main` (z. B. an der README) lösen kein Update aus.

Neue Version veröffentlichen:

1. `version` in `custom_components/baby_tagebuch/manifest.json` hochzählen
2. Abschnitt `## <version>` in `CHANGELOG.md` ergänzen
3. Auf `main` mergen – der Workflow „Release“ legt Tag und GitHub-Release `v<version>` automatisch an

## Referenzdaten

- **Bei Geburt (23–39 SSW):** Voigt et al., Perzentilen für Körpermaße Neugeborener (Frühgeborenenkorrektur)
- **Gewicht und Länge 0–3 Jahre:** Kromeyer-Hauschild et al., Monatsschr Kinderheilkd 2001
- **Kopfumfang:** WHO Child Growth Standards 2006 (Kromeyer-Hauschild enthält keinen Kopfumfang)

Die LMS-Parameter stammen aus dem R-Paket [childsds](https://cran.r-project.org/package=childsds) von Mandy Vogel (GPL-3). Deshalb steht auch dieses Projekt unter der GPL-3.0.

Enthalten sind nur Referenzwerte, die über childsds unter GPL-3 frei verfügbar sind. Für 40–43 SSW und für den Kopfumfang bei Geburt gibt es deshalb keine Voigt-Einordnung.

## Lizenz

GPL-3.0, siehe [LICENSE](LICENSE).
