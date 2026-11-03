import { useState } from 'react';
import { Workflow, GitFork, ShieldQuestion, ArrowRight } from 'lucide-react';
import { provenanceScenarios, auditProvenance, dependencyLabel } from '../data/provenancePassport.js';

export default function ProvenancePassport() {
  const [activeId,setActiveId]=useState(provenanceScenarios[0].id);
  const scenario=provenanceScenarios.find(s=>s.id===activeId) ?? provenanceScenarios[0];
  const audit=auditProvenance(scenario);
  const shared=new Set(audit.shared);
  const unknown=new Set(audit.unknown);
  const renderPath=(ids,label)=>{
    return <div className="passport-path">
      <strong>{label}</strong>
      <div className="passport-chip-list">
        {ids.map(id=><span key={id} className={'passport-chip'+(shared.has(id)?' overlap':'')+(unknown.has(id)?' unknown':'')}>
          {dependencyLabel(scenario,id)}
          {shared.has(id)?' · SHARED':''}
          {unknown.has(id)?' · UNKNOWN':''}
        </span>)}
      </div>
    </div>;
  };
  return (
    <details className="passport-panel">
      <summary><span className="passport-summary">
        <Workflow size={20} aria-hidden="true"/>
        <span><small>CA-SC-06 · COSMOS INQUIRY</small><strong>The Provenance Problem</strong></span>
      </span><span className="passport-summary-hint">Explore declared sensor dependencies</span></summary>
      <div className="passport-body">
        <h3>Who verifies the <em>verifier?</em></h3>
        <p className="passport-intro">A reference may look independent while sharing its power, clock, upstream data or test-mode hardware with the sensor it checks. Select a hypothetical wiring or data-path example to audit <strong>declared ancestry</strong>. This is an evidence-design exercise, not real device telemetry.</p>
        <div className="passport-tabs" role="group" aria-label="Select a hypothetical provenance case">
          {provenanceScenarios.map(s=><button key={s.id} type="button"
            className={activeId===s.id?'passport-tab active':'passport-tab'}
            aria-pressed={activeId===s.id} onClick={()=>setActiveId(s.id)}>
              {s.label}
            </button>)}
        </div>
        <div className="passport-question"><GitFork size={18} aria-hidden="true"/>{scenario.question}</div>
        <div className="passport-paths">
          {renderPath(audit.left,'PATH A · READING UNDER TEST')}
          {renderPath(audit.right,'PATH B · PROPOSED REFERENCE')}
        </div>
        <div className="passport-finding" aria-live="polite">
          <div className="passport-finding-head"><ShieldQuestion size={19} aria-hidden="true"/>
            <span>{audit.state.replaceAll('_',' ')}</span>
          </div>
          <p>{audit.label}</p>
          <small>{audit.shared.length?audit.shared.length+' declared shared dependency nodes':
            audit.unknown.length?audit.unknown.length+' incomplete provenance nodes':
            'Zero listed shared nodes. That does not establish independence.'}</small>
        </div>
        <div className="passport-challenge-grid">
          <div><span>ALTERNATIVE EXPLANATION</span><p>{scenario.counterexample}</p></div>
          <div><span>PROPOSED FALSIFICATION TEST</span><p>{scenario.intervention}</p></div>
        </div>
        <p className="passport-limits"><strong>Important:</strong> This viewer reads an illustrative graph provided by its author. It does not inspect your PC, certify hardware independence, validate signed certificates or detect actual causal errors. Even an apparently separate graph may omit shared ambient conditions.</p>
        <div className="passport-handoff"><div><strong>Engineering handoff · Suggested Rung 8</strong>
          <p>Test declared source lineage, copied references, shared power/clock faults, probe-mode coupling and delayed recovery. Keep hidden truth scorer-only, compare against a simple graph-overlap rule and allow “insufficient evidence.”</p>
        </div>
          <a href="https://github.com/MichaelWave369/CompAware/blob/main/docs/PROVENANCE_PASSPORT.md" target="_blank" rel="noreferrer">Read CA-SC-06 protocol <ArrowRight size={16} aria-hidden="true"/></a>
        </div>
      </div>
    </details>
  );
}
