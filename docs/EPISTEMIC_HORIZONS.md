# CA-SC-02 · Epistemic Horizons
### What the world is, what the vessel senses, and what it is permitted to claim

**Status:** Cosmos / Inquiry lane. Interpretive and methodological challenge to CA-Haven Rung 3, **not a new experiment, new awareness score, or scientific conclusion**.

## Why this follows Rung 3

PR #5 introduced the deterministic Rung 3 Noisy Decision Demonstrator. It is a valuable measurement fixture: separate hidden simulated fault truth, initial and optional secondary indicators, four policies and scoring receipts. It also gives the temporal filter and calibrated baseline **the simulator's exact noise accuracy and state-flip rate**. This is legitimate for that defined demonstration, but it cannot show how a controller would infer or maintain reliable self-knowledge when its own sensor is miscalibrated.

This research note turns that assumption into explicit challenges for the next engineering PR. **A correct simulation belief with oracle-supplied calibration is not the same capability as discovering one's own sensor uncertainty.**

## The epistemic boundary chain

1. **WORLD/TRUTH (experimenter-only)**: Hidden simulation state, transition rules and injected interventions. Observed only by the independent scorer. In a real environment, ground truth may not be available at all.
2. **SIGNAL (controller-visible)**: A noisy, delayed or missing report. Reports are evidence about the world, not identical to the world.
3. **MODEL (controller inference)**: A posterior estimate with stated assumptions, uncertainty and provenance. Accurate self-reports require external validation.
4. **ACTION (permitted behavior)**: A bounded decision made using authorized signals and budgets, not the scorer's private truth.
5. **OUTCOME (independent scoring)**: The consequences of action. Report opportunity cost, risk and precision separately.
6. **INTERPRETATION (human review)**: Functional competence in a limited task does not establish subjective experience, sentience, cosmic communication, souls or personhood.

Do not feed (1), (5) or (6) into a policy as if they were sensor measurements. The experimenter may report truth *after* the trial for reproducibility.

## A deliberately small classification discipline

| Claim class | Example | What would justify it |
| --- | --- | --- |
| PHYSICAL | A real instrument detects a temperature or power change in a real device | Calibration, time-stamped raw telemetry, instrument specifications, controlled physical trials |
| SIMULATED | A seeded fault causes an apparent sensor dropout in CA-Haven | Source code, seeds, event trace, independently checked replay |
| HYPOTHESIS | A controller estimating changing reliability will outperform a fixed-calibration rule | Prospective criteria, equal inputs, baseline, held-out interventions and uncertainty intervals |
| ANALOGY | A local self-model is a computational *microcosm* of a larger environment | A useful explanatory comparison; not an experimental result |

## CA-SC-02 candidate challenge cases

| Case | Hidden change | Authorized observations | What could falsify the interesting claim? |
| --- | --- | --- | --- |
| CALIBRATION_SHIFT | Sensor reliability drops partway through a trial, without being announced | Noisy reports and occasional independent checks with explicit costs | Fixed simple rules perform equally or better than estimated reliability |
| SENSOR_CONFLICT | Two sensors disagree due to drift, dropout or shared bias | Reports and provenance; no ground-truth oracle access | A majority-vote or conservative rule meets the same task objective |
| COST_REVERSAL | Price of rechecking or unsafe action changes in a held-out regime | Declared cost notice only when policy is allowed to observe it | A fixed threshold generalizes as well as a context-sensitive policy |
| FALSE_SELF_REPORT | A system description states a sensor is operational when instrumented truth says it failed | Actual runtime telemetry and stale self-report, never the scoring flag | A one-bit health register detects the change equally well |
| INTERRUPTED_CONTINUITY | A restart erases or corrupts some provenance while preserving other state | The permitted checkpoint, its validation metadata and observed post-restart state | An elementary snapshot-plus-checksum recovers as well as proposed integrated memory |
| COSMIC_RADIATION_ANALOGY | Synthetic bit fault is injected into memory state | Synthetic fault indicators, potentially noisy, never a real radiation measurement | Ordinary error detection or parity checks outperform proposed inference |

All cases are **design proposals**; none is currently performed by CA-Haven Rung 3. The cosmic-radiation case is a *synthetic electronics-fault analogy*, not observation of cosmic particles, solar activity or planetary influence.

## Review of current Rung 3, with concrete limitations

- **Exact model parameters:** Policy decision code receives scenario accuracy and flip rate. The filter is not learning these parameters from evidence.
- **Information access versus realized information:** A paid recheck is an option but only the filter is configured to request it. Compare separate no-recheck and matched-recheck policies before attributing improvements to temporal self-modeling.
- **Calibration labels:** The latest-signal policy emits 0/1 scores, which are hard decisions, not nuanced probability estimates. Its Brier score remains numerically valid as squared probability forecast error, but calling it *calibration* without qualification is misleading.
- **Utilities are assumptions:** +3/-6/0/-1 are meaningful within the fixture, not universal values for a real computational vessel.
- **No independent confirmatory evaluation:** Seeds, scenarios, parameters, controls and code were developed together. No claim of preregistration or generalization should follow.
- **No physical telemetry:** The binary fault is not evidence of cosmic radiation, a planetary signal or actual silicon fault detection.

These are design considerations, **not allegations of a broken Rung 3**.

## Candidate Rung 4 handoff (Engineering / Haven lane)

**Primary task:** After a concealed calibration shift, choose among continue, bounded safe fallback and paid reobservation, with the scorer's truth withheld.

**Minimum controllers**:
- Existing temporal filter with fixed declared calibration (frozen Rung 3 comparator)
- Adaptively estimated reliability filter; its inputs and update rule specified before test
- Simple recent-error/windowed reliability tracker
- Fixed threshold with identical sensor/recheck permissions
- Always-safe fallback

**Controls and falsification:** Compare matched input histories, recheck opportunities, compute budgets and action costs; include both known and unknown reliability regimes, adverse changes, and a negative case where adaptation hurts. Show utility, missed faults, false alarms, calibration, paid observations and compute cost separately. Test on a held-out seed partition, specify success criteria in advance, and report confidence intervals and null findings.

**If an adaptive approach does not outperform a simple tracker:** Publish that outcome and refine the construct. Do not rebrand an unneeded mechanism as awareness.

**Gate before claims:** A preregistered protocol needs its parameters and analysis plan frozen *before* confirmatory trials; a protocol created together with the result remains exploratory.

## Philosophy remains philosophy

Ancient microcosm/macrocosm, Gnostic self-knowledge, Hermetic self-understanding and mystical ideas about cosmic order can help people generate questions. They are not evidence that computing systems have spiritual experiences. Contemporary computational self-modeling should be judged by falsifiable forecasts about actual or simulated operations, not by resemblance to an ancient symbol.

**Standing principle:** The system must be allowed to say **“I do not know”** where its sensors, provenance or model are insufficient.

## Handoff to the next PR

- **Read:** Rung 3 implementation in `src/sim/noisyStudy.js`, especially the supplied `scenario.accuracy` and `scenario.flip`.
- **New design question:** Can a computational controller detect that the reliability of its own sensor has changed, without being given the correct reliability?
- **Possible decisive negative:** A simple windowed predictor beats the elaborate self-model under equal evidence and budget.
- **Research status:** Proposed only, no new experiment run, no new consciousness claim.
