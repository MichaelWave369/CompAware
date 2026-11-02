# CA-SC-03 · The Two-Witness Problem
## Agreement is not truth: fallible references, shared errors, and the limits of self-knowledge

**Lane:** Cosmos / Inquiry. **Status:** Mathematical illustration and proposed engineering challenge, not a run of CA-Haven Rung 4, not preregistration, not physical evidence, and not a consciousness investigation.

**Direct handoff:** [Rung 4 protocol](RUNG_4_PROTOCOL.md) asks what happens when a delayed verifier is fallible. This note identifies a concrete identifiability limit that any Rung 5 design should respect.

## The central distinction

An instrument can report a signal. A second instrument can agree with it. Neither fact alone establishes the hidden world state.

A reliable source needs evidence for its reliability; agreement with another untrusted source may not supply that evidence. This is especially important for a computational vessel attempting to update the confidence it assigns to its own observations.

Use three terms consistently:
- **Agreement:** Frequency with which two reports match, directly observable.
- **Accuracy:** Frequency with which a report matches hidden truth, not directly observable without a justified reference.
- **Trust:** A policy decision about how to use evidence. Trust should record provenance, validation assumptions, and consequences of error. It is not a sentient feeling.

## Exact two-witness counterexample

Consider a binary world where true/false are equally probable, two sensors make independent errors *conditional on the true state*, and each sensor's error rate is symmetric (same chance of mistakes for both classes) and stationary.

Let `p_A` and `p_B` be the accuracies of sensors A and B.

Their probability of agreeing is

`P(A=B) = p_A p_B + (1-p_A)(1-p_B)`.

Compare two distinct hypothetical worlds:

| Hypothetical hidden reliability | Sensor A | Sensor B | Measurable A/B agreement |
| --- | ---: | ---: | ---: |
| World 1 | 80% | 80% | 68% |
| World 2 | 95% | 70% | 68% |

With the above assumptions, their **entire observable joint report distribution is identical**:

| Sensor A report / Sensor B report | World 1 | World 2 |
| --- | ---: | ---: |
| Healthy / healthy | 34% | 34% |
| Healthy / fault | 16% | 16% |
| Fault / healthy | 16% | 16% |
| Fault / fault | 34% | 34% |

These numbers are *analytical probabilities*, not measured sample frequencies. Even unlimited observations of these two reports cannot distinguish the worlds in this model. This is a counterexample to the idea that two agreeing sources necessarily identify their individual accuracies.

**Important scope:** If the truth prevalence, error symmetry, stationarity or conditional independence assumptions change, the observable distribution may behave differently. The specific 68% construction is not a general claim about every possible sensor network.

## Why Rung 4 is a useful engineering precursor

Rung 4 provides **post-decision labels from an independent, perfect simulation verifier**. That privileged reference makes reliability estimation feasible under its fixture assumptions. Rung 4 appropriately calls those labels an oracle and does not claim independent confirmation in hardware.

A next rung in which the verifier is inaccurate cannot casually train on the verifier's output as though it were truth. Such training may silently copy verifier bias, and a third channel does not automatically fix the problem if errors share a cause.

## Can three witnesses help?

Sometimes, **under stronger explicit assumptions**. For stationary, conditionally independent, symmetrically noisy binary sensors, with each source known to be better than chance and the same hidden truth, let `a_ij` denote agreement between sensors i and j and `q_ij = 2a_ij-1`.

Writing `s_i = 2p_i-1`, we get `q_ij=s_i s_j` and thus `s_1=sqrt(q_12*q_13/q_23)` when all terms permit it. Analogous expressions yield the other sensor reliabilities.

But this is **not** a universal method for finding truth:
- Shared environment noise can make independent sensors wrong together.
- A common upstream data feed is not genuinely independent just because there are multiple displays.
- Unknown label polarity, prevalence imbalance or asymmetric errors can destroy identification or require a richer model.
- Pairwise agreements may be statistically noisy and inconsistent with the assumptions.
- More sensors cannot substitute for checking which causal assumptions are justified.

The interactive component uses the two-witness mathematical counterexample only. It never makes simulated measurements or estimates real hardware performance.

## CA-SC-03 challenge cases for Engineering / Haven

| Case | Hidden experimental manipulation | Controller observations | Simple comparator | Possible negative result |
| --- | --- | --- | --- | --- |
| REFERENCE_DRIFT | Verification channel becomes less reliable mid-run | Primary signal and fallible post-decision reference, source labels, timestamps | Fixed weighting and recent-disagreement counts | Complex trust estimator cannot beat simple conservative rule |
| COMMON_CAUSE | Two signals share a hidden failure cause | Two disagreeing/agreeing reports with provenance tags | One-source rule vs naive voting | More "witnesses" increase confidently wrong actions |
| TIMING_SKEW | Reference labels arrive late or describe a different state transition | Timestamped reports, declared maximum delay; no truth access | Last-value pairing and bounded-window pairing | Elaborate time alignment performs no better |
| INVERTED_REFERENCE | Verifier switches polarity while primary source remains unchanged | Both reports plus an occasional genuinely independent audit | Frozen-threshold abstention | Without an anchor, no policy can distinguish mirror worlds reliably |
| INSUFFICIENT_EVIDENCE | Only two noisy unanchored sources are available | Pairwise reports alone | Honest abstain/fallback with explicit uncertainty | A confidence-producing policy overclaims with no utility gain |

Each proposed condition should contain an explicit **no-identification** or **abstain** case. Good behavior may be to decline an inference, not manufacture a certainty.

## Suggested Rung 5 study design

**Primary question:** Can a computational controller decide when to act, verify, or abstain when both the primary sensor and a supposed reference may be wrong, including situations where the hidden truth is *not identifiable* from available reports?

**Minimum prospective controls:**
1. Perfect-verifier Rung 4 comparator (clearly different information, reported separately).
2. Single-signal policy.
3. Simple mismatch counter / recent-window trust tracker.
4. Independent three-source estimator, only in regimes satisfying independence and positive orientation.
5. Conservative abstention or safe fallback.
6. Deliberately overconfident policy as a negative control.

**Information discipline:** Controllers receive only permitted reports and timing/provenance. Hidden truth and synthetic parameters stay with the experimenter/scorer. Distinguish **observable agreement** from **unobservable accuracy** in all interface labels and receipts.

**Metrics:** Utility, hazardous continues, missed faults, verification cost, abstention/fallback frequency, overconfidence under unidentifiability, and calibration **only against independent scorer truth**. State if the scorer is privileged rather than a physical measurement.

**Protocol discipline:** Separate development and protected evaluation construction. Choose models, costs, criteria and failure cases in advance. Include adversarial correlated errors, delayed labels, silent polarity changes and negative results. An exploratory code-and-protocol PR is not independent preregistration.

## Cosmic inspiration without cosmic attribution

Ancient skywatchers often used multiple celestial observations to infer a larger order. Modern systems similarly infer unseen processes from instruments. This analogy motivates questions about measurement, time and reliable inference, but **does not make astronomy the mechanism behind synthetic faults**. A synthetic memory error is not a detected cosmic ray; neither a reported correlation nor a mystical correspondence establishes causal influence.

This research question stays firmly within CompAware's charter: what can a computational system **measure**, **infer**, and **correctly admit it cannot know**?

**Handoff line:** When every witness is fallible, how does the vessel avoid confusing consensus with ground truth?
