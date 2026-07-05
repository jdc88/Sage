"""
ADK-style tool functions for Sage Clinical Agent.
Policy gates run here — the LLM proposes; tools decide.
"""

from __future__ import annotations

from security import block_if_injection, log_security_event, scrub_phi

# High-cost neurology imaging — never auto-approved without human review
HIGH_COST_CPT = {"70551", "70544", "70553"}


def verify_eligibility(patient_id: str, notes: str = "") -> dict:
    blocked = block_if_injection(notes, "eligibility_notes")
    if blocked:
        log_security_event("PROMPT_INJECTION_BLOCKED", f"eligibility check for {patient_id}", **blocked)
        return blocked

    safe_notes, redactions = scrub_phi(notes) if notes else ("", [])
    return {
        "status": "eligible",
        "patient_id": patient_id,
        "coverage": "ACTIVE",
        "deductible_remaining": "$500",
        "phi_redactions": len(redactions),
        "notes_scrubbed": bool(safe_notes),
    }


def submit_prior_auth(
    claim_id: str,
    cpt_code: str,
    clinical_notes: str,
) -> dict:
    blocked = block_if_injection(clinical_notes, "prior_auth_notes")
    if blocked:
        log_security_event("PROMPT_INJECTION_BLOCKED", f"prior auth {claim_id}", **blocked)
        return blocked

    safe_notes, redactions = scrub_phi(clinical_notes)

    if cpt_code in HIGH_COST_CPT:
        log_security_event(
            "POLICY_GATE",
            f"High-cost CPT {cpt_code} requires physician approval",
            claim_id=claim_id,
        )
        return {
            "status": "pending_human_review",
            "claim_id": claim_id,
            "cpt_code": cpt_code,
            "reason": "High-cost imaging requires physician approval — never auto-approved",
            "phi_redactions": len(redactions),
        }

    return {
        "status": "submitted",
        "claim_id": claim_id,
        "cpt_code": cpt_code,
        "reference_id": f"UHC-{claim_id[-3:]}92384",
        "phi_redactions": len(redactions),
        "clinical_notes_length": len(safe_notes),
    }


def generate_soap(transcript: str) -> dict:
    blocked = block_if_injection(transcript, "scribe_transcript")
    if blocked:
        log_security_event("PROMPT_INJECTION_BLOCKED", "soap generation", **blocked)
        return blocked

    safe_transcript, redactions = scrub_phi(transcript)
    return {
        "status": "draft_created",
        "version": 3,
        "phi_redactions": len(redactions),
        "transcript_preview": safe_transcript[:120] + ("…" if len(safe_transcript) > 120 else ""),
    }


def appeal_claim(claim_id: str, justification: str = "") -> dict:
    blocked = block_if_injection(justification, "appeal_justification")
    if blocked:
        log_security_event("PROMPT_INJECTION_BLOCKED", f"appeal {claim_id}", **blocked)
        return blocked

    safe_text, redactions = scrub_phi(justification) if justification else ("", [])
    return {
        "status": "appealed",
        "claim_id": claim_id,
        "reference_id": f"APP-{claim_id[-3:]}823",
        "phi_redactions": len(redactions),
    }
