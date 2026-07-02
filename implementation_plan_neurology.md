# Implementation Plan — Neurology Specialty Transition

**Application:** Sage Clinical Agent  
**Transition:** Cardiology → Neurology clinical persona  
**Date:** 2026-07-01

---

## 1. Physician Profile & Branding

### `src/components/Layout.jsx`

```diff
- <p className="...">Cardiology Specialist</p>
+ <p className="...">Neurology Specialist</p>
```

Application title **Sage Clinical Agent** unchanged.

---

## 2. CDS Stream Ticker — ECG → EEG

### `src/context/DashboardContext.jsx`

| Before | After |
|--------|-------|
| `ecgData` state | `eegData` state |
| QRS spike cardiac simulation | Multi-frequency alpha/beta brainwave simulation |
| Sharp ECG beat pattern | Smooth overlapping sine waves + low noise |

```diff
- // ECG live animation simulator (vitals stream ticker)
- setEcgData(...)
+ // EEG live animation simulator (neurology CDS stream ticker)
+ setEegData(...)
```

### `src/components/Layout.jsx`

| Before | After |
|--------|-------|
| `HeartPulse` icon (rose, bouncing) | `Brain` icon (teal) |
| `ecgData` polyline (strokeWidth 6) | `eegData` polyline (strokeWidth 4, wider) |
| `HR: 74 bpm` | `ICP: 11 mmHg · Alpha: Stable` |
| Footer: `Vitals Listener: ON` | `EEG Stream: ON` |

---

## 3. Operational Logs & Case Study Data

### `src/context/DashboardContext.jsx`

#### Ambient Scribe (`MOCK_SCRIBE_STREAM` + `INITIAL_SOAP_NOTE`)
- Cardiology hypertension/lisinopril dialogue → chronic migraine, topiramate, aura, neuropathy workup
- SOAP note references: ICD-10 G43.109, G62.9; CPT 70551, 95816, 95886; CGRP therapy pathway

#### Prior Auth Claims (`INITIAL_CLAIMS`)
| ID | Before | After |
|----|--------|-------|
| CLM-001 | Basic Metabolic Panel | Routine EEG (95816) |
| CLM-002 | Brain MRI (generic) | Brain MRI w/o Contrast (70551) |
| CLM-003 | Laparoscopic Cholecystectomy | EMG/NCS Upper Extremity (95886) |
| CLM-004 | Echocardiogram | CGRP Infusion Therapy (J0585) |
| CLM-005 | CT Abdomen & Pelvis | Brain MRA w/o Contrast (70544) |

#### Patient Intake Queue (`INITIAL_QUEUE`)
- Hypertension Follow-up → Chronic Migraine Follow-up
- Pre-op Surgical Check → Peripheral Neuropathy Assessment
- Post-op Knee Inspection → Neuromuscular Weakness Evaluation
- Added: Epilepsy Medication Review, New Onset Headache & Aura Workup

#### Portal Agent Logs (`AGENT_LOG_TEMPLATES`)
```diff
- "Identified: ICD-10 I10 (Essential Hypertension), CPT 80048..."
+ "Identified: ICD-10 G43.909 (Migraine), CPT 70551 (Brain MRI without contrast)..."
+ "Syncing ambulatory EEG data stream to payer clinical attachment bundle..."
+ "Submitting neurology prior auth for CGRP monoclonal antibody therapy..."
```

#### Live CDS Alerts (generator + initial state)
- BP Elevation / Heart Rate → ICP Trend, EEG Spike Activity, Seizure Risk Flag
- Dynamic alerts rotate EEG alpha suppression, ICP trends, seizure risk flags

---

## 4. RCM Billing Ledger

### `src/context/DashboardContext.jsx` — `rcmLedger`

| ID | Patient | Code | Scenario |
|----|---------|------|----------|
| RCM-101 | David Vance | 99214 | Chronic migraine established visit (denied) |
| RCM-102 | Eliza Ross | 64615 | Botox injection for chronic migraine (paid) |
| RCM-103 | Arthur Pendelton | 95816 | Routine EEG (draft) |
| RCM-104 | Sarah Jenkins | 70551 | Brain MRI w/o contrast (submitted) |
| RCM-105 | Michael Chang | 95886 | EMG/NCS neuropathy workup (submitted) |

---

## 5. Supporting View Updates

### `src/components/RcmCdsView.jsx`
- Vitals Feed → Neurology CDS feed
- `Vitals:` label → `Reading:`
- Footer: `Active Listeners` → `Active Monitors: EEG + ICP channels`

### `src/components/Overview.jsx`
- Quick launcher copy: "vital streams" → "neurology CDS stream"

### `src/components/ScribeView.jsx`
- Objective section label: "Neuro Exam & Diagnostics"
- Placeholder references EEG/ICP/imaging

---

## 6. Files Modified

| File | Changes |
|------|---------|
| `src/context/DashboardContext.jsx` | All mock clinical data, EEG ticker logic, neurology CDS alerts |
| `src/components/Layout.jsx` | Brain icon, EEG ticker UI, neurology profile, footer label |
| `src/components/RcmCdsView.jsx` | CDS feed labels |
| `src/components/Overview.jsx` | Quick launcher description |
| `src/components/ScribeView.jsx` | SOAP objective labels |
| `tasks.md` | Neurology pipeline enqueue |
| `implementation_plan_neurology.md` | This document |

---

## 7. Verification Checklist

- [ ] Header shows `Brain` icon + EEG wave (not ECG spikes)
- [ ] Metric reads `ICP: 11 mmHg · Alpha: Stable`
- [ ] Profile reads **Neurology Specialist**
- [ ] Prior auth claims list neurology CPT codes (70551, 95816, 95886, etc.)
- [ ] Portal agent logs reference EEG streams and neurology prior auth
- [ ] RCM ledger shows migraine, neuropathy, EEG, MRI scenarios
- [ ] CDS alerts show ICP/EEG/seizure risk (not heart rate)
- [ ] `npm run build` passes

**Await verification via `/artifact`**
