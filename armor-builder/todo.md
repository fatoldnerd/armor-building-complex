# Armor Builder refresh

Approved implementation: see `docs/plans/2026-10-25-modern-armor-builder.md` for scope, source inventory, and verification checklist.

## Review

The new entry point retains Firebase authentication while replacing the training UI. Legacy pages remain for reference but are not mounted. Completed sessions now use actual per-user Firestore documents; device preview mode is labeled and stored separately. Browser verification and signed-in Firebase verification must be reported separately.
