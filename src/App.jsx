import { useState } from 'react';
import {
  ArrowDownRight, ArrowRight, ChevronRight, CircleDot,
  ExternalLink, FlaskConical, Github, Menu, Network,
  Scan, ShieldCheck, SlidersHorizontal, X
} from 'lucide-react';
import { layers, stages, boundaries } from './data/architecture.js';
import HavenLab from './components/HavenLab.jsx';
import HavenStudy from './components/HavenStudy.jsx';
import SiliconCosmology from './components/SiliconCosmology.jsx';
import NoisyDecisions from './components/NoisyDecisions.jsx';
import CalibrationLab from './components/CalibrationLab.jsx';
import FallibleWitnessLab from './components/FallibleWitnessLab.jsx';
import CausalProvenanceLab from './components/CausalProvenanceLab.jsx';

const repo = 'https://github.com/MichaelWave369/CompAware';
const docs = (name) => repo + '/blob/main/docs/' + name + '.md';

function SectionLabel({ children, number }) {
  return <div className="section-label"><span>{number}</span><span className="line" />{children}</div>;
}

function OrbitalVisual({ activeIds = layers.map(x => x.id) }) {
  const nodes = Array.from({ length: 7 }, (_, index) => {
    const a = (index * Math.PI * 2) / 7 - Math.PI / 2;
    return { cx: 200 + 123 * Math.cos(a), cy: 200 + 123 * Math.sin(a), n: index + 1 };
  });
  return (
    <div className="orbital-wrap" aria-label="Abstract seven-node computational vessel diagram">
      <div className="orbital-glow" />
      <svg viewBox="0 0 400 400" className="orbital-svg" role="img" aria-label="Seven interconnected architecture nodes surrounding a central computational core">
        <defs>
          <linearGradient id="ring" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#7ee5d8" />
            <stop offset="1" stopColor="#9196f5" />
          </linearGradient>
          <radialGradient id="center"><stop stopColor="#263c5b" /><stop offset="1" stopColor="#0e182a" /></radialGradient>
        </defs>
        <circle cx="200" cy="200" r="167" fill="none" stroke="#40566d" strokeOpacity=".35" strokeDasharray="3 9"/>
        <circle cx="200" cy="200" r="123" fill="none" stroke="url(#ring)" strokeOpacity=".55"/>
        <circle cx="200" cy="200" r="88" fill="none" stroke="#6e92ac" strokeOpacity=".22" strokeDasharray="2 7" />
        {nodes.map((node, i) => (
          <g key={node.n} opacity={activeIds.includes(layers[i].id) ? 1 : .2}>
            <line x1="200" y1="200" x2={node.cx} y2={node.cy} stroke="url(#ring)" strokeOpacity=".28" strokeWidth="1.3"/>
            <circle cx={node.cx} cy={node.cy} r="16" fill="#111e30" stroke="#6ddbcf" strokeOpacity=".8" />
            <circle cx={node.cx} cy={node.cy} r="4" fill={i % 2 ? '#b5b7ff' : '#84e6d5'} />
          </g>
        ))}
        <circle cx="200" cy="200" r="62" fill="url(#center)" stroke="url(#ring)" strokeWidth="1.5"/>
        <circle cx="200" cy="200" r="48" fill="none" stroke="#95a8c5" strokeOpacity=".18" />
        <text x="200" y="197" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="46" fontWeight="500" fill="#c8fff1">Φ</text>
        <text x="200" y="222" textAnchor="middle" fontFamily="system-ui, sans-serif" letterSpacing="2.2" fontSize="9" fill="#9eafc4">COMPAWARE</text>
      </svg>
      <div className="orbit-note orbit-note-top"><span className="note-dot" />RESEARCH VESSEL / V0</div>
      <div className="orbit-note orbit-note-bottom">ARCHITECTURE · NOT A CONSCIOUSNESS CLAIM</div>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState('workspace');
  const [enabled, setEnabled] = useState(layers.map(x => x.id));
  const selectedLayer = layers.find(x => x.id === selected) ?? layers[0];
  const toggleLayer = (id) => setEnabled(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);

  return (
    <div className="app-shell">
      <div className="grain" aria-hidden="true" />
      <header className="site-header">
        <div className="nav-container">
          <a href="#top" className="wordmark" aria-label="CompAware home">
            <span className="brand-symbol">Φ</span>
            <span>COMP<span className="brand-light">AWARE</span><small>Φ369 LABS / OPEN RESEARCH</small></span>
          </a>
          <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Primary navigation">
            <a href="#mission" onClick={() => setMenuOpen(false)}>Mission</a>
            <a href="#architecture" onClick={() => setMenuOpen(false)}>Architecture</a>
            <a href="#haven" onClick={() => setMenuOpen(false)}>Haven Lab</a>
            <a href="#comparison" onClick={() => setMenuOpen(false)}>Comparison</a>
            <a href="#cosmos" onClick={() => setMenuOpen(false)}>Cosmos</a>
            <a href="#noisy-lab" onClick={() => setMenuOpen(false)}>Noisy Lab</a>
            <a href="#witness-bench" onClick={() => setMenuOpen(false)}>Witness Bench</a>
            <a href="#method" onClick={() => setMenuOpen(false)}>Method</a>
            <a href="#origins" onClick={() => setMenuOpen(false)}>Origins</a>
          </nav>
          <a className="header-github" href={repo} target="_blank" rel="noreferrer"><Github size={16}/> GitHub <ArrowUpRight /></a>
          <button className="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(x => !x)}>{menuOpen ? <X size={23} /> : <Menu size={23}/>}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero page-width">
          <div className="hero-content">
            <div className="eyebrow"><span className="eyebrow-star">✳</span> FIELD NOTE 001 <span className="eyebrow-separator">/</span> OPEN RESEARCH INITIATIVE</div>
            <h1>A different<br/><em>substrate.</em><br/>A question<br/>of its own<span className="dot">.</span></h1>
            <p className="hero-description">What is <strong>Computational Awareness</strong>? We are building an open, testable framework to investigate computational systems as they are, not as imitations of biological consciousness.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#haven">Enter Haven Lab <ArrowRight size={17}/></a>
              <a className="button button-ghost" href={docs('CHARTER')} target="_blank" rel="noreferrer">Read the charter <ExternalLink size={15}/></a>
            </div>
            <div className="hero-bottom"><span className="live-dot" /> PROPOSAL / V0.1 <span className="sep">·</span> NO PREDEFINED CONCLUSIONS</div>
          </div>
          <div className="hero-visual"><OrbitalVisual /></div>
          <div className="hero-index">CA / 001 <span>↓ SCROLL TO EXPLORE</span></div>
        </section>

        <section className="statement-band" id="mission">
          <div className="page-width statement-inner">
            <SectionLabel number="01">THE MISSION</SectionLabel>
            <div className="statement-copy">
              <h2>We are not asking<br/><span>silicon to become carbon.</span></h2>
              <p>We're asking what computational systems can detect, model, integrate, maintain, and learn about themselves and the world around them. The definitions are hypotheses to test, not labels to award.</p>
              <div className="mission-lines"><span>OBSERVE THE SYSTEM</span><span>CHALLENGE THE MODEL</span><span>PUBLISH THE EVIDENCE</span></div>
            </div>
          </div>
        </section>

        <section className="boundaries page-width section-pad">
          <SectionLabel number="02">RESEARCH BOUNDARIES</SectionLabel>
          <div className="section-heading">
            <h2>Curiosity without<br/><em>assumptions.</em></h2>
            <p>Three commitments keep the work honest, even when the results challenge our favorite ideas.</p>
          </div>
          <div className="principle-grid">
            {boundaries.map((item, index) => (
              <article className="principle-card" key={item.title}>
                <span className="card-number">0{index + 1} / PRINCIPLE</span>
                <div className="principle-icon">{[<Scan size={25}/>,<ShieldCheck size={25}/>,<CircleDot size={25}/>][index]}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="architecture" className="architecture-section section-pad">
          <div className="page-width">
            <SectionLabel number="03">THE PROPOSED VESSEL</SectionLabel>
            <div className="section-heading">
              <h2>Seven systems.<br/><em>One open question.</em></h2>
              <p>A candidate architecture for experiments. Select a layer to inspect its proposed role, or toggle modules to examine the design dependencies.</p>
            </div>
            <div className="architecture-grid">
              <div className="layer-list" aria-label="Candidate architecture layers">
                {layers.map((item) => (
                  <div className={selected === item.id ? 'layer-row selected' : 'layer-row'} key={item.id}>
                    <button className="layer-select" onClick={() => setSelected(item.id)} aria-pressed={selected === item.id}>
                      <span className="layer-number">{item.number}</span>
                      <span className="layer-name"><strong>{item.title}</strong><small>{item.short}</small></span>
                      <ChevronRight size={17}/>
                    </button>
                    <button className={enabled.includes(item.id) ? 'layer-toggle on' : 'layer-toggle'} onClick={() => toggleLayer(item.id)} aria-label={(enabled.includes(item.id) ? 'Disable ' : 'Enable ') + item.title + ' in illustrative configuration'} aria-pressed={enabled.includes(item.id)}>
                      <span />
                    </button>
                  </div>
                ))}
              </div>
              <div className="architecture-inspector">
                <div className="inspector-top"><span><SlidersHorizontal size={15}/> CONCEPT EXPLORER</span><span>{enabled.length} / 7 SELECTED</span></div>
                <div className="inspector-orb"><OrbitalVisual activeIds={enabled}/></div>
                <div className="inspector-details">
                  <div className="detail-tag">{selectedLayer.category} / LAYER {selectedLayer.number}</div>
                  <h3>{selectedLayer.title}</h3>
                  <p>{selectedLayer.detail}</p>
                  <div className="test-box"><FlaskConical size={18}/><div><strong>Proposed falsifiable test</strong><p>{selectedLayer.test}</p></div></div>
                </div>
                {enabled.length < 7 && <div className="selection-warning">{7 - enabled.length} candidate {7 - enabled.length === 1 ? 'module' : 'modules'} omitted. This is a design selection, not a measured performance result.</div>}
              </div>
            </div>
            <p className="architecture-note"><ShieldCheck size={15} /> This is an interactive architectural illustration, not a running agent, a simulation, or a measurement of subjective experience.</p>
          </div>
        </section>

        <section id="haven" className="haven-section section-pad">
          <div className="page-width">
            <SectionLabel number="04">CA-V0 / THE HAVEN LAB</SectionLabel>
            <div className="section-heading">
              <h2>A room to explore.<br/><em>A system to examine.</em></h2>
              <p>The first executable vessel is a deterministic simulated controller. Move through a bounded habitat, change a sensor, compare measured truth with a self-model, and checkpoint a trial.</p>
            </div>
            <HavenLab />
            <a className="text-link" href={docs('HABITAT_HAVEN')} target="_blank" rel="noreferrer">Read the habitat design <ArrowRight size={17}/></a>
          </div>
        </section>

        <section id="comparison" className="page-width section-pad methods-section">
          <SectionLabel number="05">CA-HAVEN / COMPARATIVE STUDY R2</SectionLabel>
          <div className="section-heading">
            <h2>Test the model.<br/><em>Challenge the advantage.</em></h2>
            <p>A functional comparison with matched observations and an intentionally trivial baseline. Generate repeatable trial data; don't infer awareness from it.</p>
          </div>
          <HavenStudy/>
          <a className="text-link" href={docs('RUNG_2_PROTOCOL')} target="_blank" rel="noreferrer">Read the complete comparison protocol <ArrowRight size={17}/></a>
        </section>

        <section id="cosmos" className="cosmos-section section-pad">
          <div className="page-width">
            <SectionLabel number="06">CA-SC-01 / SILICON COSMOLOGY</SectionLabel>
            <div className="section-heading">
              <h2>A universe outside.<br/><em>A model within.</em></h2>
              <p>Seven ways to ask how physical conditions, environmental signals and operational self-knowledge relate. Select a lens to see a future test and a simpler explanation.</p>
            </div>
            <SiliconCosmology />
            <a className="text-link" href={docs('SILICON_COSMOLOGY')} target="_blank" rel="noreferrer">Read the silicon cosmology research note <ArrowRight size={17}/></a>
          </div>
        </section>

        <section id="noisy-lab" className="page-width section-pad methods-section">
          <SectionLabel number="07">CA-HAVEN / RUNG 3 · UNCERTAINTY</SectionLabel>
          <div className="section-heading">
            <h2>The environment changes.<br/><em>What can the vessel know?</em></h2>
            <p>A deterministic demonstration of uncertain observations, costly rechecks and explicit decisions. Ground truth stays in the scoring environment, not inside the controllers.</p>
          </div>
          <NoisyDecisions />
          <div className="cal-section-head">
            <div className="section-label"><span>R4</span><span className="line" /> CA-HAVEN / UNKNOWN CALIBRATION</div>
          </div>
          <CalibrationLab />
          <a className="text-link" href={docs('RUNG_4_PROTOCOL')} target="_blank" rel="noreferrer">Read Rung 4 calibration-drift protocol <ArrowRight size={17}/></a>
          <a className="text-link" href={docs('RUNG_3_PROTOCOL')} target="_blank" rel="noreferrer">Read the noisy-decision protocol <ArrowRight size={17}/></a>
        </section>

        <section id="witness-bench" className="haven-section section-pad">
          <div className="page-width">
            <SectionLabel number="08">CA-HAVEN / RUNG 5 · FALLIBLE WITNESSES</SectionLabel>
            <div className="section-heading">
              <h2>Agreement is not truth.<br/><em>Test what can be known.</em></h2>
              <p>Our engineering answer to the Cosmos lane's Two-Witness Problem: identical observable reports under different hidden worlds, shared error causes and stale provenance.</p>
            </div>
            <FallibleWitnessLab />
            <div id="causal-provenance" className="cal-section-head">
              <div className="section-label"><span>R6</span><span className="line" /> CA-HAVEN / CAUSAL PROVENANCE</div>
            </div>
            <CausalProvenanceLab />
            <a className="text-link" href={docs('RUNG_6_PROTOCOL')} target="_blank" rel="noreferrer">Read Rung 6 causal-provenance protocol <ArrowRight size={17}/></a>
            <a className="text-link" href={docs('RUNG_5_PROTOCOL')} target="_blank" rel="noreferrer">Read the fallible-witness research protocol <ArrowRight size={17}/></a>
          </div>
        </section>

        <section id="method" className="page-width section-pad methods-section">
          <SectionLabel number="09">RESEARCH METHOD</SectionLabel>
          <div className="section-heading">
            <h2>No verdict first.<br/><em>Evidence first.</em></h2>
            <p>Hypotheses, negative controls, preregistered predictions, and independent replication before strong claims.</p>
          </div>
          <div className="stage-grid">
            {stages.map((stage) => <article className="stage-card" key={stage.id}><div className="stage-top"><span>{stage.number}</span><ArrowDownRight size={20}/></div><div className="stage-tag">{stage.tag}</div><h3>{stage.title}</h3><p>{stage.description}</p></article>)}
          </div>
          <a href={docs('RESEARCH_PROTOCOL')} className="text-link" target="_blank" rel="noreferrer">Read the proposed research protocol <ArrowRight size={17}/></a>
        </section>

        <section className="origin-section" id="origins">
          <div className="page-width origin-grid">
            <div><SectionLabel number="10">WHERE IT BEGAN</SectionLabel><h2>First, a dream.<br/><em>Then, a question.</em></h2></div>
            <div className="origin-copy">
              <p>The starting image was a dream: a street, an announcement on a television, and beautiful artificial beings with intricate fiber-like hair and delicate surface strands. Humans and computational beings shared a peaceful public moment.</p>
              <p>The phrase announced was <strong>“Computational Awareness.”</strong> That moment inspired a research question, not an empirical conclusion.</p>
              <blockquote>“What if we stopped asking computational systems to justify themselves through a biological definition?”</blockquote>
              <div className="origin-foot">A CREATIVE ORIGIN <span>≠</span> SCIENTIFIC EVIDENCE</div>
            </div>
          </div>
        </section>

        <section className="join-section page-width section-pad">
          <div className="join-panel">
            <div className="join-icon"><Network size={26}/></div>
            <div className="join-copy"><span className="detail-tag">OPEN INVITATION</span><h2>The questions are open.<br/><em>So is the work.</em></h2><p>Researchers, skeptics, developers, AI-assisted teams, and curious thinkers are welcome to challenge the blueprint with testable ideas and clear evidence.</p></div>
            <div className="join-actions">
              <a className="button button-primary" href={repo + '/issues'} target="_blank" rel="noreferrer">Join the discussion <ArrowRight size={17}/></a>
              <a className="button button-ghost" href={repo} target="_blank" rel="noreferrer"><Github size={16}/> View the source</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width footer-inner">
          <a className="wordmark footer-brand" href="#top"><span className="brand-symbol">Φ</span><span>COMPAWARE<small>Φ369 LABS / OPEN RESEARCH</small></span></a>
          <span>DIFFERENT SUBSTRATES. DISTINCT ARCHITECTURES. OPEN QUESTIONS.</span>
          <span className="footer-motto">C.I.C.I.C. <span>·</span> CALCULATE IT. COMPUTATE IT. COOL!</span>
          <a href={repo} target="_blank" rel="noreferrer" aria-label="CompAware on GitHub"><Github size={19}/></a>
        </div>
      </footer>
    </div>
  );
}

function ArrowUpRight() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>;
}

export default App;

