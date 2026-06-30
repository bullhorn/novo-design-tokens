# Modern theme — open asks for UX Design

**Purpose:** what engineering needs from design to finish the modern (2026) theme.
**TL;DR:** the token export we're building from looks **partial/stale** vs the current Figma — several referenced tokens are missing, though a few appear to already exist in Figma. We're flagging what's missing and **leaving it to design** whether a fresh complete export or pointing us to items individually makes more sense, plus **a few design decisions**. Details below, grouped so they're actionable.

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
1. **Primary / accent color.** What's the modern **primary/CTA** button treatment and the **accent** for links, the stepper, and status? This maps to `--color-positive`, used in **~125 places** in the app, so we're holding it to avoid a sweeping unintended change. Also: do the status colors (positive / negative / warning / success) **change in modern**, or stay? *(Note: the "Amplify" button is NOT the design-system primary — it's a separate custom app button with its own radial-gradient brand treatment that just gets a new form factor in the refresh. Don't conflate the two.)*
2. **Stepper appearance.** Today it's filled colored badges; the Figma record shows **neutral outline circles**. Confirm the intended modern stepper look (token swap vs small restyle).

## D. "Chips" / "badges" = status callouts (USAGE RESOLVED — colors still open)
The Figma chips/badges are **status callouts** (e.g. the header "Pre-Registered" pill), **not** the multi-picker input chips. **Usage confirmed by product:** they replace the **record-header candidate-status `novo-select`** styling — the status stays a working dropdown, but the **pill (chip) becomes the dropdown's content/trigger**; when the field is **read-only**, only the pill shows (no dropdown affordance). Shape tokens are fine (pill radius `round`, 1px border, small padding/gap), so the structure is buildable now.
- **Only open ask: fill/text colors are status-tied** → rides on the accent/status-color decision in C. Confirm the **per-status color mapping** (which token for each status: e.g. Pre-Registered / Active / Placed / Archived…), or whether it's a single neutral pill.

## The ask (deferred to design)
Several of the items in A/B appear to **already exist in Figma** but aren't in the export we
have — so this may just be export completeness. We're flagging what's missing and leaving the
call to design: **would a fresh complete export make sense, or would you rather point us to the
items individually?** Plus the genuine gaps (`brand/secondary` existence, the button focus
background) and the decisions in C & D.

---
*Deferred until the above lands: stepper, primary button, links, input focus/selected states, status badges. Everything else (button base, field typography, card, header border) is migrating now and doesn't depend on these.*
