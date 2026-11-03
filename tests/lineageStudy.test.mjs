import test from 'node:test';
import assert from 'node:assert/strict';
import {runLineageStudy,REGIMES,POLICIES,PAYOFF,PROTOCOL} from '../src/sim/lineageStudy.js';
const opts={seed:369,repetitions:3,steps:40};
const from=(r,id)=>r.trialReceipts.filter(x=>x.regime===id);

test('replays deterministically with bounded receipt size',()=>{
  const a=runLineageStudy(opts),b=runLineageStudy(opts);
  assert.equal(JSON.stringify(a),JSON.stringify(b));
  assert.equal(a.protocol,PROTOCOL);
  assert.equal(a.trialReceipts.length,REGIMES.length*opts.repetitions);
  assert.ok(a.trialReceipts.every(t=>t.observations.length===opts.steps));
});
test('declared graphs never certify real independence',()=>{
  const r=runLineageStudy(opts);
  for(const t of r.trialReceipts){
    assert.equal(t.declaredGraph.verifiedIndependent,false);
    for(const p of POLICIES)assert.equal(t.judgments[p.id].graphVerifiedIndependent,false);
  }
});
test('hidden common coupling escapes a graph-only no-overlap rule',()=>{
  const r=runLineageStudy(opts);
  const t=from(r,'hidden-coupling');
  assert.ok(t.every(x=>x.declaredGraph.state==='NO_DOCUMENTED_OVERLAP'));
  assert.ok(t.every(x=>x.hiddenRiskForScorer));
  assert.ok(t.every(x=>x.judgments.graph.decision==='provisional-separation'));
  assert.ok(t.every(x=>x.judgments.graph.utility===PAYOFF.falseProvisional));
  assert.ok(t.every(x=>x.judgments.guarded.decision==='flag-risk'));
});
test('copied readings preserve distinct receipt IDs but fail error/copy check',()=>{
  const r=runLineageStudy(opts);
  for(const t of from(r,'copied-feed')){
    assert.ok(t.observations.every(x=>x.reportA===x.reference&&x.primaryReceiptId!==x.referenceReceiptId));
    assert.equal(t.judgments.checksum.decision,'flag-risk');
    assert.equal(t.judgments.checksum.features.copied,true);
  }
});
test('known common-mode faults cause simultaneous wrong reports',()=>{
  const r=runLineageStudy(opts);
  for(const id of ['shared-clock','hidden-coupling','unknown-lineage']){
    const t=from(r,id);
    assert.ok(t.every(x=>x.observations.some(v=>v.reportA!==v.claimedStimulus&&v.reference!==v.claimedStimulus)));
  }
});
test('probe-specific calibration creates return hysteresis and washout',()=>{
  const r=runLineageStudy(opts);
  for(const t of from(r,'mode-hysteresis')){
    const f=t.judgments.history.features;
    assert.ok(f.primaryErrorReturn>f.primaryErrorNormal+.18);
    assert.ok(f.primaryErrorReturn>f.primaryErrorWashout+.10);
    assert.equal(t.judgments.history.decision,'flag-risk');
    assert.ok(t.observations.some(x=>x.phase==='return'&&x.elapsedSinceModeSwitch===0));
  }
});
test('sham and healthy separation remain synthetic controls',()=>{
  const r=runLineageStudy(opts);
  for(const id of ['separate','sham-switch']){
    const t=from(r,id);
    assert.ok(t.every(x=>!x.hiddenRiskForScorer));
    assert.ok(t.every(x=>x.declaredGraph.state==='NO_DOCUMENTED_OVERLAP'));
  }
});
test('scores reconcile with receipts and abstention is always unresolved',()=>{
  const r=runLineageStudy(opts);
  for(const m of r.metrics){
    assert.equal(m.total,r.trialReceipts.length);
    assert.equal(m.utility,r.trialReceipts.reduce((v,t)=>v+t.judgments[m.id].utility,0));
    assert.equal(m.correct+m.falseAssurances+m.falseFlags+m.unresolved,m.total);
  }
  const a=r.metrics.find(x=>x.id==='abstain');
  assert.equal(a.unresolved,a.total);assert.equal(a.utility,0);
});
test('invalid trial sizes are rejected',()=>{
  for(const v of [{seed:0},{repetitions:13},{steps:19},{steps:81},{steps:25},{seed:1.2}])
    assert.throws(()=>runLineageStudy(v),/integer|divisible/);
});

