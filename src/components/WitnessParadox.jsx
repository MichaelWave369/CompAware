import { useState } from 'react';
import { Eye, ShieldAlert, ArrowRight, Split } from 'lucide-react';
import { WITNESS_MODEL, matchingReliability, observablePairs } from '../data/witnessParadox.js';

const percent = value => (value*100).toFixed(0) + '%';

export default function WitnessParadox() {
  const [selectedA, setSelectedA] = useState(95);
  const a = selectedA / 100;
  const b = matchingReliability(a);
  const base = WITNESS_MODEL.reference;
  const baselinePairs = observablePairs(base.a, base.b);
  const alternativePairs = observablePairs(a, b);

  return (
    <section className="witness-lab" aria-label="CA-SC-03 two-witness identifiability thought experiment">
      <div className="witness-heading">
        <div className="witness-kicker"><Eye size={17} aria-hidden="true"/> CA-SC-03 / THE TWO-WITNESS PROBLEM</div>
        <h3>Two witnesses.<br/><em>One unanswered truth.</em></h3>
        <p>Two instruments can produce <strong>exactly the same observable reports</strong> even when their hidden individual accuracies are different. Explore an analytical counterexample, not a measurement of actual hardware.</p>
      </div>

      <div className="witness-worlds">
        <article className="witness-world">
          <div className="witness-world-label">HYPOTHETICAL WORLD 1 <span>FIXED</span></div>
          <h4>Equal reliability</h4>
          <div className="witness-readouts"><div><span>Sensor A accuracy</span><strong>{percent(base.a)}</strong></div><div><span>Sensor B accuracy</span><strong>{percent(base.b)}</strong></div></div>
          <div className="witness-agreement">Expected agreement <strong>{percent(WITNESS_MODEL.targetAgreement)}</strong></div>
        </article>
        <article className="witness-world witness-world-alternate">
          <div className="witness-world-label">HYPOTHETICAL WORLD 2 <span>ADJUSTABLE</span></div>
          <h4>Unequal reliability</h4>
          <div className="witness-readouts"><div><span>Sensor A accuracy</span><strong>{percent(a)}</strong></div><div><span>Sensor B accuracy</span><strong>{percent(b)}</strong></div></div>
          <label htmlFor="witness-a-range">Change hidden accuracy of sensor A <strong>{percent(a)}</strong></label>
          <input id="witness-a-range" type="range" min="70" max="95" step="5" value={selectedA}
            onChange={(event) => setSelectedA(Number(event.target.value))}/>
          <div className="witness-range-ends"><span>70%</span><span>95%</span></div>
          <div className="witness-agreement">Expected agreement <strong>{percent(WITNESS_MODEL.targetAgreement)}</strong></div>
        </article>
      </div>

      <div className="witness-observations">
        <div className="witness-section-title"><Split size={17} aria-hidden="true"/>
          <strong>Observer-visible model probabilities</strong><span>IDENTICAL PROBABILITIES</span>
        </div>
        <div className="witness-distribution" role="table" aria-label="Observable pair frequencies in both hypothetical worlds">
          <div role="row" className="witness-distribution-header"><span role="columnheader">Pair of reports</span><span role="columnheader">World 1</span><span role="columnheader">World 2</span></div>
          {baselinePairs.map((entry, index) => (
            <div className="witness-distribution-row" role="row" key={entry.id}>
              <span role="cell">{entry.label}</span>
              <div role="cell" className="witness-bar-cell"><div className="witness-bar"><div style={{width:percent(entry.probability)}} /></div><strong>{percent(entry.probability)}</strong></div>
              <div role="cell" className="witness-bar-cell"><div className="witness-bar"><div style={{width:percent(alternativePairs[index].probability)}} /></div><strong>{percent(alternativePairs[index].probability)}</strong></div>
            </div>
          ))}
        </div>
      </div>

      <div className="witness-conclusion">
        <ShieldAlert size={21} aria-hidden="true"/>
        <div><strong>Agreement is not accuracy.</strong>
          <p>These worlds cannot be distinguished using just their two report streams under the displayed model assumptions. A system that invents a unique reliability estimate from the agreement alone is overclaiming what it knows.</p>
        </div>
      </div>
      <div className="witness-assumptions">
        <span>REQUIRED ASSUMPTIONS · THIS COUNTEREXAMPLE</span>
        <ul>{WITNESS_MODEL.assumptions.map(item => <li key={item}>{item}</li>)}</ul>
      </div>
      <div className="witness-handoff"><div><strong>For the Haven engineering lane</strong><p>Rung 4 uses perfect, delayed verification labels. The next question is what happens when that verifier drifts, shares an error source, or labels the wrong moment in time. Add simple baselines and an honest “not identifiable” condition.</p></div>
        <a href="https://github.com/MichaelWave369/CompAware/blob/main/docs/TWO_WITNESS_PROBLEM.md" target="_blank" rel="noreferrer">Read CA-SC-03 design handoff <ArrowRight size={15} aria-hidden="true"/></a>
      </div>
      <p className="witness-boundary">ANALYTICAL THOUGHT EXPERIMENT ONLY · No sampled runs, hidden cosmic signals, device measurements or consciousness claims.</p>
    </section>
  );
}
