import test from 'node:test';
import assert from 'node:assert/strict';
import {runNoisyStudy,SCENARIOS,CONTROLLERS,PROTOCOL} from '../src/sim/noisyStudy.js';

test('deterministic replay across all scenarios',()=>{
  const args={seed:369,replicates:3,steps:20};
  assert.equal(JSON.stringify(runNoisyStudy(args)),JSON.stringify(runNoisyStudy(args)));
});
test('same initial observation for all policies and audit receipt',()=>{
  const r=runNoisyStudy({seed:333,replicates:2,steps:12});
  assert.equal(r.protocol,PROTOCOL);
  assert.equal(r.trace.length,SCENARIOS.length*2*12);
  for(const row of r.trace) {
    assert.equal(typeof row.initialSignal,'boolean');
    assert.equal(Object.keys(row.results).length,CONTROLLERS.length);
    for(const p of ['latest','calibrated','fallback'])assert.equal(row.results[p].rechecked,false);
  }
});
test('policy utility, costs, error and scenario accounting',()=>{
  const r=runNoisyStudy({replicates:3,steps:24});
  for(const m of r.metrics) {
    assert.equal(m.count,r.trace.length);
    assert.ok(m.continues>=0&&m.continues<=m.count);
    assert.ok(m.rechecks>=0&&m.rechecks<=m.count);
    assert.equal(m.meanUtility,m.totalUtility/m.count);
    assert.ok(m.brier>=0&&m.brier<=1);
    assert.equal(m.totalUtility,r.scenarios.reduce((n,s)=>n+s.metrics.find(x=>x.id===m.id).totalUtility,0));
  }
});
test('always-fallback safely returns zero utility and risk',()=>{
  const m=runNoisyStudy().metrics.find(x=>x.id==='fallback');
  assert.equal(m.continues,0);assert.equal(m.hazardousActions,0);assert.equal(m.totalUtility,0);
});
test('noisy observations may disagree with scoring truth, rechecks cost action budget',()=>{
  const r=runNoisyStudy();
  assert.ok(r.trace.some(t=>t.initialSignal!==t.instrumentedTruth));
  assert.ok(r.trace.some(t=>t.results.filter.rechecked));
  assert.ok(r.trace.some(t=>t.results.filter.rechecked&&t.results.filter.reward%1===0));
});
test('invalid input bounded',()=>{
  for(const p of [{seed:0},{replicates:36},{steps:61},{steps:0}])
    assert.throws(()=>runNoisyStudy(p),/integer/);
});
test('different seeds produce different test traces',()=>{
  assert.notEqual(JSON.stringify(runNoisyStudy({seed:21,replicates:1,steps:12}).trace),
    JSON.stringify(runNoisyStudy({seed:22,replicates:1,steps:12}).trace));
});
