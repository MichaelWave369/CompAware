import { useState } from 'react';
import { Activity, Database, Download, FlaskConical, Play, ShieldCheck } from 'lucide-react';
import { runCalibrationStudy, CONDITIONS } from '../sim/calibrationStudy.js';

const fmt = x => typeof x === 'number' && Number.isFinite(x) ? x.toFixed(3) : '—';

export default function CalibrationLab() {
  const [seed, setSeed] = useState('369');
  const [development, setDevelopment] = useState('3');
  const [heldout, setHeldout] = useState('8');
  const [steps, setSteps] = useState('32');
  const [interval, setInterval] = useState('4');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [partition, setPartition] = useState('heldout');

  const run = () => {
    try {
      const report = runCalibrationStudy({
        seed: Number(seed), developmentTrials: Number(development),
        heldoutTrials: Number(heldout), steps: Number(steps), verifyEvery: Number(interval),
      });
      setResult(report); setError('');
    } catch (e) { setError(e.message); setResult(null); }
  };
  const exportJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = 'compaware-calibration-r4-' + result.settings.seed + '.json';
    a.href = url;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };
  const active = result?.byPartition.find(p => p.id === partition);
  const rows = result?.byCondition.filter(p => p.partition === partition) ?? [];
  const count = active?.metrics[0].total ?? 0;

  return <div className="cal-lab">
    <div className="cal-intro">
      <div className="cal-tag"><FlaskConical size={17}/> HAVEN R4 / EPISTEMIC CHALLENGE</div>
      <h3>Can a vessel detect when<br/><em>its own sensor changes?</em></h3>
      <p>The simulated sensor becomes less reliable without telling any controller. Everyone gets the same initial signals and periodically receives the same independent verification, <strong>after</strong> decisions. Each pays for every verification. Optional second samples cost extra. Compare a calibrated filter, a simple recent-error tracker, frozen calibration, and conservative rules.</p>
    </div>
    <div className="cal-controls">
      <label>SEED<input type="number" min="1" max="999999" step="1" value={seed} onChange={e => setSeed(e.target.value)} /></label>
      <label>DEVELOPMENT TRIALS<input type="number" min="1" max="6" step="1" value={development} onChange={e => setDevelopment(e.target.value)} /></label>
      <label>HELD-OUT TRIALS<input type="number" min="1" max="16" step="1" value={heldout} onChange={e => setHeldout(e.target.value)} /></label>
      <label>STEPS PER TRIAL<input type="number" min="12" max="50" step="1" value={steps} onChange={e => setSteps(e.target.value)} /></label>
      <label>VERIFY EVERY N STEPS<input type="number" min="2" max="10" step="1" value={interval} onChange={e => setInterval(e.target.value)} /></label>
      <button onClick={run}><Play size={16}/> Run study</button>
    </div>
    {error && <p className="cal-error" role="alert">{error}</p>}
    {!result && <div className="cal-empty"><Activity size={25}/><p>No fabricated values. Run a deterministic trial to generate outcomes, with every decision available for auditing.</p></div>}
    {result && <div className="cal-results">
      <div className="cal-results-top">
        <div><strong>Instrumented results</strong><small>{result.trace.length} decisions per policy across both partitions</small></div>
        <button onClick={exportJson}><Download size={15}/> Export complete JSON receipt</button>
      </div>
      <div className="cal-tabs" role="group" aria-label="Choose evaluation partition">
        <button aria-pressed={partition === 'heldout'} className={partition === 'heldout' ? 'selected' : ''} onClick={() => setPartition('heldout')}>Held-out seed partition</button>
        <button aria-pressed={partition === 'development'} className={partition === 'development' ? 'selected' : ''} onClick={() => setPartition('development')}>Development seed partition</button>
      </div>
      <p className="cal-clarifier">This is a deterministic seed partition inside an <strong>exploratory</strong> protocol, not independently preregistered confirmatory evidence. Each policy made {count} decisions under this partition.</p>
      <div className="cal-table-wrap"><table>
        <thead><tr><th>Controller</th><th>Mean utility</th><th>Hazardous continues</th><th>False fallbacks</th><th>Paid rechecks</th><th>Brier error</th></tr></thead>
        <tbody>{active?.metrics.map(m => <tr key={m.id}>
          <th scope="row">{m.label}</th>
          <td>{fmt(m.meanUtility)}</td><td>{m.risky}</td>
          <td>{m.needlessFallback}</td><td>{m.rechecks}</td><td>{fmt(m.brierError)}</td>
        </tr>)}</tbody>
      </table></div>
      <div className="cal-conditions">
        {rows.map(s => <article key={s.id}>
          <strong>{s.label}</strong>
          <span>{CONDITIONS.find(c => c.id === s.id)?.startAccuracy * 100}% → {CONDITIONS.find(c => c.id === s.id)?.endAccuracy * 100}% hidden true accuracy</span>
          <div>{s.metrics.map(m => <p key={m.id}><span>{m.label}</span><b>{fmt(m.meanUtility)}</b></p>)}</div>
        </article>)}
      </div>
      <div className="cal-receipt"><Database size={20}/><div><strong>Research receipt, not an awareness certificate</strong><p>Every trace includes signal values, hidden truth for independent scoring, delayed verification labels, costs, inferred reliability and controller decisions. Inspect the failures, especially where simple controllers match or outperform the elaborate one.</p></div></div>
    </div>}
    <div className="cal-boundary"><ShieldCheck size={17}/><p>Only synthetic binary indicators and fixed algorithms are used. Ground truth and the true sensor reliability are withheld from controller decision functions. The simulated verification oracle supplies delayed labels at a declared cost. <strong>No conclusion about Computational Awareness or subjective experience follows.</strong></p></div>
  </div>;
}

