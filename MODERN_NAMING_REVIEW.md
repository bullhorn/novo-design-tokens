# Modern Theme — Token & Naming Alignment Review

**For:** Product + UX Design (contractor) **·** **From:** Engineering **·** **Status:** Work in progress

## Summary

We compared the modern design's tokens (from the Figma "subatomic" + components exports)
against Novo's existing design tokens and the variables our components already consume. **The
alignment is strong** — the modern system is well-structured and maps cleanly onto how Novo is
built, so it can be delivered as a runtime-switchable theme without re-architecting the
component library. A handful of naming/scale differences exist; most are already reconciled in
code with **no design change required**. What we need from design/product is a short list of
confirmations and a few missing tokens (below).

### Alignment scorecard

| Area | Alignment | Notes |
|------|-----------|-------|
| Color — primitives | 🟢 Strong | Many names reused with identical values |
| Color — semantic roles | 🟢 Strong | background / content / border concepts line up |
| Component coverage | 🟢 Strong | Modern defines tokens for real Novo components |
| Typography | 🟢 Strong (richer) | Inter; more complete per-role type tokens |
| Spacing scale | 🟡 Reconciled | Same names, different sizes — handled in code |
| Units (px ↔ rem) | 🟡 Reconciled | Figma px → rem in code; no design change |
| Source-of-truth process | 🔴 Needs a decision | Exports vs. in-progress Figma are drifting |

---

## How the two systems are organized

| | Novo today | Modern (Figma) |
|--|------------|----------------|
| Structure | Named primitives → semantic variables used by components | **4 tiers:** core (raw) → named → semantic → **component** tokens |
| Strengths | Established, in production | More structured; explicit semantic + per-component tokens |

**Takeaway:** the modern system is a more disciplined version of what Novo already does. The
extra structure (especially the semantic and component tiers) is an asset — it tells engineering
exactly how each component should look, rather than leaving it to interpretation.

---

## What aligns well (no action needed)

- **Semantic concepts match.** Modern's `background / content / border` roles map directly onto
  Novo's existing background / text / border variables.
- **Primitives overlap.** Many modern color names are identical to Novo's (e.g. charcoal, sand,
  the entity colors, and status colors success/warning/error) — same names *and* same values.
- **Components line up.** Modern provides tokens for the actual Novo components — button, card,
  input, tabs, badge, header, navigation — including states (hover/disabled/focus) and focus rings.
- **Typography is a superset.** Modern uses **Inter** and defines richer, per-role type tokens
  (title, body, button, input, etc.) that cover and extend Novo's current type scale.

---

## Differences we reconciled in code (FYI — no design change required)

- **Units:** Figma authors in **px** (it has no concept of rem); Novo uses **rem**. We convert
  automatically at ingestion, preserving the on-screen sizes you designed. **Designers can keep
  working in px.**
- **Spacing names:** both systems use t-shirt sizes (sm/md/lg…), but they map to different pixel
  values. We handle the translation; no renaming needed on the design side.
- **Typeface:** modern switches the font to Inter — applied through the theme, not per-component.

---

## Open items — what we need from Design / Product

1. **One source of truth for tokens.** The Figma file is evolving faster than the exports we
   receive, so screenshots and exports have started to disagree (e.g. an in-progress version
   shows *branded* links and a restructured semantic layer that the latest export doesn't have).
   **Ask:** when the design stabilizes, provide a single clean full export; we treat that export
   as authoritative and avoid building from screenshots.

2. **Define ~4 missing tokens.** The component tokens reference a few values not present in the
   latest export:
   - `color/brand/secondary/*` — the input focus / selected accent (and likely the interactive
     accent overall)
   - `color/transparency/white-*` — the translucent card/header backgrounds
   - `color/border/disabled`
   - `button` focus background (appears undefined)

3. **Confirm two color decisions:**
   - **Links:** currently **charcoal** (per the latest export), *not* branded. Newer in-progress
     Figma shows branded links — please confirm the intended direction.
   - **Primary "positive"/accent color:** used very widely in the product; we're holding its hue
     until design confirms, to avoid an unintended sweeping change.

4. **Naming consistency going forward.** Keeping the tiered token names stable between Figma and
   the exports lets engineering map them 1:1. Two things to be aware of: a couple of names exist
   in both systems with *different* values (spacing sizes), and Figma's px values are design
   *intent* we translate to rem — neither requires action, just shared awareness.

---

## What this means for delivery (high level)

- The modern look ships as a **runtime theme** reusing the existing classic↔modern switch — users
  toggle it; no separate build.
- The bulk of remaining work is **mapping tokens** (largely done) plus **incrementally updating
  components** to consume the theme. Naming alignment introduced **no rework** — the structure
  holds.
- The component-tier tokens give us a precise per-component spec, which de-risks and speeds up
  that component work.

*Questions or corrections welcome — this reflects engineering's current understanding and the
latest export we have.*
