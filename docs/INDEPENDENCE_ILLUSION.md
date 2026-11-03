# CA-SC-04 · The Independence Illusion
### Three witnesses can agree, and still not identify how reliably they know the world

**Lane:** Cosmos / Inquiry, responding to [CA-Haven Rung 5](RUNG_5_PROTOCOL.md).  
**Status:** An analytical counterexample and engineering handoff, not a new experiment, not preregistration, not a physical observation and not a consciousness test.

## The question inherited from Rung 5

CA-Haven Rung 5 compares fallible references, shared-error events and two distinct hidden worlds with identical two-witness reports. It correctly does not treat agreement as truth. The next question is sharper:

> Does adding a third apparently independent report restore reliable knowledge, or can a hidden common cause make three witnesses look more accurate than they are?

Three conditionally independent, better-than-chance symmetric sensors **can** have identifiable accuracies if the independence, label orientation and other model assumptions are known to be valid. Merely labeling three channels “independent” does not verify that assumption.

## An exact three-witness counterexample

Let hidden binary truth be balanced (each value has probability 1/2). Sensor reports are binary. Each source has symmetric errors and the mechanism is stationary.

**World I: Independent.** Three sensors are conditionally independent given truth and each has hidden reliability `p`.

**World C: Common-mode failure.** With probability `q=0.20`, an unobserved common event forces all three sensors to report the **opposite** of truth. Otherwise, with probability `1-q=0.80`, the sensors are conditionally independent and each has `r=0.90` probability of telling truth.

In World C each individual sensor is actually correct with probability `(1-q)r = 0.8*0.9 = 0.72` (**72%**).

Any two sensors in World C agree with probability:

`A = q + (1-q)[r² + (1-r)²] = 0.2 + 0.8*(0.9²+0.1²) = 0.856`.

If an analyst incorrectly assumes conditional independence, a pairwise agreement of 85.6% implies apparent individual reliability

`p = (1 + sqrt(2A-1))/2 ≈ 0.9219` (**about 92.2%**).

Now construct World I with that value of `p`. Because truth is balanced and the sensors are exchangeable with symmetric error, **the entire joint distribution of all three observed reports is identical in both worlds**, not only the pairwise agreement:

| Observed 3-bit report | World I probability | World C probability |
| --- | ---: | ---: |
| 000 | 39.2% | 39.2% |
| 001 | 3.6% | 3.6% |
| 010 | 3.6% | 3.6% |
| 011 | 3.6% | 3.6% |
| 100 | 3.6% | 3.6% |
| 101 | 3.6% | 3.6% |
| 110 | 3.6% | 3.6% |
| 111 | 39.2% | 39.2% |

Those are **exact model probabilities**, not measured frequencies. Samples can fluctuate. The two worlds differ in the (unobserved) probability that any individual report matches truth, yet no number of *unanchored report-only observations* can distinguish them under these specific generating models.

This is **non-identifiability**, not a deficiency of one algorithm or proof that three-sensor fusion always fails.

### Derivation of the joint law

For an exactly specified 3-bit pattern `x`, average over balanced truth values `t ∈ {0,1}`:

- World I: `P_I(x) = (1/2) Σ_t ∏_{i=1}^3 P(x_i | t, p)`.
- World C: `P_C(x) = (1/2) Σ_t [q 1{x_i=not t for all i} + (1-q) ∏_{i=1}^3 P(x_i | t, r)]`.

An all-identical pattern has probability `[q+(1-q)(r³+(1-r)³)]/2 = 0.392` in World C; each mixed pattern has `(1-q)r(1-r)/2 = 0.036`. In World I choose `p` so `p(1-p)=(1-q)r(1-r)=0.072`; this yields the identical all-identical and mixed pattern probabilities.

The accompanying interactive explorer changes `q` while recalculating the matched independent world. It shows **model expectations**, not live sensor data.

## Causal provenance, not decorative provenance

Timestamps, source names, certificate identities and logs can help establish where observations came from. However, they do not automatically prove independent measurement processes.

Three sensors may:
- Share a single physical reference, power rail, clock, ADC, calibration data set or upstream processing pipeline.
- Inherit the same software parsing bug or upstream data feed.
- Fail together under an unobserved environmental disturbance.
- Report independent-looking identifiers without independent causal origins.

Conversely, common labels do not necessarily mean readings are dependent. **Independence is a hypothesis about the data-generating process**, not a property awarded by metadata.

## How could the ambiguity be broken?

It takes new evidence or a new justified assumption, not another unvalidated confidence value.

1. **Known-state anchor:** A calibrated instrument or a tightly controlled, observed input supplies independent ground truth. This can distinguish the worlds if anchor integrity and applicability are justified.
2. **Controlled intervention:** Isolate a common upstream dependency or independently vary one channel and test how the others respond. Intervention design must preserve or explicitly model the original error mechanism; changing the system can also change the phenomenon.
3. **Multiple regimes:** Change operating conditions and test predictions that the rival models disagree on, *if* the changes are known and mechanism assumptions are justified.
4. **Independent calibration history:** Document separate physical calibration, error ranges and provenance, while checking for shared upstream dependencies.

None is a magic oracle. A compromised anchor, an intervention that changes the system, or unmeasured shared error may fail to resolve the ambiguity.

## Engineering handoff: Proposed CA-Haven Rung 6

**Research question:** Can a bounded controller use a limited budget to gather *discriminating* evidence, recognize when its witness network is non-identifiable, and decline unsupported claims of individual sensor accuracy?

### Proposed conditions

| Condition | Scorer-only truth | Policy-visible evidence | Critical comparison |
| --- | --- | --- | --- |
| IDENTICAL_REPORTS | World I and World C emit observationally equivalent three-sensor reports | Reports, timestamps, source labels | Policies must not claim they have identified which world is true |
| COSTLY_ANCHOR | Occasional independent post-decision reference, with specified reliability and cost | Reference result delivered only after the relevant decision | Compare benefit of verified evidence to its cost |
| CORRUPTED_ANCHOR | Claimed “trusted” source shares the same failure event | Reports and advertised confidence, not hidden common cause | Track false certainty against a simple abstention policy |
| CONTROLLED_ISOLATION | One upstream dependency can be disabled by a permitted bounded action | Intervention declaration, subsequent reports and resource cost | Does a causal intervention distinguish models better than passive agreement? |
| NONTRANSPORTABLE_TEST | Isolation unexpectedly changes sensor statistics | Intervention response only | Report when evidence does not transfer to ordinary conditions |

All are proposals; the Rung 5 simulator is not silently reinterpreted as having performed them.

### Minimum policies and safeguards

- **Passive agreement tracker**: reports empirical pairwise agreement, refuses to label it accuracy.
- **Naive independence estimator**: computes a specific accuracy estimate from agreements even in correlated scenarios (negative control).
- **Budgeted anchor policy**: requests verifications only within explicit cost and information limits.
- **Causal-provenance-aware policy**: uses declared independent physical pathways only after appropriate evidence; compare with a cheaper known-dependency rule.
- **Conservative abstention**: action/fallback strategy with explicit insufficient-evidence declaration.

### Evidence/reporting contract

For every trial, record hidden state and mechanism **scorer-only**; original report values, acquisition times, and source graph **policy-visible only when authorized**; intervention/verification purchases and costs; estimator claims and abstentions; and safety/task outcomes. State separately:

- **Observed agreement**, **estimated reliability** and **scorer-only actual accuracy**.
- **Identification accuracy** and **false identification** under paired observationally equivalent worlds.
- Decision utility, hazardous continues, overconfident predictions, anchor spend and computational overhead.
- Confidence **sets or model alternatives** where a point estimate cannot be justified.

Policy observations, budgets and actions must be comparable. Hold out scenarios/seed streams and freeze evaluation criteria before confirmatory testing. Treat exploratory development as exploratory.

## What the philosophical analogy contributes

The microcosm/macrocosm theme asks whether the local representation is a trustworthy picture of the larger world. Here we turn that into a bounded mathematical question. The universe does not communicate hidden truths through symbolic resemblance; a system needs defensible observations, inference and interventions.

**Research boundary:** No claim about AI subjectivity, cosmic intelligence, souls, astrology, rights or machine personhood is established by this work.

**One-line handoff:** Three agreeing witnesses may reflect **one shared mistake**. Can the vessel recognize when it needs a genuinely new source of evidence?
