import test from 'node:test';
import assert from 'node:assert/strict';
import {runCausalStudy,CONDITIONS,POLICIES,PROTOCOL,RULES} from '../src/sim/causalStudy.js';
const options={seed:369,repetitions:3,steps:48};
const by=(data,condition,world)=>data.trace.filter(r=>r.condition===condition&&r.worldForScorer===world);

test('same inputs yield byte-identical receipts and bounded lengths',()=>{
  const a=runCausalStudy(options),b=runCausalStudy(options);
  assert.equal(JSON.stringify(a),JSON.stringify(b));
  assert.equal(a.protocol,PROTOCOL);
  assert.equal(a.trace.length,CONDITIONS.length*2*options.repetitions*options.steps);
  assert.equal(a.trialSummaries.length,CONDITIONS.length*2*options.repetitions);
});
test('passive: independent and common worlds yield identical observed triples',()=>{
  const x=runCausalStudy(options);
  const a=by(x,'passive','independent'),b=by(x,'passive','common');
  assert.deepEqual(a.map(r=>r.reports),b.map(r=>r.reports));
  for(const trial of x.trialSummaries.filter(t=>t.condition==='passive'&&t.worldForScorer==='independent')){
    const other=x.trialSummaries.find(y=>y.condition==='passive'&&y.worldForScorer==='common'&&y.repetition===trial.repetition);
    for(const p of POLICIES) {
      assert.equal(trial.decisions[p.id].verdict,other.decisions[p.id].verdict);
      assert.equal(trial.decisions[p.id].probability,other.decisions[p.id].probability);
    }
  }
});
test('placebo intervention does not change the two worlds observable match',()=>{
  const x=runCausalStudy(options);
  assert.deepEqual(by(x,'placebo','independent').map(r=>r.reports),
    by(x,'placebo','common').map(r=>r.reports));
});
test('effective isolation has equal pre reports but can diverge post intervention',()=>{
  const x=runCausalStudy(options),a=by(x,'isolation','independent'),b=by(x,'isolation','common');
  assert.deepEqual(a.filter(r=>!r.interventionAnnounced).map(r=>r.reports),
    b.filter(r=>!r.interventionAnnounced).map(r=>r.reports));
  assert.ok(a.some((r,i)=>r.interventionAnnounced&&r.reports!==b[i].reports));
  assert.ok(b.some(r=>r.actualIsolationForScorer));
  assert.ok(a.every(r=>!r.actualIsolationForScorer));
});
test('witness values are only seen by purchased anchor policies',()=>{
  const x=runCausalStudy(options);
  for(const row of x.trace) {
    for(const policy of POLICIES) {
      const p=row.purchases[policy.id];
      assert.equal(p.seenAnchor,p.bought?row.anchorValueForScorer:null);
      if(p.bought)assert.equal(row.anchorOffered,true);
    }
  }
  for(const trial of x.trialSummaries) {
    for(const p of POLICIES) {
      const v=trial.decisions[p.id];
      const correct=v.verdict===trial.worldForScorer;
      const incorrect=v.verdict!=='unresolved'&&!correct;
      assert.equal(v.utility,(correct?RULES.correctDeclaration:
        incorrect?RULES.falseDeclaration:0)-RULES.anchorCost*v.purchases);
    }
  }
});
test('abstention and naive baselines expose the claim tradeoff',()=>{
  const x=runCausalStudy(options);
  const abstain=x.metrics.find(m=>m.id==='abstain');
  const naive=x.metrics.find(m=>m.id==='naive');
  assert.equal(abstain.abstained,abstain.total);
  assert.equal(abstain.purchases,0);
  assert.equal(abstain.totalUtility,0);
  assert.equal(naive.incorrect,naive.total/2);
  assert.equal(naive.overconfidentErrors,naive.total/2);
});
test('all metrics are finite and account for decisions',()=>{
  const x=runCausalStudy(options);
  for(const m of x.metrics) {
    assert.equal(m.total,x.trialSummaries.length);
    assert.equal(m.correct+m.incorrect+m.abstained,m.total);
    assert.ok(m.brier>=0&&m.brier<=1);
    assert.equal(m.meanUtility,m.totalUtility/m.total);
    assert.equal(m.totalUtility,x.scenarios.reduce((sum,s)=>sum+s.metrics.find(v=>v.id===m.id).totalUtility,0));
  }
});
test('analytic triple distribution equivalence holds',()=>{
  const x=runCausalStudy({seed:50,repetitions:1,steps:16});
  assert.ok(x.analytical.rows.every(row=>Math.abs(row.independent-row.shared)<1e-12));
  assert.equal(x.analytical.rows.length,8);
});
test('invalid inputs are rejected',()=>{
  for(const args of [{seed:0},{seed:1.3},{repetitions:13},{steps:15},{steps:65}])
    assert.throws(()=>runCausalStudy(args),/integer/);
});

