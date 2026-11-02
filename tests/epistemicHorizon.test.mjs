import test from 'node:test';
import assert from 'node:assert/strict';
import { horizonStages, horizonChallenges } from '../src/data/epistemicHorizon.js';
import { SCENARIOS as noisyScenarios, runNoisyStudy } from '../src/sim/noisyStudy.js';

test('epistemic stages separate scorer-only truth from input, model and human review', () => {
  assert.deepEqual(horizonStages.map(s => s.id), ['truth','signal','model','action','outcome','interpretation']);
  assert.equal(horizonStages[0].access, 'SCORER ONLY');
  assert.equal(horizonStages[1].access, 'SENSOR CHANNEL');
  assert.match(horizonStages.at(-1).note, /not a conclusion about sentience/i);
  assert.equal(new Set(horizonStages.map(s => s.id)).size,horizonStages.length);
});

test('every challenge has a hidden condition, permitted view and a simple competitor', () => {
  assert.equal(new Set(horizonChallenges.map(c => c.id)).size,horizonChallenges.length);
  for(const c of horizonChallenges) {
    assert.equal(c.status,'PROPOSED');
    for(const prop of ['hidden','visible','question','baseline']) assert.ok(c[prop].length > 30, c.id + ': '+prop);
  }
  assert.match(horizonChallenges.find(c=>c.id==='cosmic').hidden,/simulated/i);
});

test('CA-SC-02 explicitly challenges known simulator calibration, not a new result', () => {
  const case1=horizonChallenges.find(c=>c.id==='calibration');
  assert.match(case1.question,/simulator parameters/i);
  assert.ok(noisyScenarios.every(s=>Number.isFinite(s.accuracy) && Number.isFinite(s.flip)));
  const r=runNoisyStudy({seed:369,replicates:1,steps:8});
  assert.equal(r.status,'exploratory-simulation-not-preregistered');
  assert.equal(r.trace.length,3*8);
});
