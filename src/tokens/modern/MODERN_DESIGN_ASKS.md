# Modern theme — open asks for UX Design

**Purpose:** what engineering needs from design to finish the modern (2026) theme.
**TL;DR:** the token export we're building from is **partial/stale** vs the current Figma. We need **one fresh, complete export** of the subatomic + components files, plus **a few design decisions**. Details below, grouped so they're actionable.

## A. Token groups referenced by components but missing from our export
Referenced by the **components** file (button/card/input/header) but absent from the **subatomic** export we have. Please confirm they exist in Figma and are included in the re-export:

| Missing token(s) | Used by | Unblocks |
|---|---|---|
| `color/brand/secondary/200`, `/400`, `/500` | input: selected bg (200), hover & focus border (400), selected border (500) | modern input focus/selected states |
| `color/transparency/white/80`, `/90` | card header & body bg (80); record header bg (90) | frosted cards/header |
| `color/border/disabled` | input disabled border | disabled input styling |
| a **button focus background** (`button/color/background/focus`) | button focus-ring references it but it's undefined | button focus rings |

## B. Stale semantic layer → fresh export needed
The Tier-2 (semantic) screenshots show the layer was **restructured** since our export — it now uses `color/gray-charcoal/*` (content/text), `color/brand/primary/*` + `color/brand` / `color/brand-hover` (interactive), and branded links — none of which are in our export. A complete re-export captures all of this at once.

## C. Design decisions (not just tokens)
1. **Primary / accent color.** What's the modern **primary/CTA** treatment (e.g. the teal "Amplify" gradient) and the **accent** for links, the stepper, and status? This maps to `--color-positive`, used in **~125 places** in the app, so we're holding it to avoid a sweeping unintended change. Also: do the status colors (positive / negative / warning / success) **change in modern**, or stay?
2. **Stepper appearance.** Today it's filled colored badges; the Figma record shows **neutral outline circles**. Confirm the intended modern stepper look (token swap vs small restyle).

## D. "Chips" / "badges" = status callouts (clarified)
The Figma chips/badges are **status callouts** (e.g. the header "Pre-Registered" pill), **not** the multi-picker input chips. The shape tokens are fine (pill radius `round`, 1px border, small padding/gap), but:
1. **Fill/text colors are status-tied** → rides on the accent/status-color decision in C. Confirm: per-status colors (which tokens?) or a neutral pill?
2. **No component to map to yet** — novo-elements has no dedicated badge/status component (rendered ad-hoc at app level today), so this is partly a component question for us.

## The single ask
**One fresh, complete export** of the current Figma — **subatomic (all tiers/collections)** + **components** — ensuring A & B are included, plus answers to C & D.

---
*Deferred until the above lands: stepper, primary button, links, input focus/selected states, status badges. Everything else (button base, field typography, card, header border) is migrating now and doesn't depend on these.*
