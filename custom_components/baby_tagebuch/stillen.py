"""Still-Timer serverseitig steuern (für Sprachassistenten und Automationen).

Arbeitet auf denselben Datensätzen wie die App: `active.feed` ist der laufende
Timer, ein beendetes Stillen wird als Eintrag `e:<id>` vom Typ `feed` gespeichert.
Die Logik entspricht feedStart/feedStop der App.
"""
from __future__ import annotations

import random
import string
import time
from typing import Any

import voluptuous as vol

from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.dispatcher import async_dispatcher_send

SEITEN = {"links": "L", "rechts": "R"}
NAME = {"L": "links", "R": "rechts"}


def _now() -> int:
    return int(time.time() * 1000)


def _uid(now: int) -> str:
    digits = string.digits + string.ascii_lowercase
    n, out = now, ""
    while n:
        n, r = divmod(n, 36)
        out = digits[r] + out
    return out + "".join(random.choices(digits, k=5))


def _minuten(ms: float) -> str:
    m = round(ms / 60000)
    if m < 1:
        return "weniger als einer Minute"
    ms_ = lambda n: "1 Minute" if n == 1 else f"{n} Minuten"
    if m < 60:
        return ms_(m)
    h, m = divmod(m, 60)
    hs = "1 Stunde" if h == 1 else f"{h} Stunden"
    return hs if not m else f"{hs} {ms_(m)}"


def _active(records: dict[str, Any]) -> dict[str, Any]:
    rec = records.get("active")
    v = rec.get("v") if rec and not rec.get("d") else None
    v = dict(v) if isinstance(v, dict) else {}
    v.setdefault("feed", None)
    v.setdefault("sleep", None)
    return v


def _last_feed(records: dict[str, Any]) -> dict[str, Any] | None:
    best = None
    for k, r in records.items():
        v = r.get("v")
        if k.startswith("e:") and not r.get("d") and isinstance(v, dict) and v.get("type") == "feed":
            if best is None or v.get("start", 0) > best.get("start", 0):
                best = v
    return best


def naechste_seite(records: dict[str, Any]) -> str:
    """Wie nextSide() in der App: Gegenseite der zuletzt angelegten Seite, sonst links."""
    last = _last_feed(records)
    if not last:
        return "L"
    zuletzt = last.get("last") or ("R" if last.get("R") and not last.get("L") else "L")
    return "R" if zuletzt == "L" else "L"


def _sides(feed: dict[str, Any], now: int) -> tuple[float, float]:
    left = right = 0.0
    for s in feed.get("segs", []):
        t = ((s.get("end") or now) - s["start"]) / 1000
        if s.get("side") == "L":
            left += t
        else:
            right += t
    return left, right


def _laeuft(feed: dict[str, Any] | None) -> str | None:
    """Seite, die gerade läuft (None = kein Timer oder pausiert)."""
    if not feed or not feed.get("segs"):
        return None
    cur = feed["segs"][-1]
    return None if cur.get("end") else cur.get("side")


def plane(records: dict[str, Any], aktion: str, seite: str | None, now: int) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    """Berechnet die Änderungen für eine Aktion. Liefert (Änderungen, Antwort)."""
    active = _active(records)
    feed = active["feed"]
    laeuft = _laeuft(feed)
    changes: list[dict[str, Any]] = []

    if aktion == "umschalten":
        aktion = "beenden" if feed else "starten"
        seite = None
    if aktion == "wechseln":
        if laeuft:
            seite = "R" if laeuft == "L" else "L"
        aktion = "starten"

    if aktion == "starten":
        side = seite or naechste_seite(records)
        if laeuft == side:
            dauer = now - feed["segs"][-1]["start"]
            return [], {"aktion": "laeuft_bereits", "seite": NAME[side], "laeuft": True,
                        "nachricht": f"Stillen {NAME[side]} läuft bereits seit {_minuten(dauer)}."}
        neu = feed is None
        if neu:
            feed = {"segs": []}
            vorher = _last_feed(records)
        else:
            feed = {"segs": [dict(s) for s in feed["segs"]]}
            if feed["segs"] and not feed["segs"][-1].get("end"):
                feed["segs"][-1]["end"] = now
        feed["segs"].append({"side": side, "start": now, "end": None})
        active["feed"] = feed
        changes.append({"k": "active", "u": now, "v": active})
        if neu:
            msg = f"Stillen {NAME[side]} gestartet."
            if vorher:
                msg += f" Letzte Mahlzeit vor {_minuten(now - (vorher.get('end') or vorher['start']))}."
        else:
            msg = f"Gewechselt auf {NAME[side]}."
        return changes, {"aktion": "gestartet" if neu else "gewechselt", "seite": NAME[side], "laeuft": True, "nachricht": msg}

    if aktion == "beenden":
        if not feed or not feed.get("segs"):
            return [], {"aktion": "nichts", "laeuft": False, "nachricht": "Es läuft gerade kein Stillen."}
        segs = [dict(s) for s in feed["segs"]]
        if not segs[-1].get("end"):
            segs[-1]["end"] = now
        left, right = _sides({"segs": segs}, now)
        last = segs[-1]["side"]
        eid = _uid(now)
        event = {"type": "feed", "start": segs[0]["start"], "end": segs[-1]["end"],
                 "L": round(left), "R": round(right), "last": last, "id": eid}
        active["feed"] = None
        changes.append({"k": "e:" + eid, "u": now, "v": event})
        changes.append({"k": "active", "u": now, "v": active})
        teile = []
        if left >= 30:
            teile.append(f"links {_minuten(left * 1000)}")
        if right >= 30:
            teile.append(f"rechts {_minuten(right * 1000)}")
        naechste = NAME["R" if last == "L" else "L"]
        msg = f"Stillen beendet nach {_minuten((left + right) * 1000)}"
        msg += (": " + ", ".join(teile) + "." if len(teile) > 1 else ".")
        msg += f" Nächstes Mal {naechste}."
        return changes, {"aktion": "beendet", "laeuft": False, "dauer_min": round((left + right) / 60),
                         "links_min": round(left / 60), "rechts_min": round(right / 60),
                         "naechste_seite": naechste, "nachricht": msg}

    raise HomeAssistantError(f"Unbekannte Aktion: {aktion}")


SCHEMA_STARTEN = vol.Schema({vol.Optional("seite", default="naechste"): vol.In(["links", "rechts", "naechste"])})
SCHEMA_LEER = vol.Schema({})


def async_register_services(hass: HomeAssistant, domain: str, signal: str) -> None:
    """Registriert stillen_starten / _wechseln / _beenden / _umschalten."""

    async def handle(call: ServiceCall) -> ServiceResponse:
        store = hass.data.get(domain)
        if store is None:
            raise HomeAssistantError("Baby-Tagebuch ist nicht eingerichtet")
        aktion = call.service.removeprefix("stillen_")
        seite = SEITEN.get(call.data.get("seite", ""))
        async with store.lock:
            now = _now()
            changes, antwort = plane(store.records, aktion, seite, now)
            if changes:
                store.apply(changes)
                await store.async_save()
            rev = store.rev
        if changes:
            async_dispatcher_send(hass, signal, rev)
        return antwort

    for name, schema in (("stillen_starten", SCHEMA_STARTEN), ("stillen_wechseln", SCHEMA_LEER),
                         ("stillen_beenden", SCHEMA_LEER), ("stillen_umschalten", SCHEMA_LEER)):
        hass.services.async_register(domain, name, handle, schema=schema, supports_response=SupportsResponse.OPTIONAL)
