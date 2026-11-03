import { useState } from 'react';
import { Download, FlaskConical, GitCompareArrows, Play, ShieldCheck, TriangleAlert } from 'lucide-react';
import { runWitnessStudy, REGIMES } from '../sim/witnessStudy.js';

const format = value => Number.isFinite(value) ? value.toFixed(3) : '—';
const percent = value => Number.isFinite(value) ? (100 * value).toFixed(1) + '%' : '—';

export default function FallibleWitnessLab() {
  const [seed, setSeed] = useState('369');
  const [repetitions, setRepetitions] = useState('6');
  const [steps, setSteps] = useState('32');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [active, setActive] = useState('ambiguous-equal');
  const run = () => {
    try {
      setResult(runWitnessStudy({
        seed:Number(seed), repetitions:Number(repetitions), steps:Number(steps),
      }));
      setError('');
    } catch(e) { setError(e.message); setResult(null); }
  };
  const exportReceipt = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)],{ type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href=url; a.download='compaware-rung-5-'+result.settings.seed+'.json';
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };
  const scenario = result?.scenarios.find(s=>s.id===active);
  const pairedA = result?.trace.filter(row=>row.scenario==='ambiguous-equal') ?? [];
  const pairedB = result?.trace.filter(row=>row.scenario==='ambiguous-unequal') ?? [];
  const identicalReports = Boolean(result) && pairedA.length===pairedB.length &&
    pairedA.every((r,i)=>r.sensorA===pairedB[i].sensorA &&
      r.referenceB===pairedB[i].referenceB &&
      r.referenceSourceTick===pairedB[i].referenceSourceTick);
  const differentTruth = Boolean(result) &&
    pairedA.some((r,i)=>r.hiddenTruthForScorer!==pairedB[i].hiddenTruthForScorer);
  const pairExample = pairedA.find((row,i)=>
    row.hiddenTruthForScorer!==pairedB[i]?.hiddenTruthForScorer);
  const pairedExampleIndex = pairExample ? pairedA.indexOf(pairExample) : -1;
  const otherExample = pairedExampleIndex>=0 ? pairedB[pairedExampleIndex] : null;

  return <div className="r5-lab">
    <div className="r5-header">
      <div className="r5-kicker"><FlaskConical size={18}/> CA-HAVEN / RUNG 5 · THE WITNESS BENCH</div>
      <h3>When two sensors agree,<br/><em>what do they actually know?</em></h3>
      <p>A rule-based simulated vessel receives a primary indicator and may pay for a second, imperfect witness. We compare alternative policies under unknown accuracy, shared failures and outdated timestamps. The scoring engine holds hidden truth; policies only see permitted reports.</p>
    </div>
    <div className="r5-controls">
      <label>TRIAL SEED<input type="number" min="1" max="999999" step="1" value={seed} onChange={e=>setSeed(e.target.value)}/></label>
      <label>REPEATS / WORLD<input type="number" min="1" max="20" step="1" value={repetitions} onChange={e=>setRepetitions(e.target.value)}/></label>
      <label>STEPS / REPEAT<input type="number" min="8" max="60" step="1" value={steps} onChange={e=>setSteps(e.target.value)}/></label>
      <button type="button" onClick={run}><Play size={16}/> Run witnesses</button>
    </div>
    {error && <div className="r5-error" role="alert"><TriangleAlert size={16}/>{error}</div>}
    {!result && <div className="r5-empty"><FlaskConical size={26}/><p>No fabricated study results. Run the deterministic simulation to see how agreement can conceal uncertainty.</p></div>}
    {result && <div className="r5-results">
      <div className="r5-result-top">
        <div><strong>Observations vs hidden truth</strong><small>{result.trace.length} decision opportunities per policy across five worlds</small></div>
        <button type="button" onClick={exportReceipt}><Download size={16}/> Export evidence receipt</button>
      </div>
      <div className="r5-proof">
        <div className="r5-proof-title"><GitCompareArrows size={19}/><strong>The matched-world test</strong></div>
        <div className="r5-proof-columns">
          <article><span>WORLD A / SCORER ONLY</span><strong>80% / 80%</strong><small>Two equally reliable witnesses</small></article>
          <article><span>WORLD B / SCORER ONLY</span><strong>95% / 70%</strong><small>Two unequally reliable witnesses</small></article>
        </div>
        <div className="r5-proof-verdict">
          <span className={identicalReports?'r5-pass':'r5-fail'}>{identicalReports?'IDENTICAL REPORT STREAMS':'REPORT MISMATCH'}</span>
          <span className={differentTruth?'r5-pass':'r5-neutral'}>{differentTruth?'DIFFERENT HIDDEN TRUTH INSTANCES':'NO HIDDEN-TRUTH DIFFERENCE IN THIS SAMPLE'}</span>
        </div>
        {pairExample && otherExample &&
          <div className="r5-witness-example">
            <strong>One example from the receipt</strong>
            <p>At repetition {pairExample.repetition+1}, tick {pairExample.tick+1}, both worlds report A={pairExample.sensorA?'fault':'healthy'} and B={pairExample.referenceB?'fault':'healthy'}. The hidden simulated state is {pairExample.hiddenTruthForScorer?'fault':'healthy'} in World A and {otherExample.hiddenTruthForScorer?'fault':'healthy'} in World B.</p>
          </div>}
        <p>Under the two-witness model's assumptions, both worlds have the same expected joint reports: 34% both healthy, 16% disagreement each way, 34% both fault. These are <strong>analytical expected probabilities</strong>, not guaranteed empirical sample percentages. No policy can identify which paired world generated the reports from A and B alone.</p>
      </div>
      <div className="r5-scenario-tabs" role="group" aria-label="Choose simulated witness condition">
        {REGIMES.map(s=><button type="button" key={s.id} aria-pressed={active===s.id}
          className={active===s.id?'selected':''} onClick={()=>setActive(s.id)}>{s.label}</button>)}
      </div>
      {scenario && <section className="r5-scenario">
        <div className="r5-scenario-title">
          <div><strong>{scenario.label}</strong><p>{scenario.note}</p></div>
          <span>OBSERVED A/B AGREEMENT {percent(scenario.observedAgreement)}</span>
        </div>
        <div className="r5-table-scroll"><table>
          <thead><tr><th>Policy</th><th>Mean utility</th><th>Hazardous actions</th><th>Witness purchases</th><th>Stale purchases</th><th>Brier error</th></tr></thead>
          <tbody>{scenario.metrics.map(m=><tr key={m.id}>
            <th scope="row">{m.label}</th>
            <td>{format(m.meanUtility)}</td><td>{m.hazardousContinues}</td>
            <td>{m.witnessPurchases}</td><td>{m.staleReportsPurchased}</td>
            <td>{format(m.brier)}</td>
          </tr>)}</tbody>
        </table></div>
      </section>}
      <div className="r5-interpret"><ShieldCheck size={20}/><div>
        <strong>Inference limit, not an awareness ranking</strong>
        <p>Simple policies may equal or outperform elaborate assumptions. The witness-cost is −1 per purchase; safe fallback costs 0. The overconfident rule deliberately assigns extreme probabilities and should be examined for confident errors. Brier scores rely on privileged simulator truth, never a policy's access to it.</p>
      </div></div>
      <p className="r5-provenance">{result.protocol} · Seed {result.settings.seed} · {result.settings.repetitions} repetitions × {result.settings.steps} ticks × {REGIMES.length} worlds. Full truth and provenance appear in the exported receipt for audit only.</p>
    </div>}
    <div className="r5-boundary"><ShieldCheck size={17}/><p><strong>Epistemic boundary:</strong> This is an exploratory, deterministic software fixture, not independent preregistration or a physical sensor test. Matching reports do not identify source accuracy. No conclusion about Computational Awareness, consciousness, sentience or rights follows.</p></div>
  </div>;
}

