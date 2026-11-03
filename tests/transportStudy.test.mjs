import test from 'node:test';
import assert from 'node:assert/strict';
import {runTransportStudy,REGIMES,POLICIES,SETTINGS,PROTOCOL} from '../src/sim/transportStudy.js';
const config={seed:369,repetitions:3,steps:36};
const rows=(r,id,world)=>r.trace.filter(x=>x.condition===id&&x.worldForScorer===world);

test('deterministic receipt, bounded workload and protocol metadata',()=>{
  const a=runTransportStudy(config);
  const b=runTransportStudy(config);
  assert.equal(JSON.stringify(a),JSON.stringify(b));
  assert.equal(a.protocol,PROTOCOL);
  assert.equal(a.trace.length,REGIMES.length*2*config.repetitions*config.steps);
  assert.equal(a.trials.length,REGIMES.length*2*config.repetitions);
});
test('both hidden mirror worlds yield EXACT same passive reports in all phases',()=>{
  const x=runTransportStudy(config);
  for(const id of ['mirror','sham']){
    const a=rows(x,id,'independent'),b=rows(x,id,'common');
    assert.deepEqual(a.map(y=>y.reports),b.map(y=>y.reports));
    for(const trial of x.trials.filter(t=>t.condition===id&&t.worldForScorer==='independent')){
      const counterpart=x.trials.find(t=>t.condition===id&&t.worldForScorer==='common'&&t.repetition===trial.repetition);
      for(const p of POLICIES)assert.equal(trial.decisions[p.id].verdict,counterpart.decisions[p.id].verdict);
    }
  }
});
test('natural unprobed reports stay paired even in controlled-input regimes',()=>{
  const x=runTransportStudy(config);
  for(const id of ['probes','tampered','transport']){
    const a=rows(x,id,'independent').filter(y=>!y.probeOffered);
    const b=rows(x,id,'common').filter(y=>!y.probeOffered);
    assert.deepEqual(a.map(y=>y.reports),b.map(y=>y.reports));
  }
});
test('verified controlled inputs can break paired-world report equivalence',()=>{
  const x=runTransportStudy(config);
  const a=rows(x,'probes','independent').filter(y=>y.probeOffered);
  const b=rows(x,'probes','common').filter(y=>y.probeOffered);
  assert.ok(a.some((y,i)=>y.reports!==b[i].reports));
  assert.ok(a.every(y=>y.claimedLabelForScorer===y.knownInputForScorer));
  assert.ok(b.every(y=>y.claimedLabelForScorer===y.knownInputForScorer));
});
test('corrupted input certificates and probe-only transport gaps are explicit',()=>{
  const x=runTransportStudy(config);
  assert.ok(x.trace.some(y=>y.condition==='tampered'&&y.probeOffered&&
    y.knownInputForScorer!==y.claimedLabelForScorer));
  assert.ok(x.trace.filter(y=>y.condition==='transport'&&y.probeOffered)
    .every(y=>y.claimedLabelForScorer===y.knownInputForScorer));
});
test('unpurchased labels NEVER enter policy observations; costs exact',()=>{
  const x=runTransportStudy(config);
  for(const row of x.trace)for(const p of POLICIES){
    const o=row.observations[p.id];
    assert.equal(o.labelSeen,o.bought?row.claimedLabelForScorer:null);
    if(o.bought)assert.equal(row.probeOffered,true);
  }
  for(const trial of x.trials)for(const p of POLICIES){
    const d=trial.decisions[p.id];
    const right=d.verdict===trial.worldForScorer;
    const wrong=d.verdict!=='unresolved'&&!right;
    assert.equal(d.utility,(right?SETTINGS.correctReward:wrong?SETTINGS.wrongReward:0)-
      d.purchases*SETTINGS.probeCost);
  }
});
test('safe abstention is always unresolved and purchases nothing',()=>{
  const x=runTransportStudy(config),m=x.metrics.find(m=>m.id==='abstain');
  assert.equal(m.unresolved,m.total);
  assert.equal(m.purchases,0);
  assert.equal(m.utility,0);
});
test('all totals match trial summaries and Brier bounds',()=>{
  const x=runTransportStudy(config);
  for(const m of x.metrics){
    assert.equal(m.total,x.trials.length);
    assert.equal(m.correct+m.wrong+m.unresolved,m.total);
    assert.equal(m.utility,x.scenarios.reduce((a,s)=>
      a+s.metrics.find(c=>c.id===m.id).utility,0));
    assert.ok(m.brier>=0&&m.brier<=1);
    assert.equal(m.meanUtility,m.utility/m.total);
  }
});
test('input bounds and step divisibility',()=>{
  for(const args of [{seed:0},{repetitions:13},{steps:15},{steps:73},{steps:25},
    {seed:4.5}])assert.throws(()=>runTransportStudy(args),/integer|divisible/);
});

