# Website Alignment Punch List

**Created**: June 11, 2026, from the True North recrystallization.
**Authority**: `planning/TRUE-NORTH.md` (strategy) · `compendium/foundations/lexicon.md` (vocabulary).
**Register**: the whole site is **seeker register** — flow front-stage, framework visible. The landing page stays as-is in tone (non-salesy, curiosity-driving — explicitly ratified).

Work through these in a dedicated session; each item is copy/naming only unless marked. Ship via `/commit` (submodule first).

---

## 1. One name for the diagnostic: "Flow Profile" — ✅ DONE (June 12, 2026)

- [x] `/profile/intake` metadata — "consciousness diagnostic" retired; title "Your Flow Profile — FourFlowOS"
- [x] `IntakePageContent.tsx` — "maps your consciousness" → "builds your Flow Profile"
- [x] `src/data/apps.ts` — "consciousness alignment map" → "Your Flow Profile across the 12 Flow Keys"
- [x] `/me` page — "baseline diagnostic" → "Your Flow Profile"; "Your Signal" h1 → "Your Practice"
- [x] `CHART_ARCHETYPAL_PROMPT` — "consciousness alignment diagnostic" → conditions diagnostic

Rule from lexicon: "consciousness alignment" is accurate *internal* language (architecture docs); it never appears in client-facing copy.

## 2. Flow Lens → Flow Unlock — ✅ labels DONE; code ids deferred

- [x] All user-visible "Flow Lens" renamed to "Flow Unlock" (admin dashboard labels)
- [x] "Ancestral Signal" → **"Timeless Map"** everywhere user-visible (the admin already used this name; now unified): ArchetypeRevealSection, EsotericCard, lab FieldView/sections-data/ActivityArea, esoteric prompt
- [ ] Code identifiers (`flow-lens` route/ids, `FlowLens*` types, `flow_lens_*` DB tables, `ancestral-signal` id) — legacy identifiers, migrate opportunistically per lexicon

## 3. Retired signal metaphor — ✅ DONE (June 12, 2026)

- [x] **Flow Unlock VOICE_RULES** (`flow-unlock-config.ts`): output voice flipped from "signal language is native — use it" to plain body-grounded language ("your state runs hot", not "you receive signal fast")
- [x] `the_tell` / `tool_prescription` schema descriptions — signal language removed
- [x] UI strings: "Map Your Signal" (footer, nav, framework, together, how-it-works) → "Get your Flow Profile" / "Find your bottleneck" · "Reading your signal…" → "Reading your pattern…" · "building your signal" → "building your picture"
- [x] "Signal Grid" → "Compendium Grid" (apps.ts)
- Kept deliberately: "Flow Is the Signal" landing section (flow-as-compass = plain English, core thesis, landing page ratified as-is); "Signal Session" (parked); internal prompt analysis shorthand ("self signal" classifications — never client-visible)
- [ ] Legacy facilitated-profile prompts in Supabase `prompt_templates` table — not in this repo; review in the admin prompt inspector for signal-chain language and Your State/Setup/Arc/Why subheads

## 4. README.md (this repo) — ✅ DONE

- [x] "Flow Keys #1–12" numbering dropped; lexicon pointer added; "pillars" → dimensions in copy strings (apps.ts, support, terms, app detail pages)

## 5. Timeline section (when next touched — content, not urgent)

`TimelessAnchorSectionV2.tsx` ends at "Now — The Present." Per True North (humility decision): we do **not** add a card claiming FourFlow as the next evolution. If the section is ever extended, the framing is: the lineage converged — the state is real, the conditions are knowable; FourFlowOS offers a working map and practice, held provisionally.

## 6. Tools framed as supplements (Equip layer) — ✅ DONE (June 12, 2026)

- [x] `src/data/apps.ts`: every web tool description ends with the Key it trains (FlowBreath → Tuned Emotions, FlowSpark → Ignited Curiosity, FlowZone → Focused Body + Intentional Space, FlowRead → Open Mind, FlowRep → Focused Body)
- [x] `/apps` page intro: prescriptions framing ("your Flow Profile shows which Key is blocked, and the matching tool opens it")
- [x] Stale card counts unified to 153 (apps.ts, ActivityArea, ArchetypeRevealSection — old: 191/261)

## 7. Design language ratified — ✅ June 12, 2026

The live site's evolved design language is now canon (BRAND_BIBLE.md updated to match):
- **Palette**: deepened set — Coral #E84535, Sage #4E8C73, Steel #3E6FA3, Amethyst #6330A0 (original brighter values retired)
- **Typography**: Cormorant Garamond (display) + DM Sans (body) — supersedes Inter-only spec
- **Tokens**: `src/styles/tokens.ts` is the umbrella source (colors via `brand-colors.ts`, type scale, motion durations, easings, glow helpers); `tailwind.config.ts` imports from it. New code uses token classes (`text-self`, `duration-gentle`), not arbitrary hex.

## 8. Code-level legacy identifiers (explicitly OK to leave)

`Pillar` types, `pillar` DB columns, `mechanics` Supabase table, `card_type` values — legacy identifiers, fine in code per lexicon. Do not mass-rename; migrate opportunistically.
