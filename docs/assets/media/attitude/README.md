# IMU attitude-control study

The three videos visualize measured ROV attitude-control experiments in the
native UE TrenchReef world. After the controller runs, their measured poses were
re-rendered from one closer canyon-facing camera with fixed reference markers.
The videos are checked native pose replays, not new controller runs. The metrics
and curves come from the original force-integrated recordings.

## Matched experiment

HoveringAUV uses the unchanged reference Hovering Fossen model and eight-thruster
allocation, including the existing thrust limits and lag. All final candidates
share initial state, a 0.55/0.30 m/s horizontal current, deterministic bounded
multisine forces/moments, 50 Hz physics, IMU noise settings, estimator and
translation support. Every controller has the same 1.8 rad/s² request limit.
There are no prescribed vehicle poses after initialization in these original
controller runs. The reference model and wrench are not hardware calibration or
CFD turbulence.

Native IMUSensor acceleration and angular velocity feed a complementary attitude
estimator initialized level. Controllers use estimated roll/pitch and measured
rates. Native truth is reserved for plant integration and independent evaluation.
An identical truth-aided position/velocity support loop isolates the attitude
comparison; this is not IMU-only localization or position holding.

| Candidate | Attitude RMS | Attitude P95 | Rate RMS | Stable hold | Result |
| --- | ---: | ---: | ---: | ---: | --- |
| PID | 8.7235° | 13.6991° | 7.3897°/s | 1.26 s | not met |
| Sliding correction | 2.2067° | 3.6807° | 1.4817°/s | 13.04 s | not met |
| Disturbance observer | 0.3257° | 0.5173° | 0.5485°/s | 25.00 s | passed |

Evaluation covers seconds 5–30. Attitude error is the Euclidean norm of roll and
pitch angles; angular rate uses body roll/pitch rates. Criteria were fixed before
comparison: RMS ≤2°, P95 ≤3°, rate RMS ≤8°/s, plus ≥5 s continuously within
3° attitude and 10°/s rate. These are single-condition results, not a broad
benchmark. Five development runs and all three matched final runs are retained
privately, including all failed candidates. Thresholds were not lowered.

## Rendering and provenance

Each original run contains 1,501 state samples at independently verified 0.02 s
steps and 751 original camera frames. The closer camera replays those measured
poses through UE and checks native pose readbacks against every source state;
per-video maximum differences are recorded in study.json. The fixed reference
point, dashed vertical guide and level ring are display-only native debug
geometry, identical in all variants. The ring sits 0.38 m below the target and
has radius 0.45 m; the upper handle is 0.55 m above the target. They do not enter the
controller or physical model.

The presentation keeps 2560 × 1440 resolution and plays at 2×: 376 frames,
25 fps, 15.04 s per clip. Each poster is extracted at experiment time 25 s.
The curve is a half-second aggregate of independently measured truth angles,
using the same vertical scale for all candidates. All native engines exited
normally. No real-time performance claim is made.

The engine fixed-seed option was enabled; no custom numerical seed is claimed.
Input and normalized study-snapshot hashes are both retained because the Windows
input used CRLF while Linux text snapshots used LF; parsed study contents are
checked equal. Source, plugin, evaluator, telemetry, raw RGB, video and poster
hashes accompany the curated summary. Source algorithms, raw per-frame data,
UE assets/projects, capture tools and private configuration are not published.

ROV and ocean-floor imagery comes from the project owner's licensed native
runtime/world assets. Rendering, reference markers and experiment design are by
OceanStudio. These are native render extractions, not AI-generated images.
