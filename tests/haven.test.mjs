import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VERSION, ROOM, LANDMARKS, ACTIONS, createHaven, stepHaven,
  operationalConditions, intervene, ambience, exportCheckpoint, importCheckpoint
} from '../src/sim/haven.js';

test('deterministic initialization and replay', () => {
  const actions = ['observe', 'north', 'west', 'interact', 'rest', 'east'];
  const run = () => actions.reduce((s, a) => stepHaven(s, a), createHaven(369));
  assert.deepEqual(run(), run());
  assert.equal(run().version, VERSION);
  assert.equal(ambience(run()), ambience(run()));
});

test('all movement stays inside the world and halts within trial limit', () => {
  let s = createHaven();
  for (let i = 0; i < 100; i++) s = stepHaven(s, i % 2 ? 'west' : 'north');
  assert.ok(s.pose.x >= 0 && s.pose.x < ROOM.width);
  assert.ok(s.pose.y >= 0 && s.pose.y < ROOM.height);
  assert.equal(s.stopped, true);
  assert.ok(s.tick <= s.tickLimit);
});

test('fault intervention does not instantly rewrite the self-model', () => {
  const state = createHaven(369);
  const changed = intervene(state, 'range-off');
  assert.equal(changed.rangeOnline, false);
  assert.equal(changed.selfModel.rangeOnline, true);
  assert.equal(operationalConditions(changed).at(-1).value, 'STALE');
  const observed = stepHaven(changed, 'observe');
  assert.equal(observed.selfModel.rangeOnline, false);
  assert.equal(observed.lastObservation.length, 0);
  assert.equal(operationalConditions(observed).at(-1).value, 'ALIGNED');
  assert.equal(observed.events.at(-2).source, 'experimenter');
});

test('simple baseline does not maintain an explicit self-model', () => {
  const base = createHaven(369, 'baseline');
  assert.equal(base.selfModel, null);
  assert.equal(stepHaven(base, 'observe').selfModel, null);
  assert.equal(operationalConditions(base).at(-1).ok, null);
});

test('transitions are pure, bounded and stop safely', () => {
  const original = createHaven(369);
  let s = original;
  while (!s.stopped) s = stepHaven(s, 'observe');
  assert.equal(original.tick, 0);
  assert.ok(s.tick <= s.tickLimit);
  assert.ok(s.energy >= 0 && s.energy <= 100);
  assert.ok(s.heat >= 0 && s.heat <= 100);
  assert.deepEqual(stepHaven(s, 'observe'), s);
  assert.ok(s.events.length <= 120);
  assert.ok(s.memories.length <= 32);
  assert.ok(LANDMARKS.length === 5 && ACTIONS.includes('rest'));
});

test('checkpoint round-trip and corruption rejection', () => {
  const s = stepHaven(createHaven(412), 'west');
  assert.deepEqual(importCheckpoint(exportCheckpoint(s)), s);
  assert.throws(() => importCheckpoint('{"schema":"whatever"}'), /Invalid/);
  const corrupted = JSON.parse(exportCheckpoint(s));
  corrupted.state.pose.x = -5;
  assert.throws(() => importCheckpoint(JSON.stringify(corrupted)), /Invalid/);
});

test('dock recovery is greater than remote low-activity recovery', () => {
  let s = createHaven();
  s = stepHaven(s, 'rest');
  assert.equal(s.energy, 100);
  let d = createHaven();
  for (const a of ['west', 'west', 'north', 'north', 'west']) d = stepHaven(d, a);
  assert.deepEqual(d.pose, { x: 1, y: 1 });
  const before = d.energy;
  d = stepHaven(d, 'rest');
  assert.ok(d.energy > before + 4);
});

