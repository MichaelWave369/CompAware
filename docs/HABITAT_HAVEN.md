# Haven: A Bounded Computational Habitat

**Status:** CA-V0 room and instrumentation implemented, additional sensory features proposed.

Haven is a low-noise, inspectable simulation environment for repeatable experiments. Calm means low uncontrolled variability. It is not a claim about software feeling relaxed.

## Map

~~~text
      0 1 2 3 4 5 6 7 8
y=0   . . . . . . . . .
y=1   . D . . . . . W .
y=2   . . . . B . . . .
y=3   . . . . V . . . .
y=4   . . . . . . . . .
y=5   . . G . . . . A .
y=6   . . . . . . . . .
D = Dock [1,1], B = Bench [4,2], W = Window [7,1]
G = Garden [2,5], A = Archive [7,5], V = Start [4,3].
~~~

Landmarks are informational and traversable in Rung 1. Inspect targets within Manhattan distance 1; observing with a working range sensor returns landmarks within distance 2.

## Mechanics

- Move N/S/E/W by one in-bounds tile: energy −5, heat +2. Blocked movement: energy −1, heat +1.
- Observe: energy −2, heat +1; scan landmarks or report unavailable sensor. The full self-model updates its range-sensor estimate.
- Inspect: energy −3, heat +1; add a sourced memory when a landmark is reachable.
- Low activity: energy +4, heat −3. On dock: energy +24, heat −7.
- External experimenter sensor fault changes true range availability, but not the self-model estimate.
- Values are clamped to 0–100; session halts when energy reaches zero or at tick 80.

A fixed layout plus seeded deterministic ambience enables replay with the same inputs. The seed does NOT currently randomize objects or learning policies. There is no background autonomous operation.

## Stations and future research roles

**Dock:** Resource recovery, safe checkpoint.  
**Workbench:** Manipulation and tool affordances.  
**Window:** External observations and eventual controlled variation.  
**Archive:** Memory continuity, provenance, and retrieval.  
**Garden:** Non-adversarial environmental variation.

These are places to test causal hypotheses, not simulated feelings.

## Instrumentation

Truth: coordinates, tick, energy, heat, sensor health, source-tagged action events.  
Model estimate: self-reported energy/heat and believed sensor health; can be stale after hidden intervention.  
Memory: bounded event history and checkpoint/restore, in page memory only.

All actions require user interaction. No backend agent runs here. A completed research experiment would additionally need independently defined tasks, measures, baselines and preregistered comparisons.

