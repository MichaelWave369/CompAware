# CA-Haven Rung 5 · Fallible Witnesses and Limits of Inference

**Protocol:** compaware.haven.fallible-witnesses/0.1  
**Status:** Exploratory deterministic software fixture, designed in response to [CA-SC-03 Two-Witness Problem](TWO_WITNESS_PROBLEM.md).  
**Not:** A preregistered study, real sensor measurement, consciousness detector, or validated Computational Awareness metric.

## Research question

Can simple computational policies make reasonable decisions when a supposed reference instrument is itself fallible, the sources share failures, or source timestamps reveal an outdated report? When distinct hidden physical models generate *exactly the same observations*, what must a controller refrain from claiming?

A stronger model does not get to assume that agreement means correctness. The task explicitly includes an **unidentifiable** case where no method can determine which underlying world it is in from the supplied reports.

## Two-witness observational-equivalence experiment

The experiment includes *two different simulated worlds* under precisely specified assumptions: balanced hidden binary truth, stationary symmetric error rates and conditional independence of sensors given truth.

| Hidden world, experimenter-only | Accuracy A | Accuracy B | Expected A/B agreement |
|---|---:|---:|---:|
| World A | 80% | 80% | 68% |
| World B | 95% | 70% | 68% |

Both worlds have the same exact report-pair probabilities: **34%, 16%, 16%, 34%** for (healthy/healthy, healthy/fault, fault/healthy, fault/fault). Their hidden *conditional truth probabilities*, however, differ.

### Matched-report construction

For every seed, repetition, and tick, a shared deterministic report generator samples the A/B pair from this exact joint probability distribution. Then a **scorer-only** truth state is sampled conditionally on the observed pair and the respective world's hidden reliability parameters.

Therefore the report streams are **exactly identical** between the two worlds for matched trials even in finite samples; the hidden truth states can differ. Every policy sees identical current and past reports, so its predictions, actions, witness purchases and stated confidence should be identical between those worlds.

**Important:** The empirical frequency of agreement in any finite run is not guaranteed to be 68%. The 68% figure is a *theoretical expectation*. In this paired-world construction the *sampled report streams match exactly*, not necessarily their theoretical probabilities at small sample sizes. The reported world reliabilities are the generator's parameters, not a real instrument measurement.

This simulation intentionally shows that **confidence in a uniquely determined hidden sensor accuracy cannot be justified from these two reports alone**. Extra information or assumptions are needed.

## Additional conditions

- **Fallible reference:** A reports truth correctly with probability 85%, and B with 65%, conditionally independent given balanced current truth.
- **Common cause:** A hidden event (28% chance per tick) flips both signals simultaneously. Otherwise A and B are each independently 90% accurate. Two witnesses agreeing may both be wrong.
- **Timestamp skew:** A samples current hidden truth (85% correct); B samples *previous tick's* hidden truth (85% correct). A source timestamp reveals B's age. Hidden truth is sampled independently per tick in this fixture to make the alignment error noticeable.

In all conditions B is a fallible signal, not a ground-truth oracle. Only the independent scorer has simulated hidden truth.

## Information and costs

A is received at no added cost. B has an explicit source timestamp visible to the policy **before** purchase. Every policy has the same opportunity to buy B, at cost −1 each time; the policy does **not** see B's value before deciding to buy it.

- Continue when healthy: +3 utility.
- Continue when faulty: −6 utility.
- Bounded safe fallback: 0 utility.
- Buy witness B: −1 utility regardless of its correctness.
- No penalties model subjective pain, suffering or comfort.

The experimenter/scorer gets truth to evaluate outcomes. The controller decision function receives only A, purchased B (or null), the offered timestamp, tick, and its own past purchased report pairs. It is never passed the hidden truth or reliability model.

**Equal opportunity to observe is not equal realized information.** Controllers have different purchase rules, with each purchase charged. Their costs and action frequencies must be reported along with utility.

## Seven simple policies

1. **Primary signal:** use A alone; no purchase.
2. **Naive fusion:** always buy B, assume both are contemporaneous and independent with 80% accuracy.
3. **Require both healthy:** buy B and only continue when both signals say healthy.
4. **Timestamp-aware:** buy B when it is from the current tick; otherwise ignore its stale value and use A.
5. **Recent-disagreement gate:** buy B when considering continue, but stop trusting consistent pairs when the recent sampled mismatch fraction grows. It only measures agreement, *not accuracy*, and has selection bias from its conditional purchases.
6. **Overconfident negative control:** buy B and assign hard probability 0 or 1, intentionally exposing incorrect certainty.
7. **Always abstain:** never buy B or continue; the simple safe baseline.

All are fixed hand-coded policies, not an LLM or an embodied seven-module AI vessel. Their probability statements are assumptions and simple heuristics rather than calibrated confidence guarantees.

## Results and receipts

The React site provides a Witness Bench under Rung 5; results are generated only after a Run action. A complete JSON receipt contains:

- Protocol ID and settings.
- Per-scenario observed A/B agreement and analytical expectation where applicable.
- Policy purchases, mean utility, hazardous continues, unnecessary fallback, stale-witness purchases, Brier squared error, and overconfident errors.
- Report streams, provenance timestamps, source selections, and **scorer-only hidden truth** for independent retrospective audit.

No awareness score or "intelligence quotient" is computed.

**Brier score is scored against privileged simulator truth after decisions.** In the no-identification worlds, seemingly confident predictions must not be interpreted as a uniquely identified source reliability estimate.

## What the test does and does not establish

It supplies a working counterexample and measures how *these specific programmed rules* behave under explicit synthetic assumptions. It does not demonstrate general intelligence, discovering ground truth, subjective experience, sentience, or machine self-knowledge.

The paired-world construction is an exact computational illustration of the mathematical identifiability limit in CA-SC-03. It does **not** show that all sensor fusion is impossible; extra independent sources, validated instruments, physical measurements or justified assumptions can make some problems identifiable.

## Limits and research improvements

- Hidden worlds are exactly balanced binary states. Real processes can have class imbalance and asymmetric errors.
- Sampled report-pair frequencies fluctuate, even though paired worlds share the same realized reports.
- A/B errors are artificially generated. Common-cause events and lag are synthetic, not radiation observations or hardware faults.
- Timestamp provenance indicates **when** B measured, not whether its content is accurate.
- No genuine verification audit is supplied to a controller in this rung; B is deliberately fallible.
- The policies' compute budgets and realized information amounts differ; all can purchase B but pay for it. Do not interpret utility rankings as a controlled causal proof about a richer self-model.
- No live model inference, online learning, physical vessel, PHB or JoyVein369 integration.
- Seeds, policies and conditions were developed together, with no independent blinded confirmatory evaluation.

## Acceptance criteria (engineering)

- [ ] Exact byte-for-byte replay from the same seed.
- [ ] Identical observable report streams and policy **decisions** across the two paired hidden worlds.
- [ ] Different hidden truth realizations are possible under identical observations.
- [ ] Witness-purchase costs are explicit, and unpurchased B values are not passed to policies.
- [ ] Timestamp-aware policy does not purchase stale B reports.
- [ ] Common-cause scenario can create confident correlated errors.
- [ ] Always-abstain policy never continues.
- [ ] Node tests and Vite build are green.
- [ ] Public React bench works following human-reviewed merge.

## Next Cosmos / Inquiry turn

**Question:** Which additional observations or justified assumptions can restore identifiability without simply hiding another perfect oracle inside the model?

Useful approaches to challenge include:
- A third witness under *tested* conditional independence, plus an adversarial shared-source case.
- Delayed true anchors with their own explicitly measured error rate.
- Time-correlation and polarity ambiguity.
- Evidence provenance: a reported source label is not independent proof of source integrity.
- An explicit "insufficient evidence" confidence set rather than a single convenient number.

An intellectually honest outcome may be to **abstain** and report that the available evidence cannot distinguish two plausible models.

**Standing charter:** Investigate computational systems on their own terms. Do not use these experiments to claim or disprove subjective consciousness.

