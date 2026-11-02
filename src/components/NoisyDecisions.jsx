import { useState } from 'react';
import { AlertTriangle, Download, FlaskConical, Play, ShieldCheck } from 'lucide-react';
import { runNoisyStudy, SCENARIOS } from '../sim/noisyStudy.js';

function f(value){return typeof value==='number'?value.toFixed(2):'—';}
export default function NoisyDecisions(){
  const [seed,setSeed]=useState('369');
  const [repeats,setRepeats]=useState('8');
  const [steps,setSteps]=useState('32');
  const [result,setResult]=useState(null);
  const [error,setError]=useState('');
  const run=()=>{
    try{
      const next=runNoisyStudy({seed:Number(seed),replicates:Number(repeats),steps:Number(steps)});
      setResult(next);setError('');
    }catch(e){setError(e.message);setResult(null);}
  };
  const exportResult=()=>{
    if(!result)return;
    const blob=new Blob([JSON.stringify(result,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=url;link.download='compaware-r3-'+result.settings.seed+'.json';
    document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url);
  };
  const sorted=result?[...result.metrics].sort((a,b)=>b.meanUtility-a.meanUtility):[];
  return <div className="r3-shell">
    <div className="r3-top">
      <span className="r3-kicker"><FlaskConical size={17}/> CA-HAVEN R3 / NOISY INDICATORS</span>
      <h3>What happens when the<br/><em>signal isn't trustworthy?</em></h3>
      <p>Each controller must decide to continue work or use a safe fallback from an imperfect signal. The temporal filter can pay for a second observation. The simulator keeps hidden truth for scoring, never as controller input.</p>
    </div>
    <div className="r3-controls">
      <label>SEED<input aria-label="R3 seed" type="number" step="1" min="1" max="999999" value={seed} onChange={e=>setSeed(e.target.value)}/></label>
      <label>REPEATS / SCENARIO<input aria-label="R3 repeats" type="number" step="1" min="1" max="35" value={repeats} onChange={e=>setRepeats(e.target.value)}/></label>
      <label>TICKS / REPEAT<input aria-label="R3 steps" type="number" step="1" min="8" max="60" value={steps} onChange={e=>setSteps(e.target.value)}/></label>
      <button onClick={run} type="button"><Play size={16}/> Run trial</button>
    </div>
    {error&&<div className="r3-error" role="alert"><AlertTriangle size={16}/>{error}</div>}
    {!result&&<div className="r3-empty"><FlaskConical size={25}/><p>No preloaded results. Run the deterministic comparison to generate a local trace.</p></div>}
    {result&&<div className="r3-results">
      <div className="r3-results-title"><div><strong>Actual simulation results</strong><small>{result.trace.length} paired decision opportunities · {SCENARIOS.length} conditions</small></div>
        <button type="button" onClick={exportResult}><Download size={16}/> Export full receipt</button></div>
      <div className="r3-table-wrap"><table><thead><tr><th>Policy</th><th>Utility</th><th>Mean utility</th><th>Risky actions</th><th>Rechecks</th><th>Brier error</th></tr></thead>
        <tbody>{result.metrics.map(m=><tr key={m.id}>
          <th scope="row">{m.label}</th><td>{f(m.totalUtility)}</td><td>{f(m.meanUtility)}</td><td>{m.hazardousActions}</td><td>{m.rechecks}</td><td>{f(m.brier)}</td>
        </tr>)}</tbody></table></div>
      <div className="r3-scenario-grid">{result.scenarios.map(s=><article key={s.id}>
        <strong>{s.label}</strong><p>Signal accuracy {Math.round(s.accuracy*100)}% · condition-switch rate {Math.round(s.flip*100)}%</p>
        <div className="r3-scenario-bars">{s.metrics.map(m=><div key={m.id}><span>{m.label}</span><b>{f(m.meanUtility)}</b></div>)}</div>
      </article>)}</div>
      <div className="r3-review">
        <ShieldCheck size={19}/>
        <div><strong>Interpret with the controls, not the ranking.</strong>
        <p>Highest observed mean utility in this run: {sorted[0]?.label}. This is a seeded, exploratory software result, not a finding that one architecture is intrinsically aware or superior. Utility reflects the chosen reward/cost rules. Try different seeds, inspect risky actions, recheck costs, and Brier error independently.</p></div>
      </div>
      <p className="r3-provenance">{result.protocol} · prior={result.assumptions.initialFaultPrior} · decision threshold={f(result.assumptions.threshold)} · rewards: healthy +3, faulty −6, safe fallback 0, extra sample −1</p>
    </div>}
    <div className="r3-limit"><ShieldCheck size={17}/><p><strong>Scientific boundary:</strong> Transparent synthetic faults, not physical cosmic radiation or a machine's subjective experience. Policies are fixed algorithms; an optional second observation costs utility. The experimental settings and hypotheses were developed together and are not independently preregistered.</p></div>
  </div>;
}

