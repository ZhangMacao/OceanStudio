# Fixed-condition compact funnel-docking study

These native UE recordings show three deliberately distinct control stages in a
Codex-driven experiment: lateral drift, coarse heading control, and terminal LOS
docking control. The page diagram illustrates the outer research loop; it
does not run an agent or simulator in the visitor's browser. Failed trials and
development probes are retained privately. This is a controlled demonstration,
not a general performance ranking of controller families.

## Station and fixed task

The yellow native TorpedoAUV approaches the original open funnel cage and its
table/support frame, restored at 75% of their previous dimensions. The AUV size
is unchanged. The cage is 2.25 m long, with a 0.54 m entrance radius tapering
linearly to a 0.24 m throat radius. There is one central green optical beacon
and one native UE spotlight; the station has no lights around the entrance.

The station was authored and cooked for Linux with UE 5.3.2. Its isolated content
package references the existing TrenchReef world without modifying that package.
Rendered environment assets retain the [existing scene asset notices](../scenes/README.md).

All three published runs use the same initial NED position
`[-158, -109.6, 26.5] m`, zero initial velocity and yaw, mouth position
`[-145, -110, 26.5] m`, COM target `[-143.9, -110, 26.5] m`, and fixed current
`[-0.65, 0.05, 0] m/s`. The native SDK Torpedo Fossen model is unchanged: fin lift,
deflection limits, propeller limits and actuator lag remain active. Reverse
braking uses the existing signed-RPM model. There is no virtual lateral or heave
thruster and no AUV pose scripting after initialization.

## Independent evaluation

Each run lasts 60 seconds at a forced 0.02 s engine step. The independent
evaluator reads 3,001 saved native state samples, verifies completeness and
checks the step from observed velocity and acceleration. Success requires cage
entry, position error at most 0.15 m, speed at most 0.10 m/s and heading error at
most 5 degrees for three continuous seconds. The task and criteria were frozen
before the matched recordings. Hold duration counts intervals between
consecutive qualifying samples; the first sample contributes zero elapsed time.

| Recording | Control stage | Forward progress | Final position error | Stable hold | Verdict |
| --- | --- | --- | --- | --- | --- |
| 01 | Forward speed/depth/heading hold, without lateral position correction | 14.08978 m | 2.69778 m | 0 s | Not met |
| 02 | Initial-bearing heading and speed feedback, without terminal alignment | 13.74178 m | 2.77960 m | 0 s | Not met |
| 03 | Current-compensated LOS, damped guidance and stable depth/speed control | 14.09062 m | 0.01462 m | 16.20 s | Passed |

Stage 01 advances 14.08978 m while drifting 2.29773 m sideways from its initial
position. Its maximum depth error is 0.01793 m; the brief startup backward
excursion is 0.01082 m. It misses the cage laterally rather than retreating.
The original underpowered take is retained privately and has been replaced only
in the first tab. Stage 02 and 03 recordings and posters retain their published
bytes. These are different failure modes, not a monotonic improvement in every
scalar metric. Stage 02 approaches but remains offset from the receiver. Stage 03
first completes the three-second acceptance window at 46.80 s; its final speed is
0.00126 m/s and heading error 4.54293 degrees. All three native engines exited
normally and all observed time-step checks passed.

Navigation uses native COM truth. The optical marker is a scene cue; the
controller does not estimate pose from RGB images. Success means geometric entry
and low-speed hold, without a mechanical latch or an electrical charging model.
These single-condition, uncalibrated simulations do not establish real-world or
general disturbance robustness.

## Media and evidence

Each master contains 1,501 native 2560 × 1440 RGB observations at 25 Hz. The
independent camera follows the same framing rule in each run. AUV motion is
produced by force-derived accelerations integrated by UE. Public MP4s show the
complete experiment at **2× playback**, encoded at
25 fps. The plotted scalar error curve contains half-second means derived from
saved states; the playhead maps back to experiment time.

[study.json](study.json) contains curated metrics, media properties and hashes.
Study ID: `compact-funnel-fixed-v1`; frozen study SHA-256:
`1c5ec61f8513ce48692991b305406aac6e4ba8b3f37786983317f9c0744a3459`.
Platform base: `5a3e1fb1c3313db91fc25954a7ecb2ebc4a03a9b`.
The regulator remains a separate namespaced private plugin; existing reference
algorithms and Fossen code were not edited. The task uses a private experimental
adapter, not a generic docking or vision mission in the unified CLI. Source,
capture tools, raw telemetry, UE projects, cooked packages and profiles remain
private. The task design follows staged approach and terminal guidance ideas
described in [Page et al., 2021](https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2021.621755/full)
and [Fossen's LOS research](https://www.fossen.biz/php/research/path_following.php).
This demonstration does not reproduce those papers' results.
