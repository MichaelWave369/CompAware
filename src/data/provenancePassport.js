/**
 * CA-SC-06 · Provenance Passport.
 *
 * This is a graph-based audit of DECLARED dependency lineage, not a sensor
 * measurement, independence test, trustworthy reference certificate, causal
 * proof, or consciousness assessment.
 *
 * No declared overlap != verified causal independence. A missing/unknown edge
 * must not be treated as evidence that a dependency is absent.
 */
export const provenanceScenarios = Object.freeze([
  {
    id: 'power-clock', label: 'Shared clock and power', question: 'Can two nominally different instruments fail together?',
    nodes: [
      {id:'sensor-a',label:'Sensor A',dependencies:['adc-a','clock-main','power-main']},
      {id:'adc-a',label:'Digitizer A',dependencies:['firmware-a']},
      {id:'firmware-a',label:'Firmware A',dependencies:[]},
      {id:'reference-b',label:'Reference B',dependencies:['adc-b','clock-main','power-main']},
      {id:'adc-b',label:'Digitizer B',dependencies:['firmware-b']},
      {id:'firmware-b',label:'Firmware B',dependencies:[]},
      {id:'clock-main',label:'Shared clock',dependencies:[]},
      {id:'power-main',label:'Shared power',dependencies:[]},
    ],
    leftRoot:'sensor-a', rightRoot:'reference-b',
    intervention:'Power-cycle only the shared supply while holding clocks and stimulus fixed; compare simultaneous failure patterns with separate-supply control.',
    counterexample:'Two independent-looking readouts can agree because both inherited the same voltage or timing disturbance.',
  },
  {
    id: 'copy-path', label: 'Copied upstream data', question: 'Can separately named logs contain just one measurement?',
    nodes: [
      {id:'sensor-a',label:'Sensor A display',dependencies:['canonical-feed']},
      {id:'reference-b',label:'Reference B display',dependencies:['format-b','certificate-store']},
      {id:'format-b',label:'Format adapter B',dependencies:['canonical-feed']},
      {id:'canonical-feed',label:'One original measurement',dependencies:['daq-core']},
      {id:'daq-core',label:'Acquisition pipeline',dependencies:[]},
      {id:'certificate-store',label:'Certificate storage',dependencies:[]},
    ],
    leftRoot:'sensor-a', rightRoot:'reference-b',
    intervention:'Inject a tagged, controlled mismatch before the upstream feed and check whether both downstream displays copy it identically.',
    counterexample:'Distinct signatures and file paths do not imply independent readings when the underlying acquired bits are the same.',
  },
  {
    id: 'documented-separate', label: 'Documented separation', question: 'What does no listed shared dependency actually establish?',
    nodes: [
      {id:'sensor-a',label:'Sensor A',dependencies:['acq-a','clock-a','power-a']},
      {id:'acq-a',label:'Acquisition A',dependencies:[]},
      {id:'clock-a',label:'Clock A',dependencies:[]},
      {id:'power-a',label:'Power A',dependencies:[]},
      {id:'reference-b',label:'Reference B',dependencies:['acq-b','clock-b','power-b']},
      {id:'acq-b',label:'Acquisition B',dependencies:[]},
      {id:'clock-b',label:'Clock B',dependencies:[]},
      {id:'power-b',label:'Power B',dependencies:[]},
    ],
    leftRoot:'sensor-a', rightRoot:'reference-b',
    intervention:'Test independent fault injections and a shared ambient disturbance; confirm separation against measured outcomes, not merely a wiring diagram.',
    counterexample:'A missing graph edge could hide an ambient common cause or an undocumented dependency. No listed overlap is not proof of independence.',
  },
  {
    id: 'unknown-path', label: 'Unknown reference origin', question: 'What should a vessel report when a certificate has incomplete lineage?',
    nodes: [
      {id:'sensor-a',label:'Sensor A',dependencies:['acq-a']},
      {id:'acq-a',label:'Known acquisition',dependencies:[]},
      {id:'reference-b',label:'Claimed reference',dependencies:['external-certificate']},
      {id:'external-certificate',label:'Third-party certificate',dependencies:[],unknown:true},
    ],
    leftRoot:'sensor-a',rightRoot:'reference-b',
    intervention:'Request independent evidence of the certificate acquisition path. Until available, mark independence unresolved and avoid treating the label as truth.',
    counterexample:'A signed claim may authenticate who supplied a reading without establishing how it was measured.',
  },
  {
    id: 'probe-mode', label: 'Probe-mode coupling', question: 'Does the act of checking a sensor change its measurement pathway?',
    nodes: [
      {id:'sensor-a',label:'Ordinary sensor path',dependencies:['mux-shared','adc-a']},
      {id:'adc-a',label:'Digitizer A',dependencies:[]},
      {id:'reference-b',label:'Known-input certificate',dependencies:['probe-controller','mux-shared']},
      {id:'probe-controller',label:'Probe controller',dependencies:['probe-clock']},
      {id:'probe-clock',label:'Probe clock',dependencies:[]},
      {id:'mux-shared',label:'Test-mode multiplexer',dependencies:[]},
    ],
    leftRoot:'sensor-a',rightRoot:'reference-b',
    intervention:'Randomize probe versus ordinary modes, record mode-switch timing and restore/retest; vary input independently to detect test-mode calibration and hysteresis.',
    counterexample:'A certificate may correctly describe the injected bit while its test multiplexer changes ordinary-channel reliability.',
  },
]);

const byId = scenario => new Map(scenario.nodes.map(node => [node.id,node]));

function trace(scenario, root) {
  const nodes=byId(scenario), visited=new Set(), pending=[root], unknown=new Set();
  while(pending.length>0) {
    const id=pending.pop();
    if(visited.has(id)) continue;
    visited.add(id);
    const node=nodes.get(id);
    if(!node) { unknown.add(id); continue; }
    if(node.unknown) unknown.add(id);
    if(!Array.isArray(node.dependencies)) {unknown.add(id);continue;}
    for(const dep of node.dependencies)pending.push(dep);
  }
  return { ids:[...visited].sort(), unknown:[...unknown].sort() };
}

export function auditProvenance(scenario) {
  if(!scenario||!Array.isArray(scenario.nodes)||!scenario.leftRoot||!scenario.rightRoot)
    throw new TypeError('Expected two roots and a declared node inventory');
  const ids=scenario.nodes.map(x=>x.id);
  if(ids.some(x=>typeof x!=='string'||x.length===0)||new Set(ids).size!==ids.length)
    throw new TypeError('Node IDs must be nonempty and unique');
  const left=trace(scenario,scenario.leftRoot);
  const right=trace(scenario,scenario.rightRoot);
  const rightIds=new Set(right.ids);
  const shared=left.ids.filter(id=>rightIds.has(id));
  const unknown=[...new Set([...left.unknown,...right.unknown])].sort();
  const state=shared.length?'DOCUMENTED_OVERLAP':unknown.length?'INCOMPLETE_PROVENANCE':'NO_DOCUMENTED_OVERLAP';
  return {
    state, shared, unknown, left:left.ids,right:right.ids,
    label:state==='DOCUMENTED_OVERLAP'
      ? 'Declared common dependencies found. Causal independence is not established.'
      :state==='INCOMPLETE_PROVENANCE'
      ? 'Reference lineage is incomplete. Causal independence remains unresolved.'
      : 'No shared dependency is recorded. Independence is still unverified.',
    verifiedIndependent:false,
    evidenceClass:'DECLARED_TOPOLOGY_NOT_MEASURED_CAUSAL_INDEPENDENCE',
  };
}

export function dependencyLabel(scenario,id) {
  return byId(scenario).get(id)?.label ?? id+' (not documented)';
}
