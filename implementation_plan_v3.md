# Implementation Plan v3 — Sage Clinical Agent Color Scheme Overhaul

**Design System:** Sage & Earthy Neutral  
**Target:** WCAG 2.1 AA legibility, reduced glass overlays, organic status iconography  
**Date:** 2026-07-01

---

## 1. Color Token Changes (`src/index.css`)

| Token | Before | After | Rationale |
|-------|--------|-------|-----------|
| `--color-slate-50` | `#fcfbfa` | `#f3efe0` (soft linen) | Warm dashboard background |
| `--color-slate-200` | `#e4e2dc` | `#d7c49e` (warm clay) | Earthy accent surfaces |
| `--color-slate-700` | `#4e4c43` | `#3e2f1c` (deep earthy brown) | Primary headers / case names |
| `--color-teal-500` | `#7a9a86` | `#7a9a86` (unchanged) | Matte sage primary accent |
| `--color-blue-*` | Tailwind defaults | Muted sage-slate (`#5c7358`) | In Review / info states |
| `--color-amber-*` | Tailwind defaults | Earthy ochre (`#a88642`) | Pending / warning |
| `--color-rose-*` | Tailwind defaults | Earthy terracotta (`#a85a48`) | Danger / recording |
| `--color-sage-earth` | — | `#3e2f1c` | Named primary text token |
| `--color-sage-linen` | — | `#f3efe0` | Named background token |
| `--color-sage-clay` | — | `#d7c49e` | Named warm accent token |

### Overlay / Surface Diff

```diff
- .glass-panel { backdrop-blur-md bg-white/70 ... }
+ .glass-panel { bg-slate-50 border border-slate-300/70 ... }  /* no blur */

- .glass-panel-heavy { backdrop-blur-lg bg-white/90 ... }
+ .glass-panel-heavy { bg-slate-50 border border-slate-300/80 ... }

+ .surface-card { bg-white border border-slate-250/60 ... }  /* solid claim cards */
+ .sage-badge { inline-flex items-center gap-1.5 rounded-full ... }
```

### Base Typography Diff

```diff
- body { @apply bg-slate-50 text-slate-900 ... }
+ body { @apply bg-slate-50 text-slate-700 ... }
+ h1–h6 { @apply text-slate-700; }
```

---

## 2. Branding Diffs

### `index.html`
```diff
+ <meta name="description" content="Sage Clinical Agent — Autonomous Healthcare Scribe & Automation Engine" />
  <title>Sage Clinical Agent</title>
```

### `public/favicon.svg`
```diff
- Purple lightning bolt (#863bff)
+ Sage green leaf on matte sage (#7A9A86) background
```

### `src/components/PriorAuthView.jsx`
```diff
- AGY_CLI_ENGINE:~
+ SAGE_CLI_ENGINE:~
```

### `src/components/Overview.jsx`
```diff
- Dashboard Quick Launchers
+ Sage Clinical Agent — Quick Launchers
```

---

## 3. Component Diffs by File

### `src/components/Layout.jsx`
- Root text: `text-slate-900` → `text-slate-700`
- Header title: `text-slate-700` (earthy charcoal)
- ECG ticker: removed `opacity-80` on SVG; solid `bg-slate-150` (no `/40` overlay)
- Main content: `bg-slate-100/40` → `bg-slate-100` (solid)
- Footer labels: `text-slate-400` → `text-slate-600`
- Sidebar status panel: `bg-slate-100/40` → `bg-slate-150`

### `src/components/PriorAuthView.jsx`
- Status badges: translucent `/10` backgrounds → solid `bg-emerald-100`, `bg-teal-100`, etc.
- **Approved** icon: `CheckCircle2` → `Leaf` (filled sage green)
- **In Review** icon: spinning `Loader2` → `Sprout` (moss)
- Claim cards: `bg-white/40` → `.surface-card` (solid white + border)
- Body/meta text: `text-slate-400` → `text-slate-600`
- Terminal title bar: `bg-slate-900/60` → `bg-slate-900` (solid)

### `src/components/SchedulingView.jsx`
- **Eligible**: `CheckCircle2` → `Leaf` icon
- **Pending**: `Clock` → `Sprout` icon (moss)
- Table header: `bg-slate-100/50` → `bg-slate-150`
- KPI labels: `text-slate-400` → `text-slate-600`
- Chart bars: `bg-rose-500/40` → `bg-rose-400/70` (higher contrast)

### `src/components/RcmCdsView.jsx`
- CDS alerts: removed `opacity-80`, `opacity-90`, `opacity-75` on text nodes
- Alert surfaces: `/10` tints → solid `bg-rose-100`, `bg-amber-100`, `bg-teal-100`
- **Paid** badge: added `Leaf` icon
- **Submitted / Appealed**: added `Sprout` icon
- Table headers and audit text: `text-slate-400` → `text-slate-600`

### `src/components/Overview.jsx`
- All KPI headings: `text-slate-800` → `text-slate-700`
- Quick launcher cards: removed `/30` hover overlays; solid `hover:bg-slate-150`
- Agent stream log rows: `bg-slate-900/40` → `bg-slate-900`; removed `/90` text opacity

### `src/components/ScribeView.jsx`
- Transcript bubbles: `bg-slate-100/50` → `bg-white` / `bg-teal-50`
- SOAP textareas: `bg-slate-100/50` → `bg-white` with `text-slate-700`
- LISTENING badge: `bg-rose-500/10` → `bg-rose-100 text-rose-700`
- Labels: `text-slate-400` → `text-slate-600`

---

## 4. WCAG Contrast Targets

| Element | Foreground | Background | Est. Ratio |
|---------|-----------|------------|------------|
| Primary headers | `#3e2f1c` | `#f3efe0` | ~10.5:1 ✓ AAA |
| Body text | `#4a4338` (slate-600) | `#f3efe0` | ~7.2:1 ✓ AA |
| Status badge text | `#4f693e` (emerald-600) | `#eaf0e6` (emerald-100) | ~5.8:1 ✓ AA |
| Muted labels | `#5c5345` (slate-500) | `#f3efe0` | ~5.5:1 ✓ AA |

---

## 5. Files Modified (Summary)

| File | Change Type |
|------|-------------|
| `src/index.css` | Theme tokens, panel surfaces, badge utility |
| `index.html` | Meta description |
| `public/favicon.svg` | Sage leaf icon |
| `src/components/Layout.jsx` | Contrast + overlay removal |
| `src/components/PriorAuthView.jsx` | Leaf/Sprout badges, SAGE_CLI_ENGINE |
| `src/components/SchedulingView.jsx` | Leaf/Sprout eligibility badges |
| `src/components/RcmCdsView.jsx` | Leaf/Sprout RCM badges, opacity fixes |
| `src/components/Overview.jsx` | Branding + contrast |
| `src/components/ScribeView.jsx` | Solid surfaces, contrast |
| `tasks.md` | Pipeline enqueue (see below) |

---

## 6. Verification Checklist

- [ ] `npm run build` completes without errors
- [ ] Light mode: all body text readable on linen background
- [ ] Dark mode: headings and badges remain legible
- [ ] Prior Auth: Approved shows green leaf; In Review shows moss sprout
- [ ] Scheduling: Eligible shows leaf; Pending shows sprout
- [ ] No translucent glass blur obscuring card text
- [ ] Browser tab shows sage leaf favicon
- [ ] Page title reads "Sage Clinical Agent"

**Await verification via `/artifact`**
