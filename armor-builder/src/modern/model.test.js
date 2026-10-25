import test from 'node:test';
import assert from 'node:assert/strict';
import { startDraft, pauseDraft, elapsed, addRound, undoRound, toRecord, defaults, validDraft } from './model.js';

test('pause excludes time spent paused; rest countdown resumes with remaining rest', () => {
  let draft = startDraft(defaults, 'test', 1000);
  draft = addRound(draft, 31000);
  draft = pauseDraft(draft, 41000);
  assert.equal(elapsed(draft, 101000), 40);
  draft = pauseDraft(draft, 101000);
  assert.equal(draft.restUntil, 151000);
  assert.equal(elapsed(draft, 111000), 50);
});
test('background elapsed time uses timestamps; a rest round cannot be recorded twice', () => {
  const draft = addRound(startDraft(defaults, 'test', 1000), 11000);
  assert.equal(addRound(draft, 11001).completedRounds, 1);
  assert.equal(elapsed(draft, 121000), 120);
  assert.equal(undoRound(draft).completedRounds, 0);
});
test('volume counts both bells; single-bell rounds count both sides', () => {
  for (const bellCount of [1, 2]) {
    const draft = addRound(startDraft({...defaults, bellCount}, 'test', 1000), 31000);
    assert.equal(toRecord(draft, ' done ', 61000).totalVolume, 192);
    assert.equal(toRecord(draft, ' done ', 61000).notes, 'done');
  }
});
test('restoring draft rejects invalid values; round target cannot be exceeded', () => {
  const draft = startDraft({...defaults, targetRounds: 1}, 'test', 1000);
  assert.ok(validDraft(draft));
  assert.ok(!validDraft({...draft, weight: -1}));
  assert.equal(addRound(addRound(draft, 11000), 21000).completedRounds, 1);
});
