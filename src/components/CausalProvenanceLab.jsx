import { useState } from 'react';
import { Activity, ArrowRight, Download, FlaskConical, GitCompareArrows, ShieldCheck, ShieldAlert } from 'lucide-react';
import { runCausalStudy, CONDITIONS, WORLDS } from '../sim/causalStudy.js';

const pct=n=>typeof n==='number'?(100*n).toFixed(1)+'%':'—';
const dec=n=>typeof n==='number'?n.toFixed(3):'—';
const readableVerdict=v=>v==='common'?'Shared cause':v==='independent'?'Independent':'Insufficient evidence';

export default function CausalProvenanceLab(){
  const [seed,setSeed]=useState('369');
  const [repetitions,setRepetitions]=useState('4');
  const [steps,setSteps]=useState('48');
  const [result,setResult]=useState(null);
  const [condition,setCondition]=useState('passive');
  const [error,setError]=useState('');
  const run=()=>{
    try{
      const output=runCausalStudy({seed:Number(seed),repetitions:Number(repetitions),steps:Number(steps)});
      setResult(output);setError('');
    }catch(e){setResult(null);setError(e.message);}
  };
  const download=()=>{
    if(!result)return;
    const url=URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:'application/json'}));
    const a=document.createElement('a');
    a.href=url;a.download='compaware-causal-r6-'+result.settings.seed+'.json';
    document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  };
  const selected=result?.scenarios.find(s=>s.id===condition);
  const passiveA=result?.trace.filter(r=>r.condition==='passive'&&r.worldForScorer==='independent')??[];
  const passiveB=result?.trace.filter(r=>r.condition==='passive'&&r.worldForScorer==='common')??[];
  const passiveIdentical=result?passiveA.length===passiveB.length&&
    passiveA.every((r,i)=>r.reports===passiveB[i].reports):false;
  const isolatedA=result?.trace.filter(r=>r.condition==='isolation'&&r.worldForScorer==='independent')??[];
  const isolatedB=result?.trace.filter(r=>r.condition==='isolation'&&r.worldForScorer==='common')??[];
  const isolationChanges=Boolean(result)&&isolatedA.some((r,i)=>r.interventionAnnounced&&r.reports!==isolatedB[i]?.reports);
  const detail=[
    {name:'Passive',desc:'No anchor, no intervention. Identical report streams cannot establish which hidden world generated them.'},
    {name:'Trusted anchor',desc:'An independently generated reference is correct 98% of the time, which policies assume.'},
    {name:'Corrupted anchor',desc:'Actual reference accuracy falls to 60%, but anchor policies still assume 98%.'},
    {name:'Shared-source anchor',desc:'A supposedly independent anchor copies the primary report 97% of the time.'},
    {name:'Isolation',desc:'A declared intervention removes common-mode failure only in the common-cause world.'},
    {name:'Placebo',desc:'An announced isolation intervention changes nothing physically. Inferring an effect is unjustified.'},
    {name:'Combined evidence',desc:'A 98%-reliable reference and effective isolation are provided together.'},
  ];
  return <div className="r6-lab">
    <header className="r6-header">
      <div className="r6-kicker"><FlaskConical size={17}/> CA-HAVEN R6 / CAUSAL PROVENANCE</div>
      <h3>Three witnesses.<br/><em>One hidden source.</em></h3>
      <p>Can a bounded computational controller distinguish real independent evidence from shared failure? Run two observationally identical hidden worlds, then add a costly anchor or a declared intervention. Test the same policies against corrupted anchors and placebo interventions.</p>
    </header>
    <div className="r6-controls">
      <label>SEED<input aria-label="Causal study seed" type="number" min="1" max="999999" step="1" value={seed} onChange={e=>setSeed(e.target.value)}/></label>
      <label>REPEATS / WORLD<input aria-label="Causal study repetitions" type="number" min="1" max="12" step="1" value={repetitions} onChange={e=>setRepetitions(e.target.value)}/></label>
      <label>REPORTS / TRIAL<input aria-label="Causal study steps" type="number" min="16" max="64" step="1" value={steps} onChange={e=>setSteps(e.target.value)}/></label>
      <button type="button" onClick={run}><Activity size={16}/> Run causal comparison</button>
    </div>
    {error&&<p role="alert" className="r6-error">{error}</p>}
    {!result&&<div className="r6-empty"><FlaskConical size={26}/><span>Run a deterministic study to inspect the evidence. No sample results are preloaded.</span></div>}
    {result&&<div className="r6-results">
      <div className="r6-summary-head"><div><strong>Auditable simulated results</strong><small>{result.trialSummaries.length} total trials across {CONDITIONS.length} conditions and {WORLDS.length} hidden worlds</small></div>
        <button type="button" onClick={download}><Download size={16}/> Download JSON receipt</button></div>
      <div className="r6-evidence">
        <div className="r6-evidence-heading"><GitCompareArrows size={20}/><strong>Does new evidence break the ambiguity?</strong></div>
        <div className="r6-evidence-grid">
          <div><span>PASSIVE REPORTS</span><strong className={passiveIdentical?'r6-good':'r6-bad'}>{passiveIdentical?'IDENTICAL':'DIFFERENT'}</strong><p>Both hidden worlds produce the same report sequence for each matching seed.</p></div>
          <div><span>AFTER EFFECTIVE ISOLATION</span><strong className={isolationChanges?'r6-good':'r6-bad'}>{isolationChanges?'DISTINGUISHABLE SAMPLES':'NO DIVERGENCE SEEN'}</strong><p>When the common cause is actually removed, the distributions change under the stated model.</p></div>
        </div>
        <p>These are software-generated observations, not physical measurements. A changed sample after intervention is only interpretable when the intervention's causal effect is justified. The placebo condition tests that assumption.</p>
      </div>
      <div className="r6-condition-picker"><label htmlFor="r6-condition">SELECT EXPERIMENT</label>
        <select id="r6-condition" value={condition} onChange={e=>setCondition(e.target.value)}>
          {CONDITIONS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>
      {selected&&<div className="r6-condition-results">
        <div className="r6-condition-context">
          <div><strong>{selected.label}</strong><p>{detail[CONDITIONS.findIndex(c=>c.id===selected.id)]?.desc}</p></div>
          <span>{result.settings.repetitions*WORLDS.length} WORLD TRIALS</span>
        </div>
        <div className="r6-table-scroll"><table>
          <thead><tr><th>Policy</th><th>Correct</th><th>Wrong</th><th>Unresolved</th><th>Anchor purchases</th><th>Mean utility</th><th>Brier error</th></tr></thead>
          <tbody>{selected.metrics.map(m=><tr key={m.id}>
            <th scope="row">{m.label}</th>
            <td>{m.correct}</td><td>{m.incorrect}</td><td>{m.abstained}</td><td>{m.purchases}</td><td>{dec(m.meanUtility)}</td><td>{dec(m.brier)}</td>
          </tr>)}</tbody>
        </table></div>
        <div className="r6-trial-excerpt">
          <strong>One trial's declared conclusions</strong>
          <div className="r6-trial-grid">{WORLDS.map(world=>{
            const example=result.trialSummaries.find(t=>t.condition===condition&&t.worldForScorer===world.id&&t.repetition===0);
            return <article key={world.id}><span>SCORER WORLD: {world.label}</span>
              {['naive','anchor','causal','combined','guarded'].map(id=><div key={id}>
                <span>{selected.metrics.find(m=>m.id===id)?.label}</span>
                <strong>{readableVerdict(example?.decisions[id].verdict)}</strong>
              </div>)}
            </article>;
          })}</div>
        </div>
      </div>}
      <div className="r6-meaning"><ShieldAlert size={19}/><div><strong>Correct abstention is an allowed result.</strong>
        <p>In passive observation the rival models are mathematically indistinguishable under these assumptions. A model claiming certainty there is overconfident, even if it guesses the right world. Calibration errors and wrong assumptions can make additional evidence misleading.</p></div></div>
      <p className="r6-receipt"><ShieldCheck size={15}/> {result.protocol} · Seed {result.settings.seed} · Anchor cost {result.modelAssumptions.costs.anchorCost} per sample · Only scorer has world identity and truth · <strong>No awareness score</strong></p>
    </div>}
    <div className="r6-disclaimer"><ShieldCheck size={17}/><p>All controllers are fixed algorithms using simulated reports. An apparently independent anchor may be compromised; an announced intervention may be a placebo. This is exploratory model comparison, not independent preregistration, physical evidence, or proof of Computational Awareness or subjective experience.</p></div>
  </div>;
}

