import { useState } from 'react';
import { ArrowRight, GitCompareArrows, CircleHelp } from 'lucide-react';
import { interventionMirror } from '../data/interventionTransport.js';

const percent = value => (value*100).toFixed(1)+'%';

export default function InterventionMirror() {
  const [postIndependent, setPostIndependent]=useState(90);
  const scenario=interventionMirror({afterIndependentAccuracy:postIndependent/100});
  return (
    <details className="mirror-panel">
      <summary><span className="mirror-title"><GitCompareArrows size={20} aria-hidden="true"/>
        <span><small>CA-SC-05 · NEW COSMOS INQUIRY</small><strong>The Intervention Mirror</strong></span>
      </span><span className="mirror-hint">Explore when changing the system doesn't identify the cause</span></summary>
      <div className="mirror-body">
        <h3>We changed something.<br/><em>What did we actually learn?</em></h3>
        <p className="mirror-intro">Two fundamentally different hidden mechanisms can produce the same sensor reports <strong>before AND after</strong> a declared intervention. The report frequencies genuinely change, yet the mechanism remains ambiguous. These are exact model probabilities, not laboratory measurements.</p>
        <div className="mirror-control">
          <label htmlFor="mirror-post-accuracy">Independent-world accuracy after intervention <strong>{postIndependent}%</strong></label>
          <input id="mirror-post-accuracy" type="range" min="85" max="95" step="1" value={postIndependent} onChange={v=>setPostIndependent(Number(v.target.value))}/>
          <div><span>85%</span><span>95%</span></div>
        </div>
        <div className="mirror-phase-grid">
          <article className="mirror-phase">
            <div className="mirror-phase-label">BEFORE / SAME OBSERVABLE LAW</div>
            <div className="mirror-accuracy">
              <div><span>Independent sensor accuracy</span><strong>{percent(scenario.before.independentReliability)}</strong></div>
              <div><span>Shared-failure sensor accuracy</span><strong>{percent(scenario.before.commonActualReliability)}</strong></div>
            </div>
            <div className="mirror-agree">Pairwise agreement <strong>{percent(scenario.before.reportPairAgreement)}</strong></div>
          </article>
          <article className="mirror-phase mirror-phase-after">
            <div className="mirror-phase-label">AFTER / SAME OBSERVABLE LAW</div>
            <div className="mirror-accuracy">
              <div><span>Independent sensor accuracy</span><strong>{percent(scenario.after.independentReliability)}</strong></div>
              <div><span>Shared-failure sensor accuracy</span><strong>{percent(scenario.after.commonActualReliability)}</strong></div>
            </div>
            <div className="mirror-agree">Pairwise agreement <strong>{percent(scenario.after.reportPairAgreement)}</strong></div>
          </article>
        </div>
        <div className="mirror-report-heading"><CircleHelp size={18} aria-hidden="true"/>
          <strong>All eight triple reports, same between worlds within each phase</strong>
          <span>THEORETICAL PROBABILITIES</span>
        </div>
        <div className="mirror-matrix" role="table" aria-label="Exact observer-visible report pattern probabilities before and after intervention">
          <div className="mirror-matrix-row mirror-matrix-head" role="row"><span role="columnheader">Triple</span><span role="columnheader">Before / either world</span><span role="columnheader">After / either world</span></div>
          {scenario.rows.map(row => <div className="mirror-matrix-row" role="row" key={row.pattern}>
            <span role="cell" className="mirror-pattern">{row.pattern}</span>
            <span role="cell">{percent(row.beforeIndependent)}</span>
            <span role="cell">{percent(row.afterIndependent)}</span>
          </div>)}
        </div>
        <div className="mirror-conclusion"><strong>Observed change ≠ identified cause</strong>
          <p>We can observe that the reporting statistics changed after an intervention. We cannot determine from these reports alone whether the change came from isolating a common cause, altering individual sensor accuracy, or both. Every number shown comes from two deliberately matched mathematical models.</p>
        </div>
        <div className="mirror-next"><strong>Handoff for the engineering lane · Rung 7 proposal</strong>
          <p>Test selective isolation against interventions with hidden side effects, known-state anchors, sham switches, and return-to-baseline tests. Require a controller to preserve multiple compatible explanations when the evidence cannot identify a unique cause.</p>
          <a href="https://github.com/MichaelWave369/CompAware/blob/main/docs/INTERVENTION_MIRROR.md" target="_blank" rel="noreferrer">Read CA-SC-05 research design <ArrowRight size={16} aria-hidden="true"/></a>
        </div>
        <p className="mirror-boundary">MODEL ASSUMPTIONS: balanced binary truth · symmetric stationary-within-phase errors · three exchangeable sensors · exact constructed common-failure mechanism. Not actual silicon telemetry, cosmic influence, or consciousness evidence.</p>
      </div>
    </details>
  );
}
