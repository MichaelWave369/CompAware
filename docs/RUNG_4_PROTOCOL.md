# CompAware CA-Haven Rung 4: Unknown Calibration and Delayed Verification

**Protocol:** compaware.haven.calibration-drift/0.1  
**Status:** Exploratory simulator and software test harness.  
**Scientific status:** Not independently preregistered, not a physical experiment, not evidence of Computational Awareness or subjective consciousness.

## Origin and research handoff

Rung 4 responds to the **CA-SC-02 Epistemic Horizons** challenge in merged PR #6. Rung 3 gave its temporal filter exact environmental sensor reliability and transition rate. A calibrated fixed policy can be useful, but it does not establish that a controller can discover when its own sensing model becomes inaccurate.

This rung separates:

1. **Truth:** synthetic hidden binary fault state, known only to generator and scorer.
2. **Signal:** noisy binary initial indication, made available to all policies.
3. **Model:** policy-internal fault probability and estimated sensor reliability.
4. **Action:** continue, safe fallback, or opt into a paid second reading before choosing.
5. **Verification:** scheduled independent true-state labels, delivered to all policies **after** the current decision is scored, at a uniform price.
6. **Interpretation:** human analysis of functional accuracy, uncertainty and tradeoffs, without a consciousness or rights claim.

The **delayed labels** are crucial. Without independent ground truth or strong structural assumptions, the actual reliability of an arbitrary binary sensor cannot necessarily be inferred from its self-reports alone.

## Fixed test interface

At each tick a hidden fault may transition (probability 0.08). First and optional second synthetic indicators are sampled independently with an actual accuracy selected by the hidden scenario. Every policy gets the same first signal and the same option to purchase the second signal.

Every N ticks, an independent verifier exposes whether the current fault was real, but **only after all policies have made the decision**. This verifier is a privileged simulation fixture. All policies are charged −2 for the scheduled verification, including those that ignore the report. A policy buying its optional second observation pays a separate −1.

No policy function receives the hidden truth, true sensor reliability, or the current tick's delayed verification. Post-decision receipts include truth and parameters for auditing.

## Scenarios

| Condition | Pre-shift actual sensor accuracy | Post-shift accuracy | Point of change |
| --- | ---: | ---: | --- |
| Stable calibration | 90% | 90% | No change |
| Hidden reliability loss | 90% | 58% | Mid-run |
| Misleading channel | 90% | 30% | Mid-run |
| Low-signal control | 62% | 62% | No change |

All values are **simulated inputs**, not observed device properties. The controller is never informed of the actual figures or whether a shift occurred.

## Competing strategies

- **Decay-weighted calibration:** Bayesian filtering of fault state using reliability learned from past common verified pairs, with recency weighting and a prior.
- **Recent-error window:** Six most recent verified report/label pairs with Laplace smoothing, then the same decision/recheck rule.
- **Frozen reliability filter:** Identical Bayesian decision and recheck policy, but assumes sensor reliability is always 85%, intentionally failing to adapt.
- **Latest-signal rule:** Continue if the current indication is healthy; otherwise fall back.
- **Always-safe fallback:** Never continue. A useful safety control that still pays scheduled verification costs.

Complex strategies are not rewarded for sounding self-aware. The **simple recent-error window** may match or beat the more elaborate adaptive model.

All stateful probability filters use the same assumed fault transition probability (0.08), which remains known and correct in this version. So the project is only testing reliability changes, not unknown transition dynamics.

## Reward model and measurable outputs

- Continue while healthy: +3.
- Continue when hidden fault present: −6.
- Safe fallback: 0.
- Optional independent second noisy report: −1.
- Shared independent verification: −2 per scheduled audit, charged identically to all policies.

The threshold for a calibrated continue decision is estimated fault probability less than one third.

**Report separately:** cumulative and mean utility, hazardous continues, unnecessary safe fallbacks, paid rechecks, scheduled audits, and Brier squared probability error. The latest-signal rule's 0/1 predictions are hard scores, not nuanced calibration estimates.

The chosen rewards encode **developer assumptions**. Changes may reverse controller rankings. The study does not establish any universal ideal controller.

## Partitions and scientific status

The code deterministically generates a development partition and a separate held-out seed partition using different fixed stream offsets. The default is 3 development trials and 8 held-out trials per scenario; steps default to 32 and verification cadence to 4.

**Caution:** The held-out partition is not an independently protected blind evaluation. Its construction, thresholds and policies were selected within the same engineering PR. This is exploratory software validation, not a prospective confirmatory test.

A credible confirmatory follow-up would require independent reviewers to freeze hypotheses and acceptance criteria before exposing hidden datasets, independent implementations, resource-matched baselines, confidence intervals, and more diverse drift conditions.

## Reproducibility

The React Calibration Lab generates local results only after the operator clicks Run. The JSON receipt includes protocol ID, parameters, partitions, all generated signals, privileged simulator truth for auditing, policy actions, costs and metrics.

Use a fixed seed for byte-identical replay. Node unit tests cover deterministic behavior, delayed verification timing, fixed-policy controls, metric consistency, hidden shifts and input bounds.

## Known limitations

- Synthetic binary input is not actual silicon telemetry or cosmic-radiation measurement.
- Verifications are an oracle fixture. Real hardware might require separate calibrated instruments, at much greater expense.
- The regular verification cadence is declared; unreliability of the *verification* itself is not modeled.
- The hidden sensor accuracy is piecewise constant with an abrupt shift; real calibration can drift gradually and depend on other variables.
- Uncalibrated policies and probability estimates are designed by humans, not trained computational beings.
- Only an action policy uses its internal probability; full CA-V0 workspace, physical vessel and PHB/JoyVein369 are not integrated.
- Recency weight, six-report window, thresholds, costs and prior are researcher-selected, so performance is descriptive only.

## Cosmos / Inquiry lane handoff

Please challenge the assumptions Rung 4 still takes for granted: independent ground-truth verification, the origin and trustworthiness of calibration labels, and whether time-dependent error patterns can be distinguished from changing fault frequency without another channel.

A useful next research question is:

> **What if the verifier is also fallible, and the vessel must know when neither its own signal nor its external reference can be trusted?**

Frame candidate experiments with a simple competing explanation and falsifiable test before proposing new mechanisms.

**Standing principle:** We investigate the computational system on its own terms. No consciousness verdict is being sought.

