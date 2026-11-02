import test from 'node:test';
import assert from 'node:assert/strict';
import { runCalibrationStudy, PROTOCOL, POLICIES, CONDITIONS, COSTS } from '../src/sim/calibrationStudy.js';

const small = { seed: 369, developmentTrials: 2, heldoutTrials: 3, steps: 24, verifyEvery: 4 };

test('full receipts reproduce byte-for-byte', () => {
  assert.equal(JSON.stringify(runCalibrationStudy(small)),
               JSON.stringify(runCalibrationStudy(small)));
});

test('heldout and development use separate deterministic streams', () => {
  const result = runCalibrationStudy(small);
  assert.equal(result.protocol, PROTOCOL);
  const expected = (small.developmentTrials + small.heldoutTrials) * CONDITIONS.length * small.steps;
  assert.equal(result.trace.length, expected);
  assert.equal(result.byPartition.length, 2);
  const developmentTrace = result.trace
    .filter(r => r.partition === 'development' && r.condition === 'stable' && r.trial === 0)
    .map(r => [r.initialSignal, r.secondSignalForPaidRecheck, r.hiddenTruthForScoringOnly]);
  const heldoutTrace = result.trace
    .filter(r => r.partition === 'heldout' && r.condition === 'stable' && r.trial === 0)
    .map(r => [r.initialSignal, r.secondSignalForPaidRecheck, r.hiddenTruthForScoringOnly]);
  assert.notDeepEqual(developmentTrace, heldoutTrace);
  assert.equal(typeof heldoutTrace[0][2], 'boolean');
});

test('every policy receives same scheduled post-decision anchors', () => {
  const result = runCalibrationStudy(small);
  for (const row of result.trace) {
    assert.equal(Object.keys(row.decisions).length, POLICIES.length);
    assert.equal(row.verificationDeliveredAfterDecision !== null, row.tick % 4 === 3);
    assert.equal(typeof row.hiddenTruthForScoringOnly,'boolean');
    for (const policy of POLICIES) assert.equal(typeof row.decisions[policy.id].action,'string');
  }
});

test('fixed frozen filter never changes declared reliability', () => {
  const result = runCalibrationStudy(small);
  for (const row of result.trace) {
    assert.equal(row.decisions.fixed.estimatedReliability, .85);
  }
});

test('adaptive estimates change after verified evidence and some rechecks are purchased', () => {
  const result = runCalibrationStudy(small);
  const observed = new Set(result.trace.map(r=>r.decisions.adaptive.estimatedReliability));
  assert.ok(observed.size > 1);
  assert.ok(result.metrics.find(m=>m.id==='adaptive').rechecks > 0);
  assert.ok(result.metrics.find(m=>m.id==='window').audits > 0);
});

test('all counts, cost charges and Brier error are internally consistent', () => {
  const result = runCalibrationStudy(small);
  for (const metric of result.metrics) {
    assert.equal(metric.total, result.trace.length);
    assert.equal(metric.utility,
      result.byPartition.reduce((sum,p)=>sum+p.metrics.find(m=>m.id===metric.id).utility,0));
    assert.equal(metric.rechecks, result.trace.filter(r=>r.decisions[metric.id].recheck).length);
    assert.equal(metric.audits, result.trace.filter(r=>r.verificationDeliveredAfterDecision !== null).length);
    assert.ok(metric.brierError>=0 && metric.brierError<=1);
    assert.equal(metric.continued + metric.needlessFallback + metric.risky >= metric.continued, true);
  }
  const fallback=result.metrics.find(m=>m.id==='fallback');
  assert.equal(fallback.risky,0);
  assert.equal(fallback.continued,0);
  assert.equal(fallback.utility,fallback.audits*COSTS.verification);
});

test('hidden inversion shows true reliability change unknown to frozen policy', () => {
  const result=runCalibrationStudy(small);
  const inverted=result.trace.filter(r=>r.condition==='inversion');
  assert.ok(inverted.some(r=>r.trueSensorAccuracyForScoringOnly===.9));
  assert.ok(inverted.some(r=>r.trueSensorAccuracyForScoringOnly===.3));
  assert.ok(inverted.every(r=>r.decisions.fixed.estimatedReliability===.85));
});

test('input bounds reject invalid or oversized runs', () => {
  for (const settings of [{ seed: 0 },{developmentTrials:7},{heldoutTrials:17},
                          {steps:60},{verifyEvery:0}]) {
    assert.throws(()=>runCalibrationStudy(settings),/integer/);
  }
});

