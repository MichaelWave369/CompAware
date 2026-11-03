import { useState } from 'react';
import { Activity, Download, FlaskConical, GitCompareArrows, ShieldCheck, TriangleAlert } from 'lucide-react';
import { runTransportStudy, REGIMES, POLICIES, SETTINGS } from '../sim/transportStudy.js';

const fixed=n=>Number.isFinite(n)?n.toFixed(3):'—';
const rate=n=>Number.isFinite(n)?(n*100).toFixed(1)+'%':'—';
export default function TransportabilityLab(){
  const [seed,setSeed]=useState('369');
  const [repetitions,setRepetitions]=useState('4');
  const [steps,setSteps]=useState('36');
  const [result,setResult]=useState(null);
  const [selected,setSelected]=useState('mirror');
  const [error,setError]=useState('');
  const run=()=>{
    try{
      setResult(runTransportStudy({seed:Number(seed),repetitions:Number(repetitions),steps:Number(steps)}));
      setError('');
    }catch(e){setError(e.message);setResult(null);}
  };
  const download=()=>{
    if(!result)return;
    const blob=new Blob([JSON.stringify(result,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='compaware-r7-transport-'+result.settings.seed+'.json';
    document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  };
  const visible=result?.scenarios.find(x=>x.id===selected);
  const paired=(mode,world)=>result?.trace.filter(x=>x.condition===mode&&x.worldForScorer===world)??[];
  const mirrorA=paired('mirror','independent'),mirrorB=paired('mirror','common');
  const matched=!!result&&mirrorA.length===mirrorB.length&&
    mirrorA.every((row,i)=>row.reports===mirrorB[i].reports);
  const naturalPaired=!!result&&REGIMES.every(regime=>{
    const a=paired(regime.id,'independent').filter(x=>!x.probeOffered);
    const b=paired(regime.id,'common').filter(x=>!x.probeOffered);
    return a.length===b.length&&a.every((x,i)=>x.reports===b[i].reports);
  });
  const challenged=result?.trace.filter(x=>x.condition==='tampered'&&x.probeOffered&&
    x.knownInputForScorer!==x.claimedLabelForScorer).length??0;
  return <div className="r7-lab">
    <div className="r7-head">
      <span className="r7-kicker"><FlaskConical size={18}/> CA-HAVEN / RUNG 7 · TRANSPORTABILITY</span>
      <h3>We changed the system.<br/><em>Did we identify the cause?</em></h3>
      <p>Two hidden mechanisms yield exactly the same ordinary three-sensor reports before, during and after the declared intervention. Introduce a known digital input, then test whether corrupt input certificates or a probe-only change undermine what the controller concludes.</p>
    </div>
    <div className="r7-controls">
      <label>SEED<input aria-label="Rung 7 seed" type="number" min="1" max="999999" step="1" value={seed} onChange={e=>setSeed(e.target.value)}/></label>
      <label>REPEATS PER WORLD<input aria-label="Rung 7 repetitions" type="number" min="1" max="12" step="1" value={repetitions} onChange={e=>setRepetitions(e.target.value)}/></label>
      <label>TICKS PER TRIAL<input aria-label="Rung 7 steps" type="number" min="18" max="72" step="6" value={steps} onChange={e=>setSteps(e.target.value)}/></label>
      <button type="button" onClick={run}><Activity size={17}/> Run transport study</button>
    </div>
    {error&&<p className="r7-error" role="alert"><TriangleAlert size={16}/>{error}</p>}
    {!result&&<div className="r7-empty"><FlaskConical size={24}/><p>No canned findings. Run the simulation to generate a deterministic, inspectable report.</p></div>}
    {result&&<div className="r7-results">
      <div className="r7-result-top"><div><strong>Generated trial evidence</strong><span>{result.trials.length} policy trials across {REGIMES.length} conditions</span></div>
        <button type="button" onClick={download}><Download size={16}/> Export JSON receipt</button>
      </div>
      <div className="r7-proof">
        <div className="r7-proof-title"><GitCompareArrows size={21}/><strong>Observational equivalence check</strong></div>
        <div className="r7-proof-grid">
          <div><span>PASSIVE MIRROR</span><strong>{matched?'IDENTICAL':'MISMATCH'}</strong><p>Both hidden worlds generate precisely the same sampled report triples in all three phases.</p></div>
          <div><span>UNPROBED TICKS / ALL REGIMES</span><strong>{naturalPaired?'IDENTICAL':'MISMATCH'}</strong><p>Ordinary observations alone never identify the hidden mechanism in this construction.</p></div>
          <div><span>CORRUPTED INPUT CERTIFICATES</span><strong>{challenged}</strong><p>Probe inputs whose reported label disagrees with the scorer's actual injected bit.</p></div>
        </div>
        <p>Analytical distributions are matched intentionally, not discovered experimentally. A controlled-input probe is additional evidence only if its input is independently validated and its measurement path represents the system under normal operation.</p>
      </div>
      <div className="r7-select"><label htmlFor="r7-regime">EXPERIMENTAL CONDITION</label>
        <select id="r7-regime" value={selected} onChange={e=>setSelected(e.target.value)}>
          {REGIMES.map(x=><option value={x.id} key={x.id}>{x.label}</option>)}
        </select></div>
      {visible&&<section className="r7-detail">
        <div className="r7-detail-heading">
          <div><strong>{visible.label}</strong><p>{selected==='mirror'
            ? 'No controlled input; the hidden worlds are observationally identical.'
            :selected==='sham'
            ? 'The experiment announces a switch, but the underlying report law remains unchanged.'
            :selected==='probes'
            ? 'Paid probes supply claimed known-input labels that are correct in this fixture.'
            :selected==='tampered'
            ? 'Some claimed known-input labels are false. Controllers are not told which ones.'
            : 'The probe uses a different measurement mechanism than ordinary sensor operation.'}</p></div>
          <span>{repetitions} REPEATS / WORLD</span>
        </div>
        <div className="r7-table-scroll"><table>
          <thead><tr><th>Policy</th><th>Correct</th><th>Wrong</th><th>Unresolved</th><th>Probe purchases</th><th>Mean utility</th><th>Brier error</th></tr></thead>
          <tbody>{visible.metrics.map(m=><tr key={m.id}>
            <th scope="row">{m.label}</th><td>{m.correct}</td><td>{m.wrong}</td>
            <td>{m.unresolved}</td><td>{m.purchases}</td><td>{fixed(m.meanUtility)}</td><td>{fixed(m.brier)}</td>
          </tr>)}</tbody>
        </table></div>
        <div className="r7-trial">
          <strong>First paired trial · same algorithm, two hidden worlds</strong>
          <div>{['independent','common'].map(world=>{
            const one=result.trials.find(x=>x.condition===selected&&x.worldForScorer===world&&x.repetition===0);
            return <article key={world}><span>SCORER-ONLY WORLD: {world.toUpperCase()}</span>
              {POLICIES.map(policy=><div key={policy.id}><span>{policy.label}</span><strong>{one?.decisions[policy.id].verdict==='unresolved'?'Insufficient evidence':one?.decisions[policy.id].verdict}</strong></div>)}
            </article>;
          })}</div>
        </div>
      </section>}
      <div className="r7-takeaway"><ShieldCheck size={21}/><div><strong>Correct abstention is a result, too.</strong>
        <p>Watch the cost of each controlled-input probe ({SETTINGS.probeCost} utility), alongside wrong declarations and calibrated uncertainty. Comparing utility alone is not proof of a model's general ability, and a test that changes the measurement path may not transfer to ordinary operation.</p>
      </div></div>
      <p className="r7-receipt">{result.protocol} · {result.settings.repetitions} repeats × {result.settings.steps} ticks × {REGIMES.length} conditions × two hidden worlds · Truth and probe integrity are scorer-only, available in the exported audit receipt.</p>
    </div>}
    <div className="r7-boundary"><ShieldCheck size={18}/><p><strong>Research boundary:</strong> These are deterministic, rule-based simulated experiments. The known-input fixture and its integrity are assumptions to validate before any physical experiment. No model inference, consciousness or awareness detection, or independent preregistration is claimed.</p></div>
  </div>;
}

