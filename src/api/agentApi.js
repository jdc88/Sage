/**
 * Optional backend API client for Sage Clinical Agent.
 * Set VITE_AGENT_API_URL in .env.local (e.g. http://localhost:8080 or Cloud Run URL).
 */

const API_URL = import.meta.env.VITE_AGENT_API_URL?.replace(/\/$/, '');

export const isBackendConfigured = () => Boolean(API_URL);

export async function fetchHealth() {
  if (!API_URL) return null;
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

export async function runAgentCommandRemote(command, payload = {}) {
  if (!API_URL) return null;
  const res = await fetch(`${API_URL}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command, payload }),
  });
  if (!res.ok) throw new Error(`Agent API error: ${res.status}`);
  return res.json();
}

export async function scrubPhiRemote(text) {
  if (!API_URL) return null;
  const res = await fetch(`${API_URL}/security/scrub`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Scrub API error: ${res.status}`);
  return res.json();
}

export async function checkInjectionRemote(text) {
  if (!API_URL) return null;
  const res = await fetch(`${API_URL}/security/injection-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Injection check error: ${res.status}`);
  return res.json();
}
