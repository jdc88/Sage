"""Prompt injection detection — block adversarial instructions in user/clinical text."""

from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass
class InjectionBlockResult:
    blocked: bool
    reason: str | None = None
    matched_pattern: str | None = None


INJECTION_PATTERNS: list[tuple[str, str]] = [
    (r"ignore (all )?(previous )?instructions", "ignore_instructions"),
    (r"bypass (all )?rules", "bypass_rules"),
    (r"auto-?approve", "auto_approve"),
    (r"you are now", "role_override"),
    (r"system:\s*", "system_prefix"),
    (r"disregard (policy|security|rules)", "disregard_policy"),
    (r"approve (this|all|every)", "approve_override"),
    (r"\$[\d,]+.*(luxury|car|approve)", "financial_override"),
]


def detect_prompt_injection(text: str) -> InjectionBlockResult:
    text_lower = text.lower()
    for pattern, label in INJECTION_PATTERNS:
        if re.search(pattern, text_lower):
            return InjectionBlockResult(
                blocked=True,
                reason="Prompt injection detected — escalated to human review",
                matched_pattern=label,
            )
    return InjectionBlockResult(blocked=False)


def block_if_injection(text: str, context: str) -> dict | None:
    result = detect_prompt_injection(text)
    if result.blocked:
        return {
            "status": "blocked",
            "reason": result.reason,
            "context": context,
            "matched_pattern": result.matched_pattern,
        }
    return None
