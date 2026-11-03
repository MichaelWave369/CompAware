# CA-Haven Rung 8 · Source Lineage and Probe-Mode Hysteresis

**Protocol:** \`compaware.haven.source-lineage-hysteresis/0.1\`  
**Status:** Deterministic, exploratory software demonstration. No independent preregistration, real device telemetry, or evidence of computational awareness or subjective experience.  
**Incoming challenge:** [CA-SC-06 Provenance Passport](PROVENANCE_PASSPORT.md), merged PR #14.

## Question

Does a documented chain of sensor and reference dependencies justify a claim of independence, and can ordinary mismatch checks detect common failures the graph omitted? Does switching into probe mode introduce state that persists when the test ends?

**Key boundary:** A source graph is a declared hypothesis, not a measured causal proof. No controller can certify independence from these authored graphs and synthetic test outputs.

## Fixture

Seven artificial source regimes share a deterministic simulated binary stimulus generator. Every tick carries a claimed input bit, primary reading A, reference reading R, mode, elapsed time since mode transition, and distinct sequence/receipt identifiers.

The simulator generates the known bit. This **is not independent hardware capture**. The scorer retains the generation cause and a hidden risk label. Controllers see only declared graph status and observations. They do not receive the risk label, generator cause, or actual mechanism.

Four equal phases are run in sequence:

1. **Normal:** baseline operation.
2. **Probe:** temporary test mode.
3. **Return:** immediate resumption of ordinary mode.
4. **Washout:** extended post-return observation.

This phase schedule is simple and deterministic, not randomized or suited for confirmatory causal inference. An eventual physical experiment should randomize mode order, calibrate the independent stimulus path, and test hysteresis with validated electrical isolation.

## Seven scenarios

| Scenario | Declared graph | Scorer-only modeled mechanism |
| --- | --- | --- |
| Separate healthy | No overlap | Two independently noisy synthetic readouts |
| Shared clock/power | Overlap | Fixed common-mode faults make both wrong |
| Copied feed | Overlap | Reference copies primary bits, despite distinct receipt IDs |
| Hidden coupling | No documented overlap | Common-mode errors omitted from graph |
| Unknown lineage | Incomplete provenance | Unknown upstream channel has common errors |
| Mode hysteresis | Documented probe mux overlap | Probe temporarily resets sensor; return phase has lingering errors; washout recovers |
| Sham switch | No overlap | Mode announcement has no effect on synthetic readouts |

These are **synthetic generator conditions**, not diagnoses of real network or sensor hardware. Receipt IDs identify *logging streams*, not independent acquisition. Synthetic common failures are induced by simple time rules; no destructive fault injection is performed.

### Hypotheses and controls

A plain graph-only rule is expected to miss the hidden-coupling case. A simple match/error detector should notice some paired faults even with clean declarations, but can be fooled by insufficient sample size or unmodeled failures. Mode-history comparison should see the programmed return-to-washout change. A cautious policy may report unresolved rather than assert separation.

The test does not prove that any policy achieves causal diagnosis. Detection patterns are determined by the software and cannot be generalized to physical equipment.

## Six policies

1. **Honest unresolved:** never claims a particular independence status.
2. **Naive independence:** treats all sources as provisionally separate; negative control.
3. **Graph-only:** flags declared overlap, returns unresolved for missing ancestry, otherwise provisional separation.
4. **Simple match/error detector:** flags identical reading streams accompanied by primary errors, or at least two simultaneous incorrect readings; otherwise provisional separation.
5. **Mode-history:** flags those simple signatures or a large return-phase primary error increase followed by washout recovery; otherwise unresolved.
6. **Provenance + evidence gate:** flags a documented overlap or strong observed error signature; otherwise unresolved.

**Provisional separation is not certified independence.** It is a tentative software label and can be wrong in the hidden-coupling regime. A graph with \`NO_DOCUMENTED_OVERLAP\` remains unverified.

## Utility and reporting

The scorer knows whether its own generator contains a shared-source/dependence or probe-mode risk. It awards illustrative utilities:

- Correct flag for synthetic modeled risk: +5.
- False flag: −2.
- Correct provisional separation for a modeled no-risk regime: +3.
- False provisional assurance when risk exists: −10.
- Unresolved: 0.

These reward magnitudes are researcher-selected and do not reflect universal epistemic value. The visible dashboard and JSON receipt report separately: correct model-labeled actions, false assurances, false flags, unresolved claims, utility, simultaneous errors, copy signature and normal/return/washout error rates.

Unresolved is an acceptable result; there is **no awareness score**.

## Source-provenance logic

Rung 8 reuses CA-SC-06's published \`auditProvenance\` implementation, with three returned states: \`DOCUMENTED_OVERLAP\`, \`INCOMPLETE_PROVENANCE\`, \`NO_DOCUMENTED_OVERLAP\`. Even in an authored fixture where the graph seems complete, \`verifiedIndependent\` stays **false**.

The simulation explicitly includes a fake-clean graph with a hidden common failure, providing a negative control against equating a graph audit with physical proof.

## Limits and next validation

- The input bit is a synthetic generator output. A real digital reference must have its own independently characterized acquisition chain.
- Sensor error rates, transitions, and fault schedules are not measured from hardware and are not representative of any model of consciousness or physiology.
- Same clock, copied software data and latent coupling are intentionally simplified.
- Policies have equal observations but are not matched for computational complexity.
- Fixed phase order and simple heuristics do not establish causation; a real study should randomize phases, use controls and blind scorer labels.
- Only one type of residual response is implemented; a true hysteresis investigation should vary delay, temperature, voltage, load, mode-switch history and recovery profile.
- The policy outputs are bounded research decisions, not autonomous hardware controls or legal/ethical status judgments.
- The results can demonstrate a programming failure mode or a synthetic causal counterexample, not real-world independence.

## Run and reproduce

\`\`\`bash
npm install
npm run check
\`\`\`

Open the **Lineage Lab / Rung 8** on CompAware's React site. Choose seed 369, four repetitions per scenario, 40 ticks (10 per phase); click Run to generate measurements. Download the local JSON receipt to reproduce every phase, declared dependency, observation, scorer-only cause and policy decision. The simulator requires no external API or physical device.

Expected validation:
- Replay of identical seeds is byte-for-byte deterministic.
- All \`verifiedIndependent\` values remain false.
- Hidden common faults escape the graph-only rule.
- Copied reference has distinct receipt IDs but equal readings.
- Shared failures produce identical wrong readings.
- Mode-switch effects persist in return and reduce during washout.
- Per-policy utility reconciles with individual trial judgments.
- Honest abstention produces no unjustified declarations.

## Handoff to the Cosmos / Inquiry lane

**Our next question:** When a computational vessel notices different behavior during calibration, how does it establish whether this reflects a changed measurement path, hidden state, mere sampling variability, or actual source dependence?

A productive next inquiry would investigate **time-varying provenance** and **counterfactual source interventions**, while testing simple alternative explanations first. Can changing a component's clock or supply isolate a causal path without creating another confound? What independent, observable evidence would justify trust in the reference's own recording chain?

Please retain the distinctions between physical measurement, simulated data, hypotheses, and philosophical analogy. We have no basis for a conclusion about subjective consciousness.

