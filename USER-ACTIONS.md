# USER-ACTIONS — Required Steps Before/After Deploying the Hardening Release

**Created:** July 2, 2026
**Context:** This release fixes the security findings from the June 11 audit (hardcoded keys, no rate limiting, admin auth, validation, headers, RLS gaps). The code changes are done, but the items below can only be done by you — they involve external dashboards (Web3Forms, Sanity, Vercel, Supabase). Work through them **in order**. Items 1–4 should be done **before** deploying; 5–6 after.

---

## 1. Rotate two leaked keys (REQUIRED — both are burned)

Both keys below are in git history and were shipped in past browser bundles. Removing them from the code (done) does not un-leak them — they must be rotated.

### 1a. Web3Forms access key
The key `73d66ffb-9a88-4841-8f05-a48b0219288f` was hardcoded in the contact forms (client-side, scrapeable by anyone).

1. Go to https://web3forms.com and generate a **new access key** for your email.
2. Do **not** paste it into any source file. It goes into a Vercel env var (step 2).
3. Optionally deactivate the old key if Web3Forms offers that (or ignore — with the new key in place, the old one only spams you, and forms now go through a rate-limited server proxy anyway).

### 1b. Sanity API token  ⚠️ higher priority than the audit knew
A **Sanity API token was hardcoded** in `src/lib/sanity.ts`, `src/lib/sanity-test.ts`, and five migration scripts under `scripts/` (starts with `skFsVNJgys3k…`). The lib files are imported by client components, so the token has been shipped in the public JS bundle. It's now removed from all code (the migration scripts read `SANITY_API_TOKEN` from env if you ever rerun them), but it must be revoked:

1. Go to https://sanity.io/manage → your project (`pz22ntol`) → **API → Tokens**.
2. **Revoke** the token starting `skFsVNJgys3k`.
3. If your dataset is **public** (default for content sites): you don't need a replacement token for reads — the site will keep working with no token. Verify after deploy: `/content` and `/blog` still show content.
4. If content stops loading after the revoke: create a new **Viewer** token and add it in Vercel as `SANITY_API_TOKEN` (server var, NOT `NEXT_PUBLIC_…`). Note: content pages that fetch from the browser can't use a server-only token — if that's your setup and the dataset is private, the right fix is making the dataset public or moving reads server-side (ask for this in a future session).

---

## 2. Vercel environment variables

Vercel → your `fourflowos` project → Settings → Environment Variables (add to **Production** and **Preview**):

| Variable | Value | Required? |
|---|---|---|
| `WEB3FORMS_KEY` | the NEW key from step 1a | **Yes** — contact/together forms and intake admin notifications return errors/skip without it |
| `UPSTASH_REDIS_REST_URL` | from step 3 (optional) | Recommended |
| `UPSTASH_REDIS_REST_TOKEN` | from step 3 (optional) | Recommended |

Also confirm these already exist (they should — the site uses them today): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `ANTHROPIC_API_KEY`, `PROFILE_ADMIN_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CHART_SERVICE_URL`.

The repo now has a `.env.example` documenting every variable. For local dev, add `WEB3FORMS_KEY=…` to your `.env.local`.

---

## 3. Upstash Redis for durable rate limiting (recommended, ~5 min, free)

The new rate limiter works out of the box with an in-memory fallback, but on Vercel each serverless instance counts separately — good enough against casual abuse, not against a determined one. Upstash makes it a real shared limit:

1. https://console.upstash.com → Create Database → **Redis**, region close to your Vercel region (e.g. `us-east-1`), Free tier.
2. In the database's **REST API** section, copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
3. Add both in Vercel (step 2 table). Redeploy. Nothing else — the limiter auto-detects them.

Current limits (tune in `src/lib/rate-limit.ts`): contact 5/hr + 20/day per IP · profile intake 3/hr + 10/day per IP · profile-view-by-token 30/hr per IP · Timeless Map 3/day per user · Flow Unlock 10/hr per IP (plus its existing 1/day rule) · failed admin logins 10/hr per IP.

---

## 4. Supabase: run two SQL scripts (REQUIRED)

Supabase Dashboard → SQL Editor → paste and run, in this order:

### 4a. `scripts/setup-flowwrite-sessions.sql` (pre-existing, never run)
Creates the `flowwrite_sessions` table **with RLS**. Until this runs, FlowWrite session stats silently fail to save.

### 4b. `scripts/enable-rls-user-tables.sql` (new)
Enables RLS + own-row policies on `focus_sessions` and `curiosity_snapshots` — the two tables the browser writes to that had **no database-level protection**. Without this, anyone with the public anon key can read/write other users' rows.

### Verify (SQL Editor)
```sql
SELECT relname, relrowsecurity FROM pg_class
WHERE relname IN ('focus_sessions','curiosity_snapshots','flowwrite_sessions');
-- all three rows: relrowsecurity = true

SELECT tablename, policyname, cmd FROM pg_policies
WHERE tablename IN ('focus_sessions','curiosity_snapshots','flowwrite_sessions');
-- expect: 2 policies on focus_sessions, 3 on curiosity_snapshots, 2 on flowwrite_sessions
```

### Functional verify (on the live site, logged in)
- Finish a short FlowZone session → it appears on `/me`.
- Open FlowWrite, write briefly, finish → no console errors.
- Open Curiosity Explorer, add an item → it persists on refresh.

---

## 5. Deploy + post-deploy smoke checklist

Deploy via the usual two-step (`/commit` — submodule push then parent pointer). Then, on the live site **with the browser devtools console open** (any CSP violation shows up there in red):

- [ ] Landing page renders fully; animations play; **no CSP errors in console**
- [ ] `/contact` form submits → you receive the email (via the new `/api/contact` proxy)
- [ ] `/together` form submits → you receive the email
- [ ] Flow Profile intake (`/profile/intake`) submits end-to-end → confirmation email received
- [ ] Log in via magic link → `/me` loads with your data
- [ ] Flow Unlock generates (or shows today's if already done); Timeless Map opens
- [ ] **FlowZone ambient audio plays** (YouTube player — the CSP explicitly allows it; if audio is broken, the console will show a blocked `youtube.com` request — tell Claude)
- [ ] Location autocomplete in intake works (OpenStreetMap allowed in CSP)
- [ ] `/blog` and `/content` show content (Sanity — relevant after the token rotation in 1b)
- [ ] Admin dashboard (`/profile/admin`) works with your admin password
- [ ] `/privacy`, `/terms`, `/eula` render
- [ ] `https://fourflowos.com/mockups/dimensions-v1.html` returns **404** (the internal mockups are no longer publicly served)
- [ ] `curl -sI https://fourflowos.com | grep -iE 'content-security|x-content-type|referrer|x-frame|strict-transport'` shows all five headers

Rate-limit spot check (optional): submit the contact form 6× rapidly → the 6th should fail ("Too many requests" / 429).

---

## 6. Optional: git history scrub

The old Web3Forms key, the Sanity token, and `scripts/last-output.txt` (a personal profile) remain in **git history**. Key rotation (step 1) makes the leaked credentials worthless, so this is optional hygiene, only worth doing if the repo might ever go public:

```bash
# example with git-filter-repo (destructive — coordinate pushes carefully)
git filter-repo --path scripts/last-output.txt --invert-paths
git filter-repo --replace-text <(echo '73d66ffb-9a88-4841-8f05-a48b0219288f==>REDACTED')
```
Force-pushing rewritten history breaks the parent repo's submodule pointers — if you want this, do it in a dedicated session.

---

## 7. Workshop intake: run one SQL script (REQUIRED before the first Flow Map Session)

**Added:** July 9, 2026 · **Context:** the workshop web intake (`/profile/workshop`, short URL `/flowmap`) — the "Transfer" participants complete on their phones at the end of a Flow Map Session.

Supabase Dashboard → SQL Editor → paste and run:

### `scripts/setup-workshop-intake.sql`
One script, three things:
1. Adds `source` ('deep'/'workshop') and `cohort` columns to `assessments` (+ cohort index).
2. Makes `birth_date` and `birth_location` nullable — workshop submissions collect no birth data.
3. Seeds the `workshop-flow-profile` prompt template (the process route auto-selects it for workshop assessments; editable afterwards at `/profile/admin/prompts`). Skipped if the row already exists.

Until this runs, **every submission at `/profile/workshop` fails** (the insert references columns that don't exist yet). The existing deep intake (`/profile/intake`) is unaffected either way.

### Verify (SQL Editor)
```sql
SELECT column_name, is_nullable FROM information_schema.columns
WHERE table_name = 'assessments' AND column_name IN ('source','cohort','birth_date','birth_location');
-- expect: source + cohort present; birth_date + birth_location is_nullable = YES

SELECT name, is_active FROM prompt_templates WHERE name = 'workshop-flow-profile';
-- expect: one row, is_active = true
```

### Functional verify (before the first session)
- Open `/flowmap?c=TEST-JUL26` → redirects to `/profile/workshop` with the cohort pre-filled.
- Submit a test intake (all 12 dials + both pickers) → confirmation email arrives; row appears in `/profile/admin` with a Workshop badge and the cohort in the dropdown filter.
- Process it from the assessment detail page → it should report using `workshop-flow-profile` and generate without fetching a natal chart → view the profile via its token link, then delete the test row if you like.

### Per-session ops reminder
Create the cohort code (`CLIENT-MONYY`, e.g. `ACME-JUL26`) and point the QR at `/profile/workshop?c=CODE`. After the session: dashboard → filter by cohort → process each → review → deliver.

---

## Deferred items (documented decisions, not forgotten)

| Item | Why deferred | When to revisit |
|---|---|---|
| **Full admin migration to Supabase auth** (magic-link + `ADMIN_EMAILS` allowlist, per-action audit log) | Highest lockout risk right before rollout. Interim state is hardened: timing-safe compare, 10/hr failed-attempt limit, attempt logging | When you add a second admin, or after rollout settles |
| **Design-token refactor** (~250 hardcoded hexes in 60 files → `tokens.ts`) | Pure cosmetics with the highest visual-regression risk; zero security value | Dedicated session with per-page visual checks |
| **CSP without `'unsafe-inline'` scripts** | Requires nonce plumbing through Next.js; current policy already blocks external script injection | If you ever handle payments or similar |
| **`NEXT_PUBLIC_SANITY_API_TOKEN` cleanup** | Any `NEXT_PUBLIC_` token is browser-visible by design; kept as a legacy fallback in code | Confirm the dataset is public, then delete the env var and the fallback read |
| **Shared reduced-motion hook** | Already handled ad hoc in the 4 animated components | Next a11y pass |
| **FlowStation card-render bug** (content_md not rendering) | Pre-existing, unrelated to this hardening pass | Separate fix session |
