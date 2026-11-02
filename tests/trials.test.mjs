import test from 'node:test';
import assert from 'node:assert/strict';
import { runSensorStudy, PROTOCOL_ID, SCENARIOS, CONTROLLERS } from '../src/sim/trials.js';

test('replay is byte-identical with the same preregistered settings', () => {
  const opts = { seed: 369, replicates: 4, steps: 24, observeEvery: 3 };
  assert.equal(JSON.stringify(runSensorStudy(opts)), JSON.stringify(runSensorStudy(opts)));
});

test('each controller sees equal steps and a fixed forecast-before-report protocol', () => {
  const result = runSensorStudy({ seed: 111, replicates: 3, steps: 18, observeEvery: 3 });
  assert.equal(result.protocol, PROTOCOL_ID);
  assert.equal(result.trace.length, SCENARIOS.length * 3 * 18);
  assert.equal(result.metrics.length, CONTROLLERS.length);
  for (const m of result.metrics) {
    assert.equal(m.total, result.trace.length);
    assert.equal(m.correct + m.mismatches, m.total);
  }
  for (const x of result.trace) {
    assert.equal(x.observation !== null, x.tick % 3 === 0);
  }
});

test('self-model and one-bit baseline tie when given the same health reports', () => {
  for (const observeEvery of [1, 2, 3, 6, 9]) {
    const x = runSensorStudy({ seed: 369, replicates: 4, steps: 24, observeEvery });
    assert.deepEqual(x.metrics[0].correct, x.metrics[1].correct);
    for (const scenario of x.byScenario) {
      assert.equal(scenario.metrics[0].correct, scenario.metrics[1].correct);
    }
    for (const row of x.trace) {
      assert.equal(row.forecasts['self-model'], row.forecasts['last-report']);
    }
  }
});

test('simple constant baselines excel on corresponding stable controls', () => {
  const x = runSensorStudy({ seed: 25, replicates: 2, steps: 24 });
  const online = x.byScenario.find(s => s.id === 'stable-on');
  const offline = x.byScenario.find(s => s.id === 'stable-off');
  assert.equal(online.metrics.find(m => m.id === 'always-on').accuracy, 1);
  assert.equal(offline.metrics.find(m => m.id === 'always-off').accuracy, 1);
  assert.ok(offline.metrics.find(m => m.id === 'always-on').accuracy < 1);
});

test('strict input bounds reject excessive trials and invalid settings', () => {
  assert.throws(() => runSensorStudy({ seed: 0 }), /seed/);
  assert.throws(() => runSensorStudy({ replicates: 1000 }), /replicates/);
  assert.throws(() => runSensorStudy({ steps: 10000 }), /steps/);
  assert.throws(() => runSensorStudy({ observeEvery: 0 }), /observeEvery/);
});

test('changing the observation cadence affects sensor-state tracking', () => {
  const fast = runSensorStudy({ seed: 369, replicates: 5, steps: 36, observeEvery: 1 });
  const slow = runSensorStudy({ seed: 369, replicates: 5, steps: 36, observeEvery: 8 });
  assert.ok(fast.metrics[0].correct >= slow.metrics[0].correct);
  assert.equal(fast.metrics[0].correct, fast.metrics[1].correct);
  assert.equal(slow.metrics[0].correct, slow.metrics[1].correct);
});

