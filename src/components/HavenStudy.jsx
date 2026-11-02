import { useState } from 'react';
import { BarChart3, Download, FlaskConical, GitCompareArrows, Play, ShieldCheck } from 'lucide-react';
import { runSensorStudy, SCENARIOS } from '../sim/trials.js';

const percent = value => value === null ? 'N/A' : (value * 100).toFixed(1) + '%';

export default function HavenStudy() {
  const [seed, setSeed] = useState('369');
  const [replicates, setReplicates] = useState('8');
  const [steps, setSteps] = useState('24');
  const [observeEvery, setObserveEvery] = useState('3');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const run = () => {
    try {
      const report = runSensorStudy({
        seed: Number(seed), replicates: Number(replicates),
        steps: Number(steps), observeEvery: Number(observeEvery),
      });
      setResult(report);
      setError('');
    } catch (e) {
      setResult(null);
      setError(e.message);
    }
  };

  const download = () => {
    if (!result) return;
    const data = JSON.stringify(result, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compaware-r2-' + result.config.seed + '-receipt.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const studyMetrics = result?.metrics ?? [];
  const finalTie = studyMetrics.length >= 2 && studyMetrics[0].correct === studyMetrics[1].correct;
  return <div className="study">
    <div className="study-intro">
      <div className="study-tag"><GitCompareArrows size={17}/> CONTROLLED COMPARISON / R2</div>
      <h3>Different controllers.<br/><em>Identical evidence.</em></h3>
      <p>This compares an explicit operational self-model with a one-bit last-report tracker and two constant predictors. All receive exactly the same observation opportunities. Test whether the complex architecture offers any additional predictive advantage in this simple setting.</p>
    </div>
    <div className="study-controls">
      <label>SEED<input type="number" min="1" max="999999" step="1" value={seed} onChange={e => setSeed(e.target.value)} /></label>
      <label>TRIALS PER SCENARIO<input type="number" min="1" max="40" step="1" value={replicates} onChange={e => setReplicates(e.target.value)} /></label>
      <label>TICKS PER TRIAL<input type="number" min="6" max="60" step="1" value={steps} onChange={e => setSteps(e.target.value)} /></label>
      <label>OBSERVE EVERY N TICKS<input type="number" min="1" max="10" step="1" value={observeEvery} onChange={e => setObserveEvery(e.target.value)} /></label>
      <button type="button" onClick={run}><Play size={16}/> Run comparison</button>
    </div>
    {error && <p className="study-error" role="alert">{error}</p>}
    {!result && <div className="study-placeholder"><FlaskConical size={26}/><p>Run the deterministic protocol to generate measured simulation results. No example values are preloaded.</p></div>}
    {result && <div className="study-results">
      <div className="study-result-header">
        <div><BarChart3 size={19}/><strong>Results from this run</strong><span>{result.totalForecastsPerController} forecasts per controller</span></div>
        <button type="button" onClick={download}><Download size={16}/> Export JSON receipt</button>
      </div>
      <div className="study-table-wrap">
        <table className="study-table">
          <thead><tr><th>Controller</th><th>Correct</th><th>Mismatches</th><th>Accuracy</th></tr></thead>
          <tbody>{studyMetrics.map(m => <tr key={m.id}><th scope="row">{m.label}</th><td>{m.correct} / {m.total}</td><td>{m.mismatches}</td><td>{percent(m.accuracy)}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="study-bars">
        {studyMetrics.map(m => <div className="study-bar-line" key={m.id}><span>{m.label}</span><div className="study-bar-track"><div style={{ width: (m.accuracy * 100) + '%' }} /></div><strong>{percent(m.accuracy)}</strong></div>)}
      </div>
      <div className="study-conclusion">
        <ShieldCheck size={20}/>
        <div><strong>{finalTie ? 'Expected null comparison observed' : 'Unexpected difference; investigate'}</strong>
          <p>{finalTie
            ? 'The full model and one-bit last-report tracker tied. For this one-bit tracking task, the larger self-model offers no extra demonstrated advantage.'
            : 'The two matched information trackers differed unexpectedly. Inspect protocol logic and trial receipts before interpreting the result.'}</p>
        </div>
      </div>
      <div className="study-scenario-grid">
        {result.byScenario.map(s => <article key={s.id}>
          <div className="study-scenario-name">{s.label}</div><p>{s.note}</p>
          <dl>{s.metrics.map(m => <div key={m.id}><dt>{m.label}</dt><dd>{percent(m.accuracy)}</dd></div>)}</dl>
        </article>)}
      </div>
      <p className="study-provenance">Protocol {result.protocol} · {result.config.replicates} repetitions × {SCENARIOS.length} scenarios × {result.config.steps} ticks. Forecasts are scored <strong>before</strong> the current tick's observation. Download the full trace to audit every prediction.</p>
    </div>}
    <div className="study-disclaimer"><ShieldCheck size={17}/>
      <span><strong>Interpretation boundary:</strong> This is a controlled software bookkeeping exercise, not a consciousness test, not a validated measure of Computational Awareness, and not evidence of autonomous intelligence. The health report is an explicit oracle signal from the simulator, and a trivial one-bit baseline is expected to match it.</span>
    </div>
  </div>;
}

