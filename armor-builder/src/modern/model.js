export const defaults = { weight: 16, bellCount: 2, targetRounds: 10, restSeconds: 60 };
export const time = (seconds) => {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60).toString().padStart(2, '0')}:${(safe % 60).toString().padStart(2, '0')}`;
};
export const elapsed = (draft, now = Date.now()) => draft ? Math.floor(((draft.accumulated || 0) + (draft.runningSince ? Math.max(0, now - draft.runningSince) : 0)) / 1000) : 0;
export const volume = (rounds, weight, bellCount) => rounds * weight * 12;
// A single-bell round includes a full 2–1–3 sequence on each side.
// A double-bell round uses two bells together for one six-repetition sequence.
export function startDraft(config, id, now = Date.now()) {
  return { ...config, id, startTime: new Date(now).toISOString(), completedRounds: 0, accumulated: 0, runningSince: now, restUntil: 0, pausedRest: 0, roundTimes: [], status: 'active' };
}
export function pauseDraft(draft, now = Date.now()) {
  if (!draft.runningSince) return { ...draft, runningSince: now, restUntil: draft.pausedRest ? now + draft.pausedRest : 0, pausedRest: 0 };
  return { ...draft, accumulated: draft.accumulated + Math.max(0, now - draft.runningSince), runningSince: null, pausedRest: Math.max(0, draft.restUntil - now), restUntil: 0 };
}
export function addRound(draft, now = Date.now()) {
  if (!draft.runningSince || draft.completedRounds >= draft.targetRounds || draft.restUntil > now) return draft;
  const completedRounds = draft.completedRounds + 1;
  return {...draft, completedRounds, roundTimes: [...draft.roundTimes, elapsed(draft, now)], restUntil: completedRounds < draft.targetRounds ? now + draft.restSeconds * 1000 : 0};
}
export function undoRound(draft) {
  if (!draft.completedRounds) return draft;
  return { ...draft, completedRounds: draft.completedRounds - 1, roundTimes: draft.roundTimes.slice(0, -1), restUntil: 0, pausedRest: 0 };
}
export function toRecord(draft, notes, now = Date.now()) {
  return { id: draft.id, weight: draft.weight, bellCount: draft.bellCount, targetRounds: draft.targetRounds,
    completedRounds: draft.completedRounds, duration: elapsed(draft, now), startTime: draft.startTime,
    endTime: new Date(now).toISOString(), totalVolume: volume(draft.completedRounds, draft.weight, draft.bellCount),
    restSeconds: draft.restSeconds, roundTimes: draft.roundTimes, notes: notes.trim(), schemaVersion: 2 };
}
export function validDraft(draft) {
  return draft && typeof draft.id === 'string' && Number.isFinite(Date.parse(draft.startTime)) && [1,2].includes(draft.bellCount)
    && Number.isFinite(draft.weight) && draft.weight >= 4 && draft.weight <= 64
    && Number.isInteger(draft.targetRounds) && draft.targetRounds >= 1 && draft.targetRounds <= 100
    && Number.isInteger(draft.completedRounds) && draft.completedRounds >= 0 && draft.completedRounds <= draft.targetRounds
    && Number.isFinite(draft.accumulated) && draft.accumulated >= 0
    && (draft.runningSince === null || Number.isFinite(draft.runningSince)) && Array.isArray(draft.roundTimes)
    && Number.isFinite(draft.restUntil) && Number.isFinite(draft.pausedRest) && Number.isFinite(draft.restSeconds);
}
