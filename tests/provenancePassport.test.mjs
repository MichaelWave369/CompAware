import test from 'node:test';
import assert from 'node:assert/strict';
import {provenanceScenarios,auditProvenance,dependencyLabel} from '../src/data/provenancePassport.js';

const get = id => provenanceScenarios.find(s=>s.id===id);

test('documented shared dependencies are traced transitively through different display paths',()=>{
 const shared=auditProvenance(get('power-clock'));
 assert.equal(shared.state,'DOCUMENTED_OVERLAP');
 assert.deepEqual(shared.shared,['clock-main','power-main']);
 const copied=auditProvenance(get('copy-path'));
 assert.equal(copied.state,'DOCUMENTED_OVERLAP');
 assert.ok(copied.shared.includes('canonical-feed'));
 assert.ok(copied.shared.includes('daq-core'));
 assert.equal(copied.verifiedIndependent,false);
});

test('apparently separate paths do not become certified independent',()=>{
 const out=auditProvenance(get('documented-separate'));
 assert.equal(out.state,'NO_DOCUMENTED_OVERLAP');
 assert.equal(out.shared.length,0);
 assert.equal(out.unknown.length,0);
 assert.equal(out.verifiedIndependent,false);
 assert.match(out.label,/still unverified/i);
});

test('missing or explicitly unverified ancestry must not be silently interpreted as isolation',()=>{
 const out=auditProvenance(get('unknown-path'));
 assert.equal(out.state,'INCOMPLETE_PROVENANCE');
 assert.deepEqual(out.unknown,['external-certificate']);
 assert.equal(out.verifiedIndependent,false);
 const altered={nodes:[{id:'a',dependencies:['not-in-inventory']},{id:'b',dependencies:[]}],leftRoot:'a',rightRoot:'b'};
 assert.deepEqual(auditProvenance(altered).unknown,['not-in-inventory']);
 assert.equal(auditProvenance(altered).state,'INCOMPLETE_PROVENANCE');
});

test('probe-mode multiplexer is recognized as an upstream common path',()=>{
 const out=auditProvenance(get('probe-mode'));
 assert.equal(out.state,'DOCUMENTED_OVERLAP');
 assert.ok(out.shared.includes('mux-shared'));
 assert.equal(dependencyLabel(get('probe-mode'),'mux-shared'),'Test-mode multiplexer');
});

test('graph cycles terminate; shared roots cannot be independent',()=>{
 const loop={nodes:[{id:'a',dependencies:['b']},{id:'b',dependencies:['a']}],leftRoot:'a',rightRoot:'b'};
 const out=auditProvenance(loop);
 assert.deepEqual(out.shared,['a','b']);
 assert.equal(out.verifiedIndependent,false);
});

test('bad graph input and duplicate identifiers are rejected',()=>{
 assert.throws(()=>auditProvenance(null),/Expected/);
 assert.throws(()=>auditProvenance({nodes:[{id:'a'},{id:'a'}],leftRoot:'a',rightRoot:'a'}),/unique/);
});

test('atlas declares alternatives and bounded nonexperimental status',()=>{
 assert.equal(provenanceScenarios.length,5);
 assert.equal(new Set(provenanceScenarios.map(s=>s.id)).size,5);
 for(const item of provenanceScenarios){
   assert.ok(item.intervention.length>30);
   assert.ok(item.counterexample.length>30);
   assert.ok(item.question.length>30);
   const audit=auditProvenance(item);
   assert.equal(audit.evidenceClass,'DECLARED_TOPOLOGY_NOT_MEASURED_CAUSAL_INDEPENDENCE');
 }
});
