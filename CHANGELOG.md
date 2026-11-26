# Änderungen

## 1.2.0

- Still-Timer per Sprachassistent/Automation steuerbar: neue Aktionen `baby_tagebuch.stillen_starten` (Seite links/rechts/nächste), `stillen_wechseln`, `stillen_beenden` und `stillen_umschalten`
- Die Aktionen liefern einen Antwortsatz (z. B. „Stillen beendet nach 17 Minuten: links 6 Minuten, rechts 11 Minuten. Nächstes Mal links.“) für Sprachausgaben
- Änderungen erscheinen sofort in Panel und Offline-App

## 1.1.0

- Neue Offline-App fürs Handy: startet ohne Verbindung (Service Worker), speichert Einträge auf dem Gerät und gleicht sie mit Home Assistant ab, sobald wieder Netz da ist
- Anmeldung der Offline-App über den normalen Home-Assistant-Login, alternativ per Langzeit-Token
- Neuer Knopf im Panel unter *Mehr*: „Offline-App öffnen“ mit der https-Adresse (Nabu Casa)
- Neuer Abgleich-Endpunkt `/api/baby_tagebuch/sync` (nur mit Anmeldung)

## 1.0.1

Erste veröffentlichte Version.

- Stillen mit Timer links/rechts, Fläschchen, Abpumpen, Windeln, Schlaf
- Wachstum mit Perzentilen (Voigt, Kromeyer-Hauschild, WHO-Kopfumfang)
- U1–U9, Impfliste, tägliche Häkchen, Notizen, Meilensteine, 7-Tage-Statistik
- Rückgängig, Nachtmodus, Export als JSON/CSV, Offline-Puffer
- README: nur GPL-lizenzierte Referenzwerte enthalten
