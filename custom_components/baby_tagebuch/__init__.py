"""Baby-Tagebuch: speichert die Daten der Baby-Tagebuch-App in Home Assistant.

Die Daten liegen in /config/.storage/baby_tagebuch (nicht öffentlich, Teil jeder
HA-Sicherung). Die App läuft als Menüpunkt in der Seitenleiste und ist damit
durch den Home-Assistant-Login geschützt.
"""
from __future__ import annotations

import asyncio
import logging
from pathlib import Path
from typing import Any

import voluptuous as vol

from homeassistant.components import frontend, panel_custom, websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import (
    async_dispatcher_connect,
    async_dispatcher_send,
)
from homeassistant.helpers.storage import Store

_LOGGER = logging.getLogger(__name__)

DOMAIN = "baby_tagebuch"
VERSION = "1.0.1"
STORAGE_VERSION = 1
PANEL_URL = "baby-tagebuch"
STATIC_URL = "/baby_tagebuch_static/baby-tagebuch-panel.js"
PANEL_FILE = Path(__file__).parent / "baby-tagebuch-panel.js"
SIGNAL = f"{DOMAIN}_changed"
REGISTERED = f"{DOMAIN}_registered"
MAX_BATCH = 1000


class BabyStore:
    """Datensätze mit Revision; pro Schlüssel gewinnt die neueste Änderung."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, DOMAIN, private=True, atomic_writes=True
        )
        self.lock = asyncio.Lock()
        self.rev = 0
        self.records: dict[str, dict[str, Any]] = {}

    async def async_load(self) -> None:
        data = await self._store.async_load()
        if data:
            self.rev = int(data.get("rev", 0))
            self.records = data.get("records", {})

    async def async_save(self) -> None:
        await self._store.async_save({"rev": self.rev, "records": self.records})

    def apply(self, changes: list[dict[str, Any]]) -> tuple[bool, set[str]]:
        """Übernimmt Änderungen; liefert (geändert, abgelehnte Schlüssel)."""
        changed = False
        rejected: set[str] = set()
        for ch in changes:
            key = ch["k"]
            cur = self.records.get(key)
            if cur is not None and float(cur.get("u", 0)) > ch["u"]:
                rejected.add(key)
                continue
            self.rev += 1
            rec: dict[str, Any] = {"u": ch["u"], "r": self.rev}
            if ch.get("d"):
                rec["d"] = True
            else:
                rec["v"] = ch.get("v")
            self.records[key] = rec
            changed = True
        return changed, rejected


CHANGE_SCHEMA = vol.Schema(
    {
        vol.Required("k"): vol.All(str, vol.Length(min=1, max=200)),
        vol.Required("u"): vol.Coerce(float),
        vol.Optional("d", default=False): bool,
        vol.Optional("v"): object,
    }
)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "baby_tagebuch/sync",
        vol.Optional("since", default=0): vol.Coerce(int),
        vol.Optional("changes", default=[]): vol.All(
            [CHANGE_SCHEMA], vol.Length(max=MAX_BATCH)
        ),
    }
)
@websocket_api.async_response
async def ws_sync(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Änderungen annehmen und alles seit `since` zurückgeben."""
    store: BabyStore | None = hass.data.get(DOMAIN)
    if store is None:
        connection.send_error(msg["id"], "not_loaded", "Baby-Tagebuch ist nicht eingerichtet")
        return
    async with store.lock:
        changed, rejected = store.apply(msg["changes"])
        if changed:
            await store.async_save()
        since = msg["since"]
        full = False
        if since > store.rev:  # Server-Daten älter als der Client (z. B. Wiederherstellung)
            since = 0
            full = msg["since"] > 0
        out = {
            k: r for k, r in store.records.items() if r["r"] > since or k in rejected
        }
        rev = store.rev
    connection.send_result(msg["id"], {"rev": rev, "records": out, "reset": full})
    if changed:
        async_dispatcher_send(hass, SIGNAL, rev)


@websocket_api.websocket_command({vol.Required("type"): "baby_tagebuch/subscribe"})
@callback
def ws_subscribe(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Meldet neue Revisionen, damit andere Geräte sofort nachladen."""

    @callback
    def forward(rev: int) -> None:
        connection.send_message(websocket_api.event_message(msg["id"], {"rev": rev}))

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(hass, SIGNAL, forward)
    connection.send_result(msg["id"])


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    store = BabyStore(hass)
    await store.async_load()
    hass.data[DOMAIN] = store

    if not hass.data.get(REGISTERED):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(STATIC_URL, str(PANEL_FILE), False)]
        )
        websocket_api.async_register_command(hass, ws_sync)
        websocket_api.async_register_command(hass, ws_subscribe)
        hass.data[REGISTERED] = True

    await panel_custom.async_register_panel(
        hass,
        webcomponent_name="baby-tagebuch-panel",
        frontend_url_path=PANEL_URL,
        module_url=f"{STATIC_URL}?v={VERSION}",
        sidebar_title="Baby-Tagebuch",
        sidebar_icon="mdi:baby-bottle-outline",
        embed_iframe=True,
        require_admin=False,
        config={},
    )
    _LOGGER.debug("Baby-Tagebuch geladen: %s Datensätze", len(store.records))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    frontend.async_remove_panel(hass, PANEL_URL)
    hass.data.pop(DOMAIN, None)
    return True
