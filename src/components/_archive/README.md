# Archived components

Retired during the July 2026 content/linking cleanup (True North alignment). Kept as
assets for future reuse; excluded from typechecking via `tsconfig.json`. Not routed —
relative imports may point at files that stayed live, so fix imports before reviving.

- `pages/` — the framework deep-dive pages (`DimensionPage`, `KeyPage`), `BlogPage`
  (Resources), `ContentPage` (Sanity article leaf). Their routes (`/dimension/*`,
  `/content/*`, `/blog`) now redirect to `/framework`.
- `routes/AppsPracticePage.tsx` — the public `/apps` Practice page (tools-as-
  prescriptions copy + AppModal). Content absorbed into `/framework` (Tools section)
  and the `/me` practice explainer. `/apps` redirects to `/framework`.
- `navigation/` — the legacy app-shell nav set (`NavigationWrapper` + fixed
  `BottomKeysNav`/`BottomNav` that rendered on `/framework` and the deep-dive pages,
  plus `TopBar`, `TopIconBar`, `MenuButton`, `TopContextBar`). The bottom keys nav is
  the "useful asset in the future" — a per-key navigator across the 12 Keys.
- `me/` — the unused `MePage` bento profile view (`/me` renders FlowLab instead).
  `BentoGrid`, `ArchetypeHeader`, `DimensionBentoCard` stayed live in
  `src/components/me/` (used by `AdminProfilePreview`).
- `lab/LabNav.tsx` — unreferenced lab nav variant.
