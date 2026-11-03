import { useState } from 'react';
import { Network, AlertTriangle, ArrowRight, Microscope } from 'lucide-react';
import { threeWitnessWorlds } from '../data/independenceIllusion.js';

const pct=x=>(x*100).toFixed(1)+'%';

export default function IndependenceIllusion() {
  const [commonRate,setCommonRate]=useState(20);
  const world=threeWitnessWorlds({commonFailureRate:commonRate/100});

  return (
    <details className="independence-expander">
      <summary>
        <span className="independence-summary-name"><Network aria-hidden="true" size={20}/>
          <span><small>CA-SC-04 / NEW COSMOS QUESTION</small><strong>The Independence Illusion</strong></span>
        </span>
        <span className="independence-summary-hint">Explore a three-witness counterexample</span>
      </summary>
      <div className="independence-body">
        <h3>Three voices.<br/><em>One shared mistake.</em></h3>
        <p className="independence-intro">If three sensors secretly fail together, an observer can mistake agreement for independent confirmation. This mathematical example constructs <strong>two different hidden worlds with exactly the same complete eight-outcome report distribution.</strong> It is an analytical illustration, not a measured experiment.</p>

        <div className="independence-settings">
          <label htmlFor="independence-common-rate">Hidden common-mode failure chance <strong>{commonRate}%</strong></label>
          <input id="independence-common-rate" type="range" min="0" max="40" step="5" value={commonRate}
            onChange={event=>setCommonRate(Number(event.target.value))}/>
          <div className="independence-range-labels"><span>0% · independent</span><span>40% · more shared failures</span></div>
        </div>

        <div className="independence-world-grid">
          <div className="independence-world">
            <span className="independence-tag">HYPOTHETICAL WORLD I</span>
            <h4>Truly independent</h4>
            <div className="independence-value">{pct(world.matchedIndependentAccuracy)}</div>
            <p>Actual accuracy of each individual sensor, assuming conditional independence.</p>
          </div>
          <div className="independence-world independence-world-shared">
            <span className="independence-tag">HYPOTHETICAL WORLD C</span>
            <h4>One hidden common cause</h4>
            <div className="independence-value">{pct(world.trueSharedSensorAccuracy)}</div>
            <p>Actual accuracy of each sensor when a shared event flips all three readings. Otherwise, each sensor is 90% accurate.</p>
          </div>
        </div>

        <div className="independence-contrast">
          <AlertTriangle size={19} aria-hidden="true"/>
          <div><strong>Naive independence-based estimate: {pct(world.matchedIndependentAccuracy)}</strong>
            <p>In the shared-failure world, that {commonRate===0?'matches the true reliability because no common failure is present':`overstates the actual ${pct(world.trueSharedSensorAccuracy)} reliability by ${(world.overestimate*100).toFixed(1)} percentage points`}. Pairwise agreement is {pct(world.pairwiseAgreement)} in both hypothetical worlds.</p>
          </div>
        </div>

        <div className="independence-report-heading"><Microscope aria-hidden="true" size={18}/>
          <strong>Complete observer-visible report distribution</strong>
          <span>MODEL EXPECTATIONS · NOT SAMPLES</span>
        </div>
        <div className="independence-matrix" role="table" aria-label="Three-sensor report patterns and matched model probabilities">
          <div className="independence-matrix-header" role="row">
            <span role="columnheader">Triple report</span>
            <span role="columnheader">Independent</span>
            <span role="columnheader">Shared failure</span>
          </div>
          {world.rows.map(row=><div className="independence-matrix-row" key={row.pattern} role="row">
            <span role="cell" className="independence-pattern">{row.pattern}</span>
            <span role="cell">{pct(row.independent)}</span>
            <span role="cell">{pct(row.shared)}</span>
          </div>)}
        </div>
        <p className="independence-warning"><strong>The limitation:</strong> Under balanced binary truth, symmetric errors, stationary mechanisms, and this exact shared-failure construction, the three readings alone cannot identify which hidden world generated them. More witnesses do not automatically equal independent evidence.</p>
        <div className="independence-next"><strong>Engineering handoff · Rung 6 proposal</strong>
          <p>Test costly trusted anchors, corrupted anchors, and bounded interventions on shared dependencies. Include a no-identification control, a simple agreement tracker, and a policy that admits insufficient evidence. No perfect verifier may be silently smuggled into a controller.</p>
          <a href="https://github.com/MichaelWave369/CompAware/blob/main/docs/INDEPENDENCE_ILLUSION.md" target="_blank" rel="noreferrer">Read CA-SC-04 research design <ArrowRight aria-hidden="true" size={15}/></a>
        </div>
      </div>
    </details>
  );
}
