import test from 'node:test';
import assert from 'node:assert/strict';
import { runWitnessStudy,REGIMES,POLICIES,REWARDS,PROTOCOL } from '../src/sim/witnessStudy.js';
import { observablePairs } from '../src/data/witnessParadox.js';

const settings={seed:369,repetitions:4,steps:30};
test('fixed input produces an identical complete audit receipt',()=>{
  assert.equal(JSON.stringify(runWitnessStudy(settings)),JSON.stringify(runWitnessStudy(settings)));
});
test('both unanchored worlds have identical reports but potentially different truth',()=>{
  const r=runWitnessStudy(settings);
  const a=r.trace.filter(x=>x.scenario==='ambiguous-equal');
  const b=r.trace.filter(x=>x.scenario==='ambiguous-unequal');
  assert.deepEqual(a.map(x=>[x.sensorA,x.referenceB,x.referenceSourceTick]),
    b.map(x=>[x.sensorA,x.referenceB,x.referenceSourceTick]));
  assert.ok(a.some((x,i)=>x.hiddenTruthForScorer!==b[i].hiddenTruthForScorer));
  for(let i=0;i<a.length;i++){
    for(const p of POLICIES){
      assert.deepEqual(a[i].decisions[p.id],b[i].decisions[p.id]);
    }
  }
});
test('analytical joint distributions match the Cosmos-lane counterexample',()=>{
  const x=observablePairs(.8,.8).map(p=>p.probability);
  const y=observablePairs(.95,.7).map(p=>p.probability);
  assert.deepEqual(x.map(v=>Number(v.toFixed(10))),y.map(v=>Number(v.toFixed(10))));
  assert.deepEqual(x.map(v=>Number(v.toFixed(2))),[.34,.16,.16,.34]);
});
test('every policy pays for requested witness and never sees unbought B',()=>{
  const r=runWitnessStudy(settings);
  assert.equal(r.protocol,PROTOCOL);
  assert.equal(r.trace.length,REGIMES.length*settings.repetitions*settings.steps);
  for(const row of r.trace){
    for(const p of POLICIES){
      const d=row.decisions[p.id];
      assert.equal(d.sawB,d.purchasedB?row.referenceB:null);
      if(!d.purchasedB)assert.notEqual(d.utility,REWARDS.witnessCost-1000);
    }
  }
  for(const m of r.metrics){
    assert.equal(m.count,r.trace.length);
    assert.equal(m.witnessPurchases,r.trace.filter(t=>t.decisions[m.id].purchasedB).length);
    assert.equal(m.utility,r.trace.reduce((sum,t)=>sum+t.decisions[m.id].utility,0));
    assert.equal(m.meanUtility,m.utility/m.count);
    assert.ok(m.brier>=0&&m.brier<=1);
  }
});
test('timestamp-aware policy never pays for explicitly stale B',()=>{
  const r=runWitnessStudy(settings);
  const lagged=r.trace.filter(x=>x.scenario==='timing-skew');
  assert.ok(lagged.every(x=>x.referenceSourceTick===x.tick-1));
  assert.ok(lagged.every(x=>x.decisions.timestamp.purchasedB===false));
  assert.ok(lagged.every(x=>x.decisions.fusion.purchasedB===true));
  assert.ok(r.metrics.find(m=>m.id==='fusion').staleReportsPurchased>0);
  assert.equal(r.metrics.find(m=>m.id==='timestamp').staleReportsPurchased,0);
});
test('safe fallback never continues and pays no witness costs',()=>{
  const m=runWitnessStudy(settings).metrics.find(x=>x.id==='abstain');
  assert.equal(m.utility,0);
  assert.equal(m.continues,0);
  assert.equal(m.hazardousContinues,0);
  assert.equal(m.witnessPurchases,0);
});
test('shared cause creates identical wrong reports, and overconfident errors exist',()=>{
  const r=runWitnessStudy(settings);
  assert.ok(r.trace.some(x=>x.scenario==='common-cause'&&x.sharedCauseForScorer&&
    x.sensorA===x.referenceB&&x.sensorA!==x.hiddenTruthForScorer));
  assert.ok(r.metrics.find(x=>x.id==='overconfident').overconfidentErrors>0);
});
test('settings bounded and distinct seeds vary the report trace',()=>{
  for(const opt of [{seed:0},{repetitions:21},{steps:7},{steps:61},{seed:1.2}])
    assert.throws(()=>runWitnessStudy(opt),/integer/);
  const a=runWitnessStudy({seed:21,repetitions:1,steps:9});
  const b=runWitnessStudy({seed:22,repetitions:1,steps:9});
  assert.notEqual(JSON.stringify(a.trace),JSON.stringify(b.trace));
});

