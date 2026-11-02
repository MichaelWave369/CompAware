import { useState } from 'react';
import { ArrowRight, BookOpenCheck } from 'lucide-react';
import { horizonStages, horizonChallenges } from '../data/epistemicHorizon.js';

export default function EpistemicHorizon() {
  const [stageId, setStageId] = useState('signal');
  const [challengeId, setChallengeId] = useState('calibration');
  const stage = horizonStages.find(s => s.id === stageId) ?? horizonStages[1];
  const challenge = horizonChallenges.find(c => c.id === challengeId) ?? horizonChallenges[0];

  return (
    <section className="horizon-panel" aria-label="CA-SC-02 Epistemic Horizons research questions">
      <div className="horizon-kicker"><BookOpenCheck size={18} aria-hidden="true" /> CA-SC-02 / EPISTEMIC HORIZONS <span>INTERPRETIVE RESEARCH</span></div>
      <h3>What can a vessel <em>actually know?</em></h3>
      <p className="horizon-lead">Rung 3 uses noisy simulated signals, but its calibration parameters are supplied by the experimenter. This atlas distinguishes the hidden world, a fallible report, the system's inference, and what can honestly be concluded.</p>

      <div className="horizon-stages" role="group" aria-label="Select an evidence stage">
        {horizonStages.map((s, i) => (
          <button type="button" key={s.id} className={stageId === s.id ? 'horizon-stage selected' : 'horizon-stage'}
            onClick={() => setStageId(s.id)} aria-pressed={stageId === s.id}>
            <span>{String(i+1).padStart(2,'0')}</span>{s.label}
          </button>
        ))}
      </div>
      <div className="horizon-stage-details" aria-live="polite"><div><span>{stage.access}</span><strong>{stage.label}</strong></div><p>{stage.note}</p></div>

      <div className="horizon-challenges-head"><strong>Challenges for the next engineering rung</strong><span>PLANNED / NOT RUN</span></div>
      <div className="horizon-challenge-grid">
        <div className="horizon-challenge-menu" role="group" aria-label="Select a proposed experimental challenge">
          {horizonChallenges.map((item) => (
            <button key={item.id} type="button" className={challengeId === item.id ? 'horizon-challenge selected' : 'horizon-challenge'}
              onClick={() => setChallengeId(item.id)} aria-pressed={challengeId === item.id}>
              {item.title}<ArrowRight size={15} aria-hidden="true"/>
            </button>
          ))}
        </div>
        <article className="horizon-challenge-detail" aria-live="polite">
          <div className="horizon-detail-meta">{challenge.status} · {challenge.source}</div>
          <h4>{challenge.title}</h4>
          <dl>
            <dt>Hidden from controller</dt><dd>{challenge.hidden}</dd>
            <dt>Permitted observation</dt><dd>{challenge.visible}</dd>
            <dt>Falsifiable question</dt><dd>{challenge.question}</dd>
            <dt>Simple competing explanation</dt><dd>{challenge.baseline}</dd>
          </dl>
        </article>
      </div>
      <p className="horizon-disclaimer">No new experiment is run here. Simulated faults are not physical measurements; functional self-modeling is not proof of subjective experience.</p>
    </section>
  );
}
