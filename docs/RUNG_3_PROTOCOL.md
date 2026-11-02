# CompAware CA-Haven Rung 3 / Noisy Decision Demonstrator

**ID:** compaware.haven.noisy-decisions/0.1  
**Status:** Exploratory software fixture; **not independently preregistered, not an empirical finding about awareness**.  
**Inspiration:** CA-SC-01 Silicon Cosmology Atlas: physical substrate, observed signals, internal models and limits of inference.

## Question

When a computational controller receives imperfect binary indications of an environmental fault, what is the performance and safety tradeoff between a simple rule, calibrated single-signal estimate, temporal probability filter with optional paid reobservation, and an unconditional safe fallback?

This compares ordinary algorithms. **It is not a consciousness test, an AI-subject experiment, a cosmic or physical measurement, or an awareness score.**

## Hidden environment, observations and decision

A simulated binary condition is either *fault* or *healthy*. The simulator begins with 25% prior probability of a fault and can flip state each tick. A noisy sensor reports fault/healthy correctly with specified probability. Every policy receives an identical first noisy indication.

**Policies may request a second independent noisy indication at cost −1**. The implemented temporal filter is the only strategy currently configured to purchase this option. Therefore the conditions have equal *access* to the option, but may have different realized information and cost.

Decisions:
- **Continue:** reward +3 when healthy, −6 under a fault.
- **Safe fallback:** reward 0.
- **Optional reobserve:** reward −1, followed by the selected decision.

The expected-value continue threshold is fault probability less than 1/3 when the model is calibrated.

### Controllers

1. **Temporal probability filter:** Bayesian update using declared observation reliability and flip rate, with optional second sample when posterior between 0.20 and 0.65.
2. **Latest-signal rule:** Continue if current reported state says healthy, otherwise fall back. No memory of prior observations.
3. **Calibrated single signal:** Bayesian current-signal update from fixed 25% prior; no temporal history.
4. **Always-safe fallback:** Never continue.

These are transparent algorithms, not trained artificial agents or a full seven-module vessel. Calibration information is supplied as an explicit experimental assumption.

## Scenarios

| Scenario | Sensor reliability | Hidden-state switch chance/tick |
|---|---:|---:|
| Clear signal | 0.90 | 0.06 |
| Noisy signal | 0.65 | 0.06 |
| Changing conditions | 0.80 | 0.22 |

Settings: seed 1–999999, repeats 1–35, steps 8–60. Default is seed 369, 8 repeats per scenario, 32 steps each. The total number of decision opportunities per policy is three scenarios × repeats × steps.

All environment changes and observations come from a seeded deterministic generator. The hidden truth is supplied only to the scoring logic; the policy decision function receives observations, declared calibration parameters and its internal estimate, not the ground-truth fault bit.

The JSON audit receipt *does* include actual hidden truth after scoring for independent verification. No backend or personally identifying user data are needed.

## Outputs

- Total utility and mean utility per policy, reported separately.
- Number of continues, fault exposures, unnecessary safe fallbacks, and paid rechecks.
- Brier probability-estimate error, lower meaning better calibration.
- Per-scenario breakdown.
- Complete deterministic trace and protocol metadata as a downloadable JSON receipt.

Different metrics may disagree. No single "best" policy is scientifically established by a selected cost model or a seeded demonstration.

## Hypotheses and alternative explanations

An explicit temporal estimate may reduce mistakes under temporally correlated faults, but may lose utility when rechecks are too expensive or the model assumptions are wrong. A simpler baseline may match or beat it.

**No positive result should be interpreted as proof of Computational Awareness.** Finding that a simple baseline is better is useful evidence about this task, not an embarrassment to hide.

The thresholds and scenarios were developed with the implementation, so these are **illustrative hypotheses, not confirmatory preregistration**.

## Limitations and requirements for a stronger next study

- A simplistic binary fault, not actual hardware telemetry, radiation, a physical cosmic coupling or multifaceted sensing.
- The simulator knows noise accuracy and transition rate exactly; deployed systems often do not.
- Costs and thresholds are chosen by developers, not validated against a real operational objective.
- A fixed policy/known environment cannot demonstrate general learning or emergence.
- Computational budgets and inference complexity are not equalized, though access to observation operations is the same.
- A confirmatory experiment would require a frozen protocol, independent review, held-out seeds, multiple realizations, confidence intervals, sensitivity analyses and calibrated-resource comparisons.
- Distinguish physical, simulated, hypothesis and analogy labels from the Cosmos Atlas. Do not conflate them.

**Next step:** design CA-Haven Rung 4 with uncertainty about sensor quality, externalized policy inputs, uncalibrated baselines and independent held-out evaluations.

