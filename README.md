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
- **Offline-Puffer:** ohne Verbindung wird auf dem Gerät zwischengespeichert und später nachgereicht

## Installation über HACS

1. HACS → ⋮ → *Benutzerdefinierte Repositories* → `https://github.com/ngehlich/baby-tagebuch-ha`, Typ *Integration*
2. „Baby-Tagebuch“ herunterladen und Home Assistant neu starten
3. *Einstellungen → Geräte & Dienste → Integration hinzufügen → Baby-Tagebuch*

Danach erscheint „Baby-Tagebuch“ in der Seitenleiste.

## Referenzdaten

- **Bei Geburt (23–39 SSW):** Voigt et al., Perzentilen für Körpermaße Neugeborener (Frühgeborenenkorrektur)
- **Gewicht und Länge 0–3 Jahre:** Kromeyer-Hauschild et al., Monatsschr Kinderheilkd 2001
- **Kopfumfang:** WHO Child Growth Standards 2006 (Kromeyer-Hauschild enthält keinen Kopfumfang)

Die LMS-Parameter stammen aus dem R-Paket [childsds](https://cran.r-project.org/package=childsds) von Mandy Vogel (GPL-3). Deshalb steht auch dieses Projekt unter der GPL-3.0.

Enthalten sind nur Referenzwerte, die über childsds unter GPL-3 frei verfügbar sind. Für 40–43 SSW und für den Kopfumfang bei Geburt gibt es deshalb keine Voigt-Einordnung.

## Lizenz

GPL-3.0, siehe [LICENSE](LICENSE).
