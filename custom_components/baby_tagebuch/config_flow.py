"""Einrichtung des Baby-Tagebuchs (ohne Eingaben)."""
from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

DOMAIN = "baby_tagebuch"


class BabyTagebuchConfigFlow(ConfigFlow, domain=DOMAIN):
    """Legt den einzigen Eintrag an."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        return self.async_create_entry(title="Baby-Tagebuch", data={})
