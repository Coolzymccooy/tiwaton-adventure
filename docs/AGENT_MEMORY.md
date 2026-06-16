# Agent Handoff Memory — Production Readiness and Next To-Dos

Last updated: 2026-06-16

## Production status

The current feature bundle is ready to ship after the PR is merged and Vercel finishes the production deployment. Firestore rules have been updated by the owner in Firebase Console.

Validated locally:
- `npm run build` completes successfully.
- Known build output includes Vite warnings about bundle size and Firebase dynamic/static imports; these are not production blockers.

## Completed in this feature bundle

1. **Session/auth hardening**
   - Explicit logout marker.
   - Safe localStorage wrapper.
   - Auth event versioning.
   - Fallback timer for auth boot.
   - Cached local session restore for child/offline resume.
   - Full local session clear on explicit logout.

2. **Mobile/blank-screen reduction**
   - Boot fallback card in `index.html`.
   - Mobile-like device heuristic in `App.tsx`.
   - Lightweight Landing mode via `disableHeavyEffects`.
   - Compact Login mode via `compactMode`.

3. **Child/adventurer independent sign-in support**
   - Normalized `children_index` lookup.
   - Lightweight child profile snapshot in index.
   - Fallback child profile if index snapshot is missing.
   - Firestore rules keep `children_index` readable but restrict writes/deletes.

4. **Drawing resiliency**
   - Local draft autosave.
   - Draft restore/discard UI.
   - Local queued gallery saves.
   - Retry queue support.
   - Save status messaging.
   - Drawing metadata fields for title/project/version/owner/queued state.

5. **English learning and AI scaffolding**
   - English Quest in Games.
   - Vocabulary, spelling, and reading modes.
   - AI mission generation hook.
   - English progress save/fetch in storage.

6. **Personalized Daily Learning Path**
   - Daily path generation on Home.
   - English, math, creative, story, and wisdom tasks.
   - Focus skill, task skill, learning reason, XP, minutes, and completion state.
   - Local daily path cache.
   - Local learning streak cache.
   - Parent/Teacher dashboard summaries.

## Immediate production checklist

Before/after merge:
1. Confirm Firebase rules are published in Firebase Console.
2. Merge the PR into the production branch (`master`/main production branch).
3. Wait for Vercel production deployment to show `Ready`.
4. Open the production URL in a private/incognito mobile browser session.
5. Test:
   - Cold mobile open: no long blank/dark screen.
   - Refresh mobile 2–3 times.
   - Child/adventurer sign-in without parent/teacher already signed in.
   - Sign out, refresh, confirm it does not resume the prior signed-in account after explicit logout.
   - Drawing autosave: draw, wait, refresh, restore draft.
   - Drawing failed-save behavior if network is interrupted.
   - Games → English Quest.
   - Home daily path completion.
   - Parent/Teacher daily path and English progress panels.

## Remaining non-blocking to-dos for future agents

These are not blockers for the current production deploy, but they are the next recommended moat improvements.

### P1 — Cloud sync Daily Learning Path
Currently the daily path and streak are local-first. Move daily paths and streaks to Firestore under each child so progress follows the child across devices and dashboards can view it remotely.

Suggested files:
- `services/storage.ts`
- `types.ts`
- `pages/Home.tsx`
- `pages/ParentDashboard.tsx`
- `pages/TeacherDashboard.tsx`
- `firestore.rules`

### P1 — Make AI English missions fully interactive
AI mission currently generates/display questions and records generation. Add answer selection, grading, explanation feedback, XP/coins, and saved scored progress.

Suggested files:
- `pages/Games.tsx`
- `services/storage.ts`
- `types.ts`

### P1 — Add automated regression checks
Add scripts and tests for the flows that previously broke:
- mobile boot fallback renders,
- auth-null does not blank the app,
- explicit logout clears session,
- child global login works from `children_index`,
- drawing draft restore works,
- English Quest opens without runtime errors.

Suggested files:
- `package.json`
- `tests/` or `e2e/`
- Playwright/Vitest config if introduced.

### P2 — Improve bundle performance
Vite currently warns about large chunks. Add code splitting for heavy pages/features, especially Games/Drawing/Firebase imports.

Suggested files:
- `App.tsx`
- `pages/Games.tsx`
- `pages/Drawing.tsx`
- `vite.config.ts`

### P2 — Visible queued-save manager
Drawing has local queued saves. Add a visible “Pending saves” manager so kids/parents know what is waiting to sync and can retry manually.

Suggested files:
- `pages/Drawing.tsx`
- `services/storage.ts`

### P2 — Add more subject tracks
Current path subjects are English, Math, Art, Story, and Bible/Wisdom. Add Science, Geography, Coding, Social Studies, and Phonics.

Suggested files:
- `types.ts`
- `pages/Home.tsx`
- `pages/Games.tsx`
- new subject-specific components if needed.

### P2 — Teacher assignment mode
Allow teachers to create a class assignment that appears in each student's daily path.

Suggested files:
- `pages/TeacherDashboard.tsx`
- `pages/Home.tsx`
- `services/storage.ts`
- `types.ts`
- `firestore.rules`

## Notes for future agents

- Do not remove the `children_index` public read rule unless you redesign child/adventurer login. Independent child login depends on a public lookup plus protected writes.
- Do not clear all local profile/session cache on every Firebase `null` auth event; child/offline cached sessions rely on local restore unless explicit logout marker is present.
- Keep mobile startup lightweight; avoid adding heavy animated/3D effects before the user reaches Home.
- Run `npm run build` before handing work back.
- If conflicts are resolved in GitHub, always rebuild afterward. The repeated Vercel `Expected ')' but found 'catch'` issue came from conflict-resolution syntax damage.
