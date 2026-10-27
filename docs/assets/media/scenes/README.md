# Native UE scene films

Four new films were captured on 2026-10-27 from TrenchReefScenes 1.0.0 in the UE 5.3.2 / HoloOcean 2.4 Linux runtime. Each contains 300 native RGB frames at 2560 × 1440, encoded on a 30 fps, ten-second timeline. An independent native camera carrier supplies the view; no browser preview is used in these films. Epic render quality and native scene materials, light and fog are retained.

The vehicle and camera paths are choreographed, prescribed poses. They illustrate the scenes and possible experiment settings, not autonomous planning, collision avoidance or a validated closed-loop controller. The fleet film contains one Torpedo AUV and two HoveringAUV vehicles used as ROVs. There is no tether model.

The loaded maps were checked in UE logs. PoseSensor readbacks for the robots and camera were checked at every recorded tick; maximum translation error was below 0.000012 m. All four native engines exited normally. The raw RGB stream and original master hashes are recorded alongside the publication hashes in the public [media manifest](../capabilities/manifest.json). Independent exposure timestamps are not supplied by the SDK. The 30 fps value describes the video timeline, not real-time simulator performance: the captures took about 24–30 seconds each including startup and encoding.

The downloadable H.264 MP4s retain 2560 × 1440 and all 300 frames. The VP9 WebM previews are 1920 × 1080; no frames are synthesized or added. The enlarged player selects the 1440p MP4. Raw frames, trajectory files, engine tools, world/model packages, capture scripts and machine configuration are private. Existing platform recordings and the English overview film are unchanged.

## Continuous website reel

The website uses one window titled “兼容多种任务实验” / “Support for diverse experiments”. `scene-reel.mp4` and `scene-reel.webm` join the four delivery streams in their original order, retaining all 1,200 frames on an approximately forty-second loop. They are concatenated without re-encoding; resolution and frame rate are preserved. Both the page preview and enlarged player show the complete reel, without individual scene-name captions. The original files and their provenance remain available in the manifest.

## Asset credits

- **Sunk Boat**, by **Just-Peeps (Gatturnart)**: https://sketchfab.com/3d-models/sunk-boat-1a7ea3a4abf647b5858fb3f9b9cb0121 — **CC BY 4.0**, https://creativecommons.org/licenses/by/4.0/. Changes: mesh normalized and scaled, texture resolution adjusted, normal-channel conversion, recoloring and buried placement.
- **Coast Sand 03**: https://polyhaven.com/a/coast_sand_03, and **Sand Rocks Small 01**: https://polyhaven.com/a/sand_rocks_small_01, by **Poly Haven**, **CC0**: https://polyhaven.com/license. Textures and rock meshes were adapted for the scene.
- Additional ocean-floor assets were supplied under the project owner's acquired license. Source-asset redistribution is not granted by publishing these rendered films.
- Continuous trench terrain, procedural vegetation, scene layout, material work and camera choreography: OceanStudio project contributors. HoloOcean vehicle models/runtime: BYU FRoSt Lab / HoloOcean contributors. This film publication does not relicense the underlying third-party assets.
