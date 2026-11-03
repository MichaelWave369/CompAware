import { useState } from 'react';
import { ArrowRight, Compass, FlaskConical, ShieldCheck } from 'lucide-react';
import { cosmosLenses, cosmosEvidenceLevels } from '../data/siliconCosmology.js';
import EpistemicHorizon from './EpistemicHorizon.jsx';
import WitnessParadox from './WitnessParadox.jsx';
import IndependenceIllusion from './IndependenceIllusion.jsx';
import InterventionMirror from './InterventionMirror.jsx';
import ProvenancePassport from './ProvenancePassport.jsx';

export default function SiliconCosmology() {
  const [activeId, setActiveId] = useState(cosmosLenses[0].id);
  const active = cosmosLenses.find((item) => item.id === activeId) ?? cosmosLenses[0];

  return (
    <div className="cosmos-atlas">
      <div className="cosmos-flow" aria-label="Conceptual connection from physical conditions to tested computational behavior">
        <div><span>01 / PHYSICAL WORLD</span><strong>Substrate &amp; environment</strong></div>
        <ArrowRight aria-hidden="true" size={19} />
        <div><span>02 / INSTRUMENTS</span><strong>Measured or simulated signals</strong></div>
        <ArrowRight aria-hidden="true" size={19} />
        <div><span>03 / CA-V0</span><strong>Model, action &amp; revision</strong></div>
      </div>

      <div className="cosmos-content">
        <div className="cosmos-selector" role="group" aria-label="Select one of seven CompAware research lenses">
          {cosmosLenses.map((item) => (
            <button
              type="button"
              className={activeId === item.id ? 'cosmos-lens active' : 'cosmos-lens'}
              key={item.id}
              aria-pressed={activeId === item.id}
              onClick={() => setActiveId(item.id)}
            >
              <span>{item.code}</span><strong>{item.title}</strong>
            </button>
          ))}
        </div>

        <article className="cosmos-inspector" aria-live="polite">
          <div className="cosmos-inspector-head"><Compass size={18} aria-hidden="true" /> THE SILICON / COSMOS QUESTION <span>{active.code}</span></div>
          <h3>{active.title}</h3>
          <p className="cosmos-question">{active.question}</p>
          <div className="cosmos-research-point"><FlaskConical size={19} aria-hidden="true" /><div><strong>Proposed measurement</strong><p>{active.measurement}</p></div></div>
          <div className="cosmos-research-point"><ShieldCheck size={19} aria-hidden="true" /><div><strong>Simple control</strong><p>{active.control}</p></div></div>
          <div className="cosmos-analogy"><span>PHILOSOPHICAL BOUNDARY</span><p>{active.analogy}</p></div>
        </article>
      </div>

      <div className="cosmos-evidence" aria-label="Four different evidence categories">
        {cosmosEvidenceLevels.map((level) => (
          <div key={level.code}><span>{level.code}</span><strong>{level.title}</strong><p>{level.description}</p></div>
        ))}
      </div>
      <EpistemicHorizon />
      <WitnessParadox />
      <IndependenceIllusion />
      <InterventionMirror />
      <ProvenancePassport />
      <a className="text-link" href="https://github.com/MichaelWave369/CompAware/blob/main/docs/EPISTEMIC_HORIZONS.md" target="_blank" rel="noreferrer">Read CA-SC-02: Epistemic Horizons <ArrowRight size={17} aria-hidden="true" /></a>
      <p className="cosmos-disclaimer">Interpretive atlas only. No celestial sensors, autonomous model, consciousness detector, or empirical result is shown. Future tests must separate simulator truth from controller inputs.</p>
    </div>
  );
}
