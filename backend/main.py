"""
Sage Clinical Agent — FastAPI backend for Google ADK integration.

Run locally:
  cd backend
  pip install -r requirements.txt
  uvicorn main:app --reload --port 8080

Set GEMINI_API_KEY in .env only when enabling live ADK (optional).
"""

from __future__ import annotations

import logging
import os
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from agents.orchestrator.agent import ADK_AVAILABLE, AGENT_REGISTRY
from security import detect_prompt_injection, scrub_phi
from services.command_runner import run_command

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="Sage Clinical Agent API",
    description="ADK orchestration API with PHI scrubbing and prompt-injection guards",
    version="1.0.0",
)

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in cors_origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RunRequest(BaseModel):
    command: str
    payload: dict[str, Any] | None = None


class TextRequest(BaseModel):
    text: str = Field(..., min_length=1)


class PriorAuthRequest(BaseModel):
    claim_id: str = "CLM-002"
    cpt_code: str = "70551"
    clinical_notes: str = ""


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "service": "sage-clinical-agent-api",
        "adk_available": ADK_AVAILABLE,
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY")),
        "agents_registered": len(AGENT_REGISTRY),
    }


@app.post("/run")
def run_cli(req: RunRequest) -> dict[str, Any]:
    """Agents CLI command runner with server-side security guards."""
    return run_command(req.command, req.payload)


@app.post("/security/scrub")
def security_scrub(req: TextRequest) -> dict[str, Any]:
    """Demonstrate PHI/PII scrubbing before LLM or log writes."""
    scrubbed, redactions = scrub_phi(req.text)
    return {
        "original_length": len(req.text),
        "scrubbed": scrubbed,
        "redaction_count": len(redactions),
        "redactions": [
            {"matched": r.matched, "replacement": r.replacement, "pattern": r.pattern}
            for r in redactions
        ],
    }


@app.post("/security/injection-check")
def security_injection_check(req: TextRequest) -> dict[str, Any]:
    """Detect adversarial prompt-injection patterns in untrusted input."""
    result = detect_prompt_injection(req.text)
    return {
        "blocked": result.blocked,
        "reason": result.reason,
        "matched_pattern": result.matched_pattern,
    }


@app.post("/prior-auth/submit")
def prior_auth_submit(req: PriorAuthRequest) -> dict[str, Any]:
    """Prior auth workflow with injection + PHI guards and policy gates."""
    return run_command(
        "/prior-auth/submit",
        {
            "claim_id": req.claim_id,
            "cpt_code": req.cpt_code,
            "clinical_notes": req.clinical_notes,
        },
    )
