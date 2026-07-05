"""PHI/PII scrubbing before text reaches an LLM or application logs."""

from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass
class RedactionEvent:
    pattern: str
    replacement: str
    matched: str


# Mirrors Sage frontend PHI_TOKENS concept — extend for production.
PHI_PATTERNS: list[tuple[str, str]] = [
    (r"\b\d{3}-\d{2}-\d{4}\b", "[SSN_REDACTED]"),
    (r"\b\d{1,2}/\d{1,2}/\d{4}\b", "[DOB_REDACTED]"),
    (r"\bDOB:\s*\d{4}-\d{2}-\d{2}\b", "[PHI_DATE]"),
    (r"\b\d{10,11}\b", "[MRN_REDACTED]"),
]

KNOWN_NAMES: dict[str, str] = {
    "Arthur Pendelton": "[PATIENT_NAME]",
    "Sarah Jenkins": "[PATIENT_NAME]",
    "Michael Chang": "[PATIENT_NAME]",
    "Diana Prince": "[PATIENT_NAME]",
    "Robert Bruce": "[PATIENT_NAME]",
    "David Vance": "[PATIENT_NAME]",
    "Eliza Ross": "[PATIENT_NAME]",
}


def scrub_phi(text: str) -> tuple[str, list[RedactionEvent]]:
    """Regex + known-name scrubber. Use Cloud DLP in production (see scrub_with_dlp)."""
    redactions: list[RedactionEvent] = []
    scrubbed = text

    for pattern, replacement in PHI_PATTERNS:
        for match in re.finditer(pattern, scrubbed):
            redactions.append(
                RedactionEvent(pattern=pattern, replacement=replacement, matched=match.group(0))
            )
        scrubbed = re.sub(pattern, replacement, scrubbed)

    for name, replacement in KNOWN_NAMES.items():
        if name in scrubbed:
            redactions.append(
                RedactionEvent(pattern="known_name", replacement=replacement, matched=name)
            )
            scrubbed = scrubbed.replace(name, replacement)

    return scrubbed, redactions


def scrub_with_dlp(text: str, project_id: str) -> str:
    """
    Optional Google Cloud DLP de-identification.
    Requires: pip install google-cloud-dlp and GCP credentials.
    """
    from google.cloud import dlp_v2

    client = dlp_v2.DlpServiceClient()
    response = client.deidentify_content(
        request={
            "parent": f"projects/{project_id}/locations/global",
            "deidentify_config": {
                "info_type_transformations": {
                    "transformations": [
                        {
                            "info_types": [
                                {"name": "US_SOCIAL_SECURITY_NUMBER"},
                                {"name": "DATE_OF_BIRTH"},
                                {"name": "PERSON_NAME"},
                            ],
                            "primitive_transformation": {
                                "replace_with_info_type_config": {}
                            },
                        }
                    ]
                }
            },
            "item": {"value": text},
        }
    )
    return response.item.value
