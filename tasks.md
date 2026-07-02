# Tasks Ledger: Sage Clinical Agent

## Completed Foundation

- [x] Tailwind CSS configuration and CSS environment setup
- [x] Implement Unified State Management (`DashboardContext.jsx`) & Mock streams
- [x] Create layout shell and theme components (`Layout.jsx`, `ThemeToggle.jsx`)
- [x] Module 2: Ambient Scribe View (Live-transcript + Markdown SOAP Editor)
- [x] Module 3: Prior Auth & Claims Manager (Pipeline grid + automation log terminal)
- [x] Module 4: Patient Scheduling Grid & Intake Queue (Eligibility status badges + custom clinical analytics)
- [x] Module 5: Proactive CDS Stream Monitor & RCM Ledger (CDS vital signs alerts + billing RCM ledger)
- [x] Final UI/UX Polish & Dev Server Verification

## v3 Refactor Pipeline — Sage & Earthy Neutral Overhaul

> **Status:** Implemented — awaiting verification via `/artifact`  
> **Plan:** See `implementation_plan_v3.md`

- [x] **Phase 1 — Color Token Overhaul** (`src/index.css`)
  - Replace dark slate/low-contrast tokens with Sage & Earthy Neutral palette
  - Linen background `#F3EFE0`, clay accent `#D7C49E`, sage primary `#7A9A86`
  - Override blue/amber/rose to earthy variants for palette consistency

- [x] **Phase 2 — Contrast Optimization (WCAG 2.1 AA)**
  - Primary text `#3E2F1C` on linen backgrounds
  - Body/status text minimum 4.5:1 contrast
  - Remove heavy glass overlays (`backdrop-blur` + `/40`–`/70` opacity)
  - Replace with solid `.surface-card` and subtle borders

- [x] **Phase 3 — Global Rebrand to "Sage Clinical Agent"**
  - `index.html` title + meta description
  - Header (`Layout.jsx`), Overview hero copy
  - Terminal label: `SAGE_CLI_ENGINE:~` (was `AGY_CLI_ENGINE`)
  - Sage leaf favicon (`public/favicon.svg`)

- [x] **Phase 4 — Organic Status Iconography**
  - `PriorAuthView`: Approved → `Leaf`, In Review → `Sprout`
  - `SchedulingView`: Eligible → `Leaf`, Pending → `Sprout`
  - `RcmCdsView`: Paid → `Leaf`, Submitted/Appealed → `Sprout`
  - Shared `.sage-badge` utility class

- [ ] **Phase 5 — Build & Visual Verification** *(pending `/artifact`)*
  - Run `npm run build` and confirm zero errors
  - Spot-check all five module views in light + dark mode
  - Validate WCAG contrast on headers, badges, and body text
  - Confirm favicon and page title in browser

## Neurology Specialty Transition Pipeline

> **Status:** Implemented — awaiting verification via `/artifact`  
> **Plan:** See `implementation_plan_neurology.md`

- [x] **Phase 1 — Physician Profile & Branding**
  - `Layout.jsx`: Cardiology Specialist → Neurology Specialist
  - Application name remains **Sage Clinical Agent**

- [x] **Phase 2 — CDS Stream Ticker Overhaul (ECG → EEG)**
  - `DashboardContext.jsx`: `ecgData` → `eegData` with multi-frequency brainwave simulation
  - `Layout.jsx`: `HeartPulse` → `Brain` icon; metric `ICP: 11 mmHg · Alpha: Stable`
  - Footer label: `EEG Stream: ON`

- [x] **Phase 3 — Operational Logs & Case Study Text**
  - Scribe transcript + SOAP note: migraine, neuropathy, topiramate, CGRP pathway
  - Portal agent logs: CPT 70551, EEG stream sync, neurology prior auth
  - Prior auth claims + intake queue: neurology outpatient scenarios

- [x] **Phase 4 — RCM & Billing Transition**
  - Ledger updated: 99214, 64615, 95816, 70551, 95886 neurology codes
  - CDS alerts: ICP trend, EEG spike activity, seizure risk flags

- [ ] **Phase 5 — Build & Neurology Visual Verification** *(pending `/artifact`)*
  - Confirm EEG wave animation in header CDS stream
  - Validate neurology CPT/ICD references across Prior Auth, RCM, and CDS views
  - Run `npm run build` and spot-check all modules
