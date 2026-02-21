# Flow Profile Generation System

Complete system for managing and generating Flow Profiles with flexible prompts, full chart context, and generation history.

## Overview

**Active capabilities:**
- ✅ Manual CLI generation (no timeout, full chart context, prompt selection by name)
- ✅ Admin UI generation (prompt picker, same quality pipeline as CLI)
- ✅ Prompt template database (5 flavors, editable in admin UI)
- ✅ Generation history per assessment (every run saved, selectable as active draft)
- ✅ Assessment ID display in admin for CLI workflows

**Deferred (Phase 2 & 3):**
- ⏸ Background async queue processing (Inngest or Vercel background functions)
- ⏸ Self-serve lite tier (automated fast profiles)

---

## Two Generation Paths

Both paths write to the same `profile_generations` table and update `flow_profile_draft`. They produce equivalent quality output.

### Path 1 — CLI (Terminal)

```bash
cd website/fourflowos-web
npm run profile:generate <assessment-id>
npm run profile:generate <assessment-id> "Flow Archetype"
```

- No timeout constraints (takes 2-3 minutes, no problem)
- Prompt selected by name as CLI arg
- Full chart JSON → Haiku archetypal summary → Sonnet profile

**When to use**: Batch runs, testing, large profiles, anything you want logged in the terminal.

### Path 2 — Admin UI Button

Navigate to: `/profile/admin/[id]` → prompt picker → Generate

- Subject to Vercel 60s limit (heartbeat workaround keeps connection alive)
- Prompt selected via dropdown in the UI
- Same 2-phase pipeline: full chart → Haiku summary → Sonnet profile
- Generation appears in history immediately

**When to use**: Quick one-off generation when you're already in the admin panel.

### Getting the Assessment ID

The assessment UUID is displayed prominently at the top of every detail page (`/profile/admin/[id]`) with a copy button. Copy it to run the CLI command:

```bash
npm run profile:generate <paste-id-here>
npm run profile:generate <paste-id-here> "Flow Archetype"
```

---

## Generation History

Every generation run — from the CLI or the UI button — is saved to `profile_generations`. In the admin detail page:

- **Generation History** section shows all past generations for that assessment
- Each entry shows: prompt name, model, timestamp, first 150 chars of content
- **"Use as draft"** promotes any generation to the active draft (ready to deliver)
- **"Delivered"** badge appears on whichever generation matches the delivered final

This means you can:
- Run 3 different prompt flavors on the same submission and pick the best
- Regenerate after delivery without losing the original delivered profile
- Keep an audit trail of every generation

---

## Regeneration After Delivery

If a profile is already `delivered` and you generate a new one:
- `flow_profile_final` (the delivered content) — **preserved**
- `flow_profile_draft` — **updated** with new generation
- `status` — **stays `delivered`** (no regression)
- New generation appears in Generation History
- A "New Draft" panel appears below the delivered profile showing the new version
- You can optionally re-deliver the new draft

---

## Setup Instructions

### 1. Run Database Migrations

In your Supabase SQL editor, run in order:

```sql
-- Step 1: Prompt templates table + Classic Flow Mirror seed
scripts/setup-prompt-templates.sql

-- Step 2: 4 additional prompt variations
scripts/seed-prompt-variations.sql

-- Step 3: Generation history table
scripts/setup-profile-generations.sql
```

### 2. Environment Variables

```bash
ANTHROPIC_API_KEY=sk-ant-...           # Anthropic API key
SUPABASE_URL=https://...               # Supabase project URL
SUPABASE_SERVICE_KEY=...               # Supabase service role key
CHART_SERVICE_URL=http://...           # Natal chart service (optional)
PROFILE_ADMIN_KEY=...                  # Admin authentication key
RESEND_API_KEY=re_...                  # Email delivery
RESEND_FROM_EMAIL=FourFlow <flow@keys.fourflowos.com>
```

---

## The 5 Prompt Flavors

### 1. Classic Flow Mirror (Default)
- **Purpose**: Balanced profile, "you read it and feel deeply seen"
- **Length**: 800-900 words | **Model**: Sonnet 4.5 | **Price**: $100-150

### 2. Flow Archetype
- **Purpose**: "How you're wired to work" — archetypal lens, heavy astro integration
- **Length**: 900-1000 words | **Model**: Sonnet 4.5 | **Price**: $150-200

### 3. Flow Unlock
- **Purpose**: "The one thing blocking your next level" — diagnostic, cascade analysis
- **Length**: 700-800 words | **Model**: Sonnet 4.5 | **Price**: $100-150

### 4. Flow Foundations
- **Purpose**: Lite version, fast and cheap
- **Length**: 400-500 words | **Model**: Haiku 4.5 | **Price**: $50 or free

### 5. Flow Navigator
- **Purpose**: Comprehensive deep-dive, all 12 keys detailed
- **Length**: 1200-1500 words | **Model**: Sonnet 4.5 or Opus 4.6 | **Price**: $300-500

---

## How the Pipeline Works

Both the CLI and UI button follow the same 2-phase process:

```
1. Fetch assessment from Supabase
2. Fetch natal chart data (or use cached)
3. Haiku generates 250-word archetypal summary from full chart JSON
4. Format intake data as structured text
5. Selected prompt template → replace {INTAKE_DATA} + {CHART_DATA}
6. Sonnet (or template model) generates full profile
7. Save to profile_generations table
8. Update flow_profile_draft + prompt_template_id on assessment
9. Status → synthesis (or unchanged if already delivered)
```

**Cost per profile**: ~$0.002 (Haiku summary) + ~$0.03 (Sonnet profile) = **~$0.032**
**Generation time**: 60-120 seconds

---

## Admin UI

### Assessment Detail (`/profile/admin/[id]`)

- **ID display**: Assessment UUID at top with copy button — for `npm run profile:generate <id>`
- **Prompt picker**: Select which prompt flavor to use before generating
- **Generate button**: Runs same pipeline as CLI, streams status updates
- **Generation History**: All past generations, "Use as draft" to promote any one
- **Draft review**: Edit before delivering
- **Deliver panel**: Optional custom note, sends email to client

### Prompt Manager (`/profile/admin/prompts`)

- Full CRUD for prompt templates
- Create new prompts with `{INTAKE_DATA}` and `{CHART_DATA}` placeholders
- Set model (Haiku/Sonnet/Opus) and max_tokens per template
- Can't delete a prompt if assessments are using it — set inactive instead

---

## Costs & Performance

| Prompt | Model | Approx Cost | Time |
|--------|-------|-------------|------|
| Flow Foundations | Haiku | ~$0.007 | 30-60s |
| Flow Unlock | Sonnet | ~$0.022 | 60-90s |
| Classic Flow Mirror | Sonnet | ~$0.032 | 60-90s |
| Flow Archetype | Sonnet | ~$0.032 | 60-90s |
| Flow Navigator | Sonnet/Opus | ~$0.04-0.15 | 90-120s |

All include Haiku chart summary (~$0.002).

---

## Strategic Recommendations

1. **Run multiple flavors on your first few submissions** — compare outputs, feel the difference
2. **Pick your top 3** for early sales (Classic + Archetype + Unlock is a good trio)
3. **Deliver manually for first 20-50 profiles** — you learn the patterns, build case studies
4. **Use generation history as A/B testing** — same person, different prompt angles
5. **Automate later** (Phase 2) once you trust the outputs

---

## Files

```
scripts/
  generate-profile.ts              # CLI generation script
  setup-prompt-templates.sql       # prompt_templates table + Classic seed
  seed-prompt-variations.sql       # 4 additional prompt flavors
  setup-profile-generations.sql    # profile_generations table

src/app/api/profile/
  [id]/process/route.ts            # POST — generate (SSE stream, 2-phase pipeline)
  [id]/generations/route.ts        # GET — list generations for assessment
  prompts/route.ts                 # GET (list), POST (create)
  prompts/[id]/route.ts            # PATCH (update), DELETE (delete)

src/app/profile/admin/
  prompts/page.tsx                 # Prompt management page

src/components/profile/
  AssessmentDetail.tsx             # Full detail, prompt picker, generation history
  PromptManager.tsx                # Prompt CRUD UI

src/lib/
  supabase.ts                      # Assessment, PromptTemplate, ProfileGeneration types

FLOW_PROFILE_SYSTEM.md             # This file
```

---

## Troubleshooting

**CLI: "Assessment not found"** → Check ID is correct, verify Supabase connection

**CLI: "Prompt template not found"** → Run `npm run profile:generate <id>` (no prompt arg) to list available names. Names are case-sensitive.

**UI: Generation hangs past 60s** → Use CLI instead — no timeout constraints

**Can't delete prompt** → Set `is_active = false` to hide from picker without deleting

**Regeneration changed delivered status** → Fixed (Feb 2026) — status no longer regresses from `delivered`
