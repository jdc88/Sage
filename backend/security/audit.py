"""Simple structured audit logging (replace with Cloud Logging in production)."""

from __future__ import annotations

import logging
from datetime import datetime, timezone

logger = logging.getLogger("sage.audit")


def log_security_event(event_type: str, detail: str, **extra: object) -> None:
    payload = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "event_type": event_type,
        "detail": detail,
        **extra,
    }
    logger.info("SECURITY_EVENT %s", payload)
