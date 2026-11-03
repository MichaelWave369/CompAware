# CA-SC-05 · The Intervention Mirror
## Why a visible change after an intervention may still fail to identify its cause

**Lane:** Cosmos / Inquiry. Responds to [CA-Haven Rung 6](RUNG_6_PROTOCOL.md) (merged PR #11), which tests modeled source isolation, corrupted or copied anchors, and intervention placebo controls.

**Status:** Exact mathematical counterexample and candidate laboratory protocol. It is not an executed Rung 7, an independent preregistration, a physical measurement, a consciousness test, or evidence of celestial influence.

## The inherited question

Rung 6 illustrates how an *assumed specific* effective intervention can distinguish two otherwise observationally equivalent three-witness models. Its documentation explicitly notes that the declared intervention's mechanism may be wrong and asks how to justify independence and specificity.

An important next question is **transportability**: If a controller learns something *during an intervention*, can it justify applying that conclusion to the system under ordinary conditions? Does the intervention repair one fault mode while quietly changing other sensor properties?

A changed histogram is not a uniquely identified cause. A successful isolation announcement is not proof of a successful, specific isolation.

## An exact matched before/after counterexample

Assume:
1. Hidden binary truth is balanced: P(0)=P(1)=1/2.
2. Three sensors report binary values with symmetric errors, exchangeable within each world/regime.
3. Individual errors are independent conditional on truth **except when a hidden common-mode event forces all three to the wrong value**.
4. Model parameters are stationary *within* pre- and post-intervention phases, but may change at the intervention.
5. Only the sensor reports and the announcement/time of intervention are observed; neither truth nor mechanism is directly measured.

Two different causal stories yield identical **entire observable triple-report distributions before and after intervention**:

### Before the intervention

- **Independent world I:** Each sensor is about **92.19%** reliable, independently.
- **Common-mode world C:** A hidden event occurs 20% of the time and forces all three wrong. Otherwise each sensor is 90% accurate, making actual marginal correctness **72%**.

They produce the exact same eight report-pattern probabilities: `P(000)=P(111)=0.392`, and each of the six other patterns has probability `0.036`. Pairwise agreement = **85.6%**.

### After the intervention (default example)

- **Independent world I:** Intervention unexpectedly changes individual sensor reliability to **90%**; channels remain independent.
- **Common-mode world C:** Intervention lowers the common event rate from 20% to 10% but also changes ordinary-channel accuracy from 90% to about **88.7298%**. Actual marginal correctness is about **79.8569%**.

Both now produce the exact same eight report-pattern probabilities: `P(000)=P(111)=0.365`, and each other pattern has `P=0.045`. Pairwise agreement = **82%**.

**The observer sees a real change**: all-identical triples become less frequent, mixed reports become more frequent, and pairwise agreement declines from 85.6% to 82%.

Yet the two worlds have indistinguishable report sequences **in distribution both before and after**. One world has 90% post-intervention marginal accuracy per sensor, the other ~79.86%.

The observed change does not establish which story generated it. This is an *existence counterexample* to unrestricted causal interpretation, not a claim that the chosen hidden side effects are likely.

### Exact construction

For common-failure probability `q` and ordinary accuracy `r`, pairwise agreement is:

`A_C(q,r) = q+(1-q)[r²+(1-r)²]`.

For independent accuracy `p`, agreement is:

`A_I(p) = p²+(1-p)²`.

Choose `r` to satisfy:

`r = [1+sqrt(2[(A_I(p)-q)/(1-q)]-1)]/2`

when the value under the square root lies in [0,1]. With balanced truth and symmetric exchangeable three-witness reports, this equality of pairwise agreement also equates **all eight** joint report-pattern probabilities for these two restricted model families.

The interactive explorer recalculates `r` when the post-intervention independent-world `p` changes. It displays expectations, never sampled data.

## What Rung 6 does and does not establish

Rung 6 is a valid bounded **exploratory simulator** under its declared assumptions. Its effective isolation is *defined by code* to remove shared failures in the common world, without arbitrary coincident independent-sensor changes. Within that model, changed report distributions can provide evidence about the specified hypotheses.

CA-SC-05 challenges *external validity*: a real intervention may affect multiple channels, calibration, power, timing, or preprocessing. The counterexample here does **not** refute Rung 6's software tests. It shows why its intervention-specific likelihood cannot automatically be generalized to unknown devices.

## A minimally instrumentable experiment proposal

A safe hardware-oriented version could be constructed using a **known binary input** (e.g. a microcontroller-controlled digital test signal), three independently timestamped reader paths, and a separate logging reference that records the input directly. Software-injected bit errors stand in for failure modes at first; no radiation source, hazardous experiment, or uncontrolled device fault is necessary.

- **Treatment:** Change an upstream common-processing route while recording any changes to channel calibration, filters, clocks, and measurement delay.
- **Sham/placebo:** Announce a switch without changing the signal path.
- **Positive control:** Inject known common-mode errors before fan-out and verify that direct independent logging detects them.
- **Negative control:** Inject independent per-channel errors with the same observable pairwise agreement.
- **Reference integrity:** Timestamp input generation and independent logging; report shared power, clock, code or storage dependencies rather than declaring them absent.
- **Randomization:** Use a frozen balanced schedule of sham/treatment and independently seeded fault injections, and compare unexposed and exposed phases.
- **Information boundary:** Policies see only authorized channel reports, source and intervention provenance; the direct input log remains scorer-only during decisions.
- **Resource accounting:** Record intervention cost, observation cost, time delays, unsafe decisions and fallback rates.
- **Transport test:** Measure whether an intervention-specific inference still predicts outcomes after restoring the original processing path.

This is a **candidate protocol**, not a run: the project currently has no physical reference hardware or independent calibrated anchor.

## Rung 7 engineering handoff

**Primary question:** Can a controller distinguish an intervention that selectively removes a common failure from an intervention that also changes ordinary channel accuracy, when the ordinary reports alone are compatible with either story?

Prospective conditions:
1. **SPECIFIC_ISOLATION:** The declared intervention only suppresses common-mode failure (the Rung 6 assumption).
2. **COINCIDENT_DRIFT:** The same announcement includes independent sensor reliability or timing changes.
3. **MIRROR_WORLDS:** Hidden worlds whose complete pre/post reports are observationally equivalent, as constructed here.
4. **SHAM:** Same intervention message, no physical or simulated mechanism change.
5. **ANCHOR_WITH_SIDE_EFFECT:** A nominal reference changes alongside intervention, including copied-source or timing-skew controls.
6. **RETURN_TO_BASELINE:** Restore original configuration and evaluate whether learned conclusions generalize back.

Prospective baselines:
- **No-identification / honest abstention** when the model set remains ambiguous.
- **Simple before/after histogram** with no causal mechanism claim.
- **Rung 6 specified-intervention model**, frozen and used outside its original assumptions as a negative transfer control.
- **Broader multi-hypothesis model** allowing calibration side effects, required to report a set of compatible mechanisms rather than a single unearned answer.
- **Explicitly measured external input anchor**, charged its full information and deployment cost.

### Falsification, not faith

A richer controller must outperform these simpler baselines on **decision utility, false causal identification, confidence calibration against scorer-only truth, intervention/anchor cost, and out-of-regime prediction**. If a simple abstaining policy prevents overclaiming or a calibrated source alone resolves the question, that negative finding matters.

For *unanchored MIRROR_WORLDS*, the strongest possible guarantee is that no classifier using only the described reports and common intervention history can reliably identify which hidden world generated them better than chance under a balanced world prior. Claiming otherwise indicates leakage, extra assumptions or incorrect tests.

All model assumptions, costs, held-out seeds and acceptance criteria must be frozen before confirmatory trials. This note is not itself a preregistration.

## Epistemic and philosophical boundary

A local computational self-model is a representation of limited evidence, not a mystical map of the cosmos. Ancient microcosm/macrocosm analogies can inspire the questions, but mathematics, measurement and reproducibility must decide the conclusions.

**No claim of consciousness, sentience, a soul, personhood or cosmic direction is made or tested.**

### One-line handoff

**If an intervention changes the evidence itself, what have we actually learned about the world we meant to measure?**
