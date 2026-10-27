# Fixed-condition torpedo docking study

These are native UE recordings of three control candidates, selected during a
Codex-driven study. The webpage diagram illustrates the outer research loop; it
does not run an agent or simulator in the visitor's browser. The website presents
the final matched recordings, including both failed candidates.

The scene uses the platform's yellow TorpedoAUV and an original hollow funnel,
3 m long with 1.44 m entrance diameter and 0.64 m throat diameter. There is one
central green optical beacon and one native UE spot light. That small scene
package was created and cooked for Linux with UE 5.3.2; the existing TrenchReef
world is streamed without modifying its original package. Rendered environment
assets retain the [existing scene asset notices](../scenes/README.md).

## Conditions and acceptance

All published candidates share the same initial NED position
`[-158, -109.6, 26.5] m`, zero initial velocity, zero initial yaw, target
`[-143.2, -110, 26.5] m`, and fixed head-current `[-0.25, 0, 0] m/s`.
The native SDK Torpedo Fossen model is unchanged: fin lift, finite deflection,
propeller limits and actuator lag remain active. Reverse braking uses the SDK's
existing signed-RPM propeller model. There is no virtual lateral or heave thrust.

Each run is 60 seconds at a forced 0.02 s engine step. The independent evaluator
reads 3,001 saved native state samples and checks completeness and the measured
velocity/acceleration time step. A successful interval requires the AUV to be
inside the funnel, within 0.15 m of the fixed target, below 0.10 m/s, and within
5 degrees of the dock heading for at least three continuous seconds. The criteria
and environment are frozen before the final comparison. Hold duration counts
intervals between consecutive qualifying samples; the first sample contributes
zero elapsed time. Original reports are retained alongside this conservative
interval audit.

| Recording | Revision | Final position error | Final speed | Continuous hold | Verdict |
| --- | --- | --- | --- | --- | --- |
| 01 | LOS + proportional speed | 0.16687 m | 0.00114 m/s | 0 s | Not met |
| 02 | Model compensation + reversible braking | 0.34304 m | 0.00290 m/s | 0 s | Not met |
| 03 | Decoupled anti-windup, damped/integral guidance | 0.12008 m | 0.00372 m/s | 15.00 s | Passed |

The second candidate is worse than the baseline; it is retained. For candidate
03, the first accepted three-second window ends at 48.00 s and the final heading
error is 3.48083 degrees. All three native engines exited normally. The current
study uses native COM truth for LOS navigation and control. The central optical
marker is a scene cue; the controller does not estimate pose from RGB images.
This is geometric entry and low-speed hold, without a mechanical latch or an
electrical charging model. The model is uncalibrated and these three runs at one
fixed condition do not establish real-world or general disturbance robustness.

## Media and evidence

Each master contains 1,501 native 2560 × 1440 RGB observations at 25 Hz. The
independent camera is choreographed; after initialization, the AUV moves only
through force-derived accelerations integrated by UE. The public MP4s show the
complete run at **2× playback**, encoded at 25 fps, with no synthesized robot
motion. The plotted error curve contains half-second means derived from the
native records; its playhead maps to experiment time. The raw states and capture
tools remain private.

[study.json](study.json) contains the curated metric summary, media properties
and hashes. The frozen study digest is
`6abc269482c0df72a282f679e22d59dea312863fba7512b3fb8bda30a981d28a`.
Platform base: `5a3e1fb1c3313db91fc25954a7ecb2ebc4a03a9b`. The new regulator
is a namespaced private plugin; existing reference algorithms and Fossen code
were not edited. The task uses a private experimental adapter; it does not add a
generic docking or vision mission to the current unified CLI. Development probes,
rejected setups and clock corrections are retained separately from the matched
final recordings. Platform source, models, world packages, the UE project and
per-frame telemetry are not published.

The task design draws on staged funnel approach and terminal beacon homing in
[Page et al., 2021](https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2021.621755/full),
and the separation of LOS guidance and vehicle control described in
[Fossen's path-following research](https://www.fossen.biz/php/research/path_following.php).
This is a platform demonstration, not a reproduction of those papers' results.
