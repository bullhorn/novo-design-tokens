# Modern theme — open asks for UX Design

**Purpose:** what engineering needs from design to finish the modern (2026) theme.
**TL;DR:** the latest subatomic export landed the **transparency ramps** (✅ frosted surfaces now unblocked), but a few referenced tokens are **still missing**, plus there are **a few design decisions** outstanding. Details below, grouped so they're actionable.

**✅ Resolved by the latest export (377 tokens):** `color/transparency/white/*` + `black/*` ramps (10–90) — frosted card/header surfaces are now buildable. (Also added layout spacing: columns/gutter/margin.)

## A. Token groups referenced by components but still missing from the export
Referenced by the **components** file (button/card/input) but absent from the **subatomic** export. Please confirm they exist in Figma and include them:

| Missing token(s) | Used by | Unblocks |
|---|---|---|
| `color/brand/secondary/200`, `/400`, `/500` | input: selected bg (200), hover & focus border (400), selected border (500) | modern input focus/selected states |
| `color/border/disabled` | input disabled border | disabled input styling |
| a **button focus background** (`button/color/background/focus`) | button focus-ring references it but it's undefined | button focus rings |

## B. Restructured semantic layer still not in the export
The Tier-2 (semantic) screenshots show the layer was **restructured** — it now uses `color/gray-charcoal/*` (content/text), `color/brand/primary/*` + `color/brand` / `color/brand-hover` (interactive), and branded links — none of which are in the export yet (the latest dump added transparency but not these). Please include them.

## C. Design decisions (not just tokens)
1. **Primary / accent color.** What's the modern **primary/CTA** button treatment and the **accent** for links, the stepper, and status? This maps to `--color-positive`, used in **~125 places** in the app, so we're holding it to avoid a sweeping unintended change. Also: do the status colors (positive / negative / warning / success) **change in modern**, or stay? *(Note: the "Amplify" button is NOT the design-system primary — it's a separate custom app button with its own radial-gradient brand treatment that just gets a new form factor in the refresh. Don't conflate the two.)*
2. **Stepper appearance.** Today it's filled colored badges; the Figma record shows **neutral outline circles**. Confirm the intended modern stepper look (token swap vs small restyle).

## D. "Chips" / "badges" = status callouts (USAGE RESOLVED — colors still open)
The Figma chips/badges are **status callouts** (e.g. the header "Pre-Registered" pill), **not** the multi-picker input chips. **Usage confirmed by product:** they replace the **record-header candidate-status `novo-select`** styling — the status stays a working dropdown, but the **pill (chip) becomes the dropdown's content/trigger**; when the field is **read-only**, only the pill shows (no dropdown affordance). Shape tokens are fine (pill radius `round`, 1px border, small padding/gap), so the structure is buildable now.
- **Only open ask: fill/text colors are status-tied** → rides on the accent/status-color decision in C. Confirm the **per-status color mapping** (which token for each status: e.g. Pre-Registered / Active / Placed / Archived…), or whether it's a single neutral pill.

## The ask (deferred to design)
Transparency landed in the last export — thank you. Remaining: the **A/B tokens**
(`brand/secondary`, `border/disabled`, the `gray-charcoal` content ramp, `brand/primary`, and a
`button/color/background/focus`). Same question as before: **would a fresh export make sense, or
would you rather point us to them individually?** Plus the decisions in **C & D**.

---
*Deferred until the above lands: stepper, primary button, links, input focus/selected states, status badges. Everything else (button base, field typography, card, header border) is migrating now and doesn't depend on these.*
