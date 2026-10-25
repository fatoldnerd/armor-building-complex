# Modern Armor Builder

## Approved direction

Brad approved Command Center as a shared hub, four focused workout apps, accounts now with paid features later, and Armor Builder first. The interface must work on a phone during training and feel modern and polished.

## Source inventory

Existing repository: https://github.com/fatoldnerd/armor-building-complex . Application subdirectory: `armor-builder/`. Source imported through the connected GitHub API after the shell download was cancelled. The default branch is `master`, reviewed at `52bf97778660062f0ba6ca67b89c82cbf9141201`. The imported application subtree was `8c47bc9afb9f008fdcfcaaac9f4bb9aae32d6a69`.

| Product | Repository | Existing foundation |
| --- | --- | --- |
| Command Center | https://github.com/fatoldnerd/kettlebell-command-center-app | React 19, Vite 7, Firebase dependency |
| Snatch Tracker | https://github.com/fatoldnerd/ksk-snatch-tracker | React 18, Vite 5, Firebase 11 |
| 10K Swing Tracker | https://github.com/fatoldnerd/10k-swing-tracker | Next.js application in `kettlebell-tracker/`, Firebase |
| General tracker | https://github.com/fatoldnerd/MyKettlebellTracker | Static HTML and JavaScript, Firebase, device-local offline storage |

The snatch and general trackers declare different Firebase projects. A single account cannot be assumed across these projects. Shared identity and historical data need a migration plan before consolidation.

## Existing Armor Builder findings

- Google/Firebase sign-in already exists and is retained.
- Firestore rules scope records to `users/{uid}/workouts/{id}` and settings to the current user.
- Existing dashboard/history read unscoped browser-local `workoutHistory`.
- Existing session summary simulates saving and calls five rounds a personal best without historical comparison.
- Existing volume calculation counts six repetitions times one bell weight, although the setup describes two bells.

## Implementation checklist

- [x] Inspect source and define the mobile training flow.
- [x] Replace the shell with a charcoal/olive and warm-orange design.
- [x] Build setup, rounds, rest timing, pause/resume, undo, and session review.
- [x] Retain Google sign-in and use the existing per-user Firestore collection.
- [x] Persist user-scoped active drafts with explicit saving failures.
- [x] Build history, real aggregates, export, and preferences.
- [x] Verify phone and desktop presentation and workout interactions.
- [ ] Verify signed-in Firebase saving and synchronization with a test account.
- [ ] Publish a separate review version, retaining the current live app.

## Counting and persistence

Double-bell mode: one round means 2 cleans, 1 press, 3 squats with both bells. Single-bell mode: complete the sequence on both sides to record one round. Each round therefore lifts 12 times the selected bell mass. Legacy records retain their recorded metrics and are excluded from the new volume aggregate.

Timers use timestamps and accumulated active time. Rest pauses with the session. Drafts are scoped to Firebase UID; preview mode is explicitly device-only. A refresh restores the draft in a paused state. Cloud saves use the draft UUID as a document ID so retries do not duplicate sessions.

## Boundaries

Firebase users, rules, domains, and the current hosted app are unchanged. Client Firebase configuration is loaded from ignored `.env.local`. A separate review hostname must be authorized in Firebase before Google sign-in works there. Existing local-only records are not automatically assigned to a signed-in user or migrated.

## Verification evidence

PASS: production Vite build; four Node tests covering timestamp timing, paused rest, round guards, undo, volume, and draft validation. Browser checked at 390×844, 320×740, and desktop. No horizontal overflow at 320 px. Verified real UI start, round increment, automatic rest, pause, review, device save, history after reload, paused recovery of an active draft, undo, resume, discard confirmation, and progress calculated from the recorded preview session.

UNVERIFIED: Google OAuth completion and signed-in Firestore reads/writes; cross-device sync; iOS Safari audio, haptics, and screen wake lock on physical hardware. These optional browser capabilities fail gracefully. Current live Firebase rules were not deployed or changed. The separate preview host may need Firebase authorization before Google sign-in works.
