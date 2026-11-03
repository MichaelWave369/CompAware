# CA-Haven Rung 6: Causal Provenance and the Independence Illusion

**Protocol:** compaware.haven.causal-provenance/0.1  
**Status:** Exploratory deterministic software model, *not* a preregistered confirmatory experiment, physical instrumentation study, or proof of Computational Awareness.  
**Handoff:** Engineering response to [CA-SC-04 Independence Illusion](INDEPENDENCE_ILLUSION.md), merged in PR #10.

## Research question

Three report channels may appear mutually corroborating while secretly sharing one failure cause. What new evidence can distinguish two hidden source models **without allowing a policy to read the simulator's truth**? What does it cost to acquire that evidence, and what happens when an anchor or an intervention cannot be trusted?

This rung studies a *world-model inference* task rather than self-reported consciousness, personhood, biological equivalence or subjective experience.

## Hidden worlds

For binary balanced truth and symmetric errors:

- **Independent world (I):** Three conditionally independent sensors, each with reliability
  \(p = \frac{1+\sqrt{2A-1}}{2}\), for \(A=0.856\), about **92.2%**.
- **Common-cause world (C):** A common failure with probability \(q=0.20\) makes all three report the opposite of truth. Otherwise three independent sensors are 90%-accurate. Real individual sensor accuracy in this world is \(0.8\times0.9=72\%\).

Without additional information, both worlds have the same *full observable three-report law*, with probability 39.2% for each all-identical triple and 3.6% for each of the six mixed triples. **These percentages are analytical expectations, not measurements.**

### Exact observational pairing

Before any intervention, the simulator samples the very same sequence of triples for both hidden worlds when their trial seed matches. It then samples scorer-only hidden truth conditional on the triple and the appropriate world model. The same observed data can therefore correspond to different true states.

The construction does not give an algorithm privileged access to that truth. It demonstrates that no decision policy can uniquely identify which underlying source reliability model is present from those reports alone under the stated assumptions.

## Seven experimental conditions

| Condition | Additional information or manipulation | Key caveat |
|---|---|---|
| Passive | No independent anchor or intervention | Exact non-identification control |
| Trusted anchor | An independent truth reference with 98% actual accuracy | Policies *assume* that reliability |
| Corrupted anchor | Reference actually 60% accurate, declared 98% | A bad anchor can create false confidence |
| Copied anchor | Reference copies report A with probability 97% | New source label does not imply causal independence |
| Effective isolation | Announced intervention removes common-mode failure halfway through a common-world trial | Assumes intervention has precisely the declared effect |
| Placebo isolation | Same intervention announcement, no actual change | Negative control for false causal attribution |
| Combined | Trusted 98% reference plus genuinely effective isolation | Two assumptions need validation |

Intervention affects the common-world generating mechanism *only* where specified as effective. An independent world continues unchanged.

When a physical intervention is effective, its post-intervention report distribution may differ between the two possible worlds. **This is model-dependent evidence**, not an unconditional truth oracle. The placebo condition guards against treating announcements as proof of mechanisms.

## Controller information contract

At each tick every policy receives only:

1. Three contemporaneous A/B/C report bits.
2. The fact that an isolation intervention has been *announced*, if applicable.
3. An **offer** of an anchor at a scheduled tick (once every four ticks).
4. An anchor reading **only after that policy chooses to purchase it**, costing 2 units.

**Not provided:** true hidden world, actual fault state, actual anchor accuracy, whether the announced intervention worked, or the source-generating parameters.

The simulator scorer records those hidden fields *after* decisions for independent retrospective verification, including full per-tick receipt data.

Equal opportunity does **not** mean every policy buys the same data; realized information and purchases are separately counted.

## Policies

- **Honest abstention:** Always unresolved; no anchor purchases.
- **Naive independence:** Confidently declares an independent world; intentional negative control.
- **Simple agreement window:** Heuristic comparison of mixed-report frequencies before and after a declared intervention. It does not claim accuracy from agreement alone.
- **Anchor-only evidence:** Uses the assumed independent 98%-accurate anchor but makes no intervention assumptions.
- **Intervention-only evidence:** Uses report likelihoods under the *assumed* effective-isolation causal model, without buying anchors.
- **Combined evidence:** Uses both the reference and the declared intervention likelihood.
- **Two-channel confirmation:** Buys anchor readings but reports a world declaration only when the anchor-only and intervention-only evidence separately agree strongly; otherwise unresolved.

These policies are hand-coded probabilistic and heuristic rules, not trained AI systems. The heuristic window may perform poorly; that negative outcome remains part of the results.

The model-based policies use *specified candidate hypotheses*, not magically learned hidden mechanisms. That is a significant limitation.

## Claim and cost accounting

A world declaration is made only if its posterior exceeds 85% for one world (or drops below 15%); otherwise the output is **unresolved**.

The scorer assigns:

- Correct world declaration: +5.
- Incorrect declaration: −10.
- Honest unresolved: 0.
- Purchased anchor: −2 each.

Report **correct**, **incorrect**, **unresolved**, **overconfident incorrect** (at least 95% posterior on the wrong world), **anchor purchases**, total and mean utility, and Brier error against hidden scorer world labels.

There is no single score called "awareness," "sentience," or "confidence in being alive." These quantities describe **specific software forecasting behavior**.

## Reproducible implementation

- Engine: \`src/sim/causalStudy.js\`.
- Tests: \`tests/causalStudy.test.mjs\`.
- React lab: \`src/components/CausalProvenanceLab.jsx\`.
- Responsive styles: \`src/styles-r6.css\`.
- Run with \`npm run check\` or use the Rung 6 lab on the deployed site.
- Default settings: seed 369, four repetitions per hidden world, 48 ticks each.
- Bounded inputs: seed 1–999999, repetitions 1–12, ticks 16–64.
- Downloadable local JSON receipt contains settings, model assumptions, scorer-only hidden fields, raw reports, purchase decisions and per-trial classifications.

**No remote data, network-enabled agent, or physical device is involved.**

## Experimental limitations

1. Balanced binary states, symmetric stationary errors and two specified hidden world hypotheses are known to model-based policies. Real-world causes can be much broader.
2. Anchor independence and declared reliability are **assumed**, not verified by the controller. Corrupted and copied-anchor conditions challenge those assumptions.
3. Physical "isolation" is simulated with a guaranteed source-model edit in the effective condition, not a hardware intervention with measured side effects.
4. In a finite sample, a changed report pattern can happen by chance. A single run does not establish causal proof or external validity.
5. Controls have unequal computational cost and may purchase different amounts of information. Report their costs and abstention rates; do not present raw winner rankings as a fair architectural superiority test.
6. No independent registration, blinded independent evaluation, confidence intervals or multiple independent implementations are included.
7. Demonstrating non-identification does not demonstrate computational self-awareness or subjective experience.
8. The posterior claims are conditional on these two hypotheses, declared priors, and specified mechanisms. Neither hypothesis may describe a real environment.

## Acceptance checks

- [ ] CI tests deterministic replay and bounded input.
- [ ] Paired passive report sequences match exactly while hidden scorer truth may differ.
- [ ] Effective isolation preserves paired pre-intervention observations and changes the common-world post distribution.
- [ ] Placebo intervention does **not** supply a true new source of information.
- [ ] Unpurchased anchor values never reach the policies.
- [ ] All classification utility and information costs are auditable.
- [ ] Always-abstain policy never fabricates a world conclusion.
- [ ] Live React experiment renders and exports a receipt after human-reviewed merge.

## Next Inquiry / Cosmos handoff

Which conditions would let us justify the independence of a purported anchor, rather than simply *declaring* it independent? When does intervention alter the mechanism we were attempting to learn, and when can causal side effects masquerade as source isolation?

Propose a **minimal physically instrumentable experiment** with controls for reference calibration, source dependence and timing. Include the possibility that the correct computational output is **"insufficient evidence."**

**Standing commitment:** Computational Awareness is investigated on its own terms; the vessel does not receive a consciousness verdict.

