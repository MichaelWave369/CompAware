import { useState } from 'react';
import { Activity, Download, FlaskConical, GitFork, ShieldAlert, ShieldCheck } from 'lucide-react';
import { REGIMES, POLICIES, runLineageStudy } from '../sim/lineageStudy.js';

const nice = value => value === 'flag-risk' ? 'Flag dependence risk' :
  value === 'provisional-separation' ? 'Provisionally separate' : 'Insufficient evidence';
const fixed = n => Number.isFinite(n) ? n.toFixed(2) : '—';
const pct = n => Number.isFinite(n) ? (n*100).toFixed(0)+'%' : '—';

export default function LineageLab() {
  const [seed,setSeed]=useState('369');
  const [repetitions,setRepetitions]=useState('4');
  const [steps,setSteps]=useState('40');
  const [report,setReport]=useState(null);
  const [selected,setSelected]=useState('hidden-coupling');
  const [error,setError]=useState('');
  const run=()=>{
    try{
      setReport(runLineageStudy({seed:Number(seed),repetitions:Number(repetitions),steps:Number(steps)}));
      setError('');
    }catch(e){setReport(null);setError(e.message);}
  };
  const exportReceipt=()=>{
    if(!report)return;
    const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));
    const a=document.createElement('a');
    a.download='compaware-r8-lineage-'+report.settings.seed+'.json';
    a.href=url;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  };
  const scenario=report?.scenarios.find(s=>s.id===selected);
  const example=report?.trialReceipts.find(t=>t.regime===selected&&t.repeat===0);
  const unusual=example?.observations.filter((s,i)=>{
    const cause=example.scorerOnly[i].cause;
    return cause!=='ordinary-independent-noise';
  }).slice(0,6)??[];
  return <div className="r8-lab">
    <header className="r8-head">
      <div className="r8-kicker"><GitFork size={18}/> CA-HAVEN R8 / SOURCE LINEAGE</div>
      <h3>Two receipts.<br/><em>One hidden dependency?</em></h3>
      <p>The provenance passport describes declared wiring and data ancestry. This simulated bench challenges those declarations with shared errors, copied data, unknown paths and lingering effects after probe mode. The reference may look separate without being causally independent.</p>
    </header>
    <div className="r8-controls">
      <label>SEED<input aria-label="R8 seed" type="number" min="1" max="999999" step="1" value={seed} onChange={e=>setSeed(e.target.value)}/></label>
      <label>REPEATS<input aria-label="R8 repeats" type="number" min="1" max="12" step="1" value={repetitions} onChange={e=>setRepetitions(e.target.value)}/></label>
      <label>TICKS / REPEAT<input aria-label="R8 steps" type="number" min="20" max="80" step="4" value={steps} onChange={e=>setSteps(e.target.value)}/></label>
      <button type="button" onClick={run}><Activity size={16}/> Run lineage audit</button>
    </div>
    {error&&<p role="alert" className="r8-error">{error}</p>}
    {!report&&<div className="r8-empty"><FlaskConical size={24}/><p>No preloaded conclusions. Run the fixed-rule simulation to generate its full audit trail.</p></div>}
    {report&&<div className="r8-results">
      <div className="r8-results-top"><div><strong>Instrumented synthetic results</strong><small>{report.trialReceipts.length} trials, {REGIMES.length} conditions, {POLICIES.length} fixed policies</small></div>
        <button type="button" onClick={exportReceipt}><Download size={16}/> Export complete receipt</button></div>
      <div className="r8-summary">
        <div><span>GRAPH-ONLY FALSE ASSURANCES</span><strong>{report.metrics.find(m=>m.id==='graph')?.falseAssurances}</strong></div>
        <div><span>GUARDED FALSE ASSURANCES</span><strong>{report.metrics.find(m=>m.id==='guarded')?.falseAssurances}</strong></div>
        <div><span>ABSTENTION POLICY</span><strong>{report.metrics.find(m=>m.id==='abstain')?.unresolved}</strong></div>
      </div>
      <div className="r8-select"><label htmlFor="r8-condition">SCENARIO</label>
        <select id="r8-condition" value={selected} onChange={e=>setSelected(e.target.value)}>
          {REGIMES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
        </select></div>
      {scenario&&example&&<section className="r8-scenario">
        <div className="r8-scenario-header">
          <div><strong>{scenario.label}</strong><p>Declared ancestry status: <b>{scenario.declaredGraphState.replaceAll('_',' ')}</b></p></div>
          <span>HIDDEN SIMULATOR RISK: {scenario.hiddenRiskForScorer?'PRESENT':'ABSENT'}</span>
        </div>
        <div className="r8-table-wrap"><table><thead><tr><th>Policy</th><th>Correct</th><th>False assurance</th><th>False flag</th><th>Unresolved</th><th>Mean utility</th></tr></thead>
          <tbody>{scenario.metrics.map(m=><tr key={m.id}>
            <th scope="row">{m.label}</th><td>{m.correct}</td><td>{m.falseAssurances}</td>
            <td>{m.falseFlags}</td><td>{m.unresolved}</td><td>{fixed(m.meanUtility)}</td>
          </tr>)}</tbody></table></div>
        <div className="r8-decisions">
          <strong>First repeat · competing judgments</strong>
          <div>{POLICIES.map(p=><article key={p.id}>
            <span>{p.label}</span><strong>{nice(example.judgments[p.id].decision)}</strong>
            <small>{example.judgments[p.id].basis}</small>
          </article>)}</div>
        </div>
        <div className="r8-telemetry">
          <div><span>PRIMARY ERROR / NORMAL</span><strong>{pct(example.judgments.history.features.primaryErrorNormal)}</strong></div>
          <div><span>PRIMARY ERROR / RETURN</span><strong>{pct(example.judgments.history.features.primaryErrorReturn)}</strong></div>
          <div><span>PRIMARY ERROR / WASHOUT</span><strong>{pct(example.judgments.history.features.primaryErrorWashout)}</strong></div>
          <div><span>SIMULTANEOUS ERRORS</span><strong>{example.judgments.history.features.jointlyWrong}</strong></div>
        </div>
        {unusual.length>0&&<details className="r8-events"><summary>Inspect simulated fault examples</summary>
          {unusual.map(s=><p key={s.tick}>T{s.tick} / {s.phase}: claimed input {s.claimedStimulus}, A={s.reportA}, R={s.reference}. Scorer cause: {example.scorerOnly[s.tick].cause}</p>)}
        </details>}
      </section>}
      <div className="r8-warning"><ShieldAlert size={21}/><div><strong>Separate receipts are not necessarily separate evidence.</strong><p>Even a graph with no recorded overlap can omit common power, clocks, preprocessing or environment. “Provisionally separate” means only that this fixed rule did not detect a dependency. It never means independently verified.</p></div></div>
      <p className="r8-receipt">{report.protocol} · Trial seed {report.settings.seed} · phase schedule: normal → probe → return → washout · synthetic injected truth is scorer-only in the exported audit.</p>
    </div>}
    <footer className="r8-boundary"><ShieldCheck size={18}/><p>These are synthetic software faults and authored dependency graphs, not physical measurements. No actual hardware independence, computational self-awareness, subjective experience, or sentience is established. The simple baselines are intentionally allowed to outperform more elaborate rules.</p></footer>
  </div>;
}

