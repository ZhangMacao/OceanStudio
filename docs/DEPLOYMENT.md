# Project website

The public website is a buildless, bilingual static page. GitHub Pages serves the `docs/` directory; it has no connection to the simulation backend.

## Publication boundary

Publish only `index.html`, `styles.css`, `app.js`, `gallery.js`, `.nojekyll`, and the explicitly selected assets under `assets/`: the transparent logo and favicon, Manrope font and its OFL license, selected stills and the finished English film, and the capability clips, their posters and public manifest. The platform source, editable video package, recording scripts, raw captures, experiment data, credentials, and machine configuration are excluded.

The MP4 is the accepted English final film, not the editable video project. Screenshots are selected frames from that film. Native controls support playback, volume, fullscreen, and seeking. The chapter buttons jump to the film's existing chapter boundaries. Language changes translate the webpage and preserve the video element and playback position; the featured film stays English.

## Capability gallery

The **Highly configurable / Highly extensible** sections replace the former configuration tabs. Their 22 short clips are independent recordings of the development platform, not excerpts from the overview film. Twelve cards cover configuration, and ten cover resource or algorithm extensions. The initial recordings use `b9786ddf`; after updating the isolated server to `5a3e1fb1`, five cards were refreshed for the new terrain assets. The other seventeen MP4s and WebMs retain their original bytes. The manifest at `assets/media/capabilities/manifest.json` records descriptions, scope, duration, resolution, source revisions and SHA-256 for each published video.

The sections are stacked, configuration first and extension second. Desktop uses four cards per row, tablet three, and narrow layouts two or one. Each card shows only the video and a single-line feature title; descriptions, runtime scope, capture type, duration and acceleration details are available in the enlarged player. Titles use a medium-weight sans-serif face, fit between 18 and 22 CSS pixels without truncation, and refit on language, font-load and width changes. The controller card is labeled “Controllers & tuning” / “多种控制器与调参”. Existing videos and posters are unchanged by this layout revision.

UI clips show real Playwright browser interactions. CLI clips show actual scaffold creation, the append-only change gate and pinned registration validation in an isolated plugin workspace. Registration checks do not establish algorithm behavior or native UE compatibility. The robot import shows a design/reference package.

The world-package clip shows real UE 5.3.2 package inspections and the installed scene library. This was an administrative migration of a prebuilt Linux package: same-version Windows UnrealPak checked pak integrity, declared map/resource boundaries, IoStore metadata and collisions against the target Linux runtime indexes before the verified files were installed atomically in the isolated server store. The server has no Linux editor/UnrealPak installation, so its normal browser upload and source-project conversion remain unavailable until those tools are configured. No host validation code was changed. Engine tools, packages and inspection scripts stay private.

TrenchCanyon, TrenchReef and TrenchRift each completed a new four-second native Hovering hold run, with 201 state frames, two RGB streams of 101 frames each, and 21 sonar samples. All three hold evaluations passed. Sonar at the default TrenchReef Hovering spawn had no returns in this orientation; the samples were present and finite. The twenty-second Torpedo Fossen cruise used for the refreshed evaluation card passed its independent saved criteria, with 1,001 state frames, RGB streams of 201 / 501 frames and 101 nonzero sonar samples. These checks cover this machine and these configurations, not general navigation or collision avoidance. The earlier twelve-second S-curve recording was complete but did not meet the default full-wavelength progress requirement; it is retained privately and is no longer the gallery replay.

Browser terrain is the registered static GLB. It preserves the scene geometry with a simplified sand surface; UE water, fog, dynamic lighting and post-processing are rendered in native camera observations separately. The footage does not claim identical pixels across the two renderers.

Each clip is supplied as a 1080p H.264 MP4 and a VP9 WebM. Playback prefers WebM where supported; downloads and no-JavaScript links use MP4. Accelerated edits, if needed to keep a clip brief, are labeled with their playback rate.

Muted previews load only when visible, with at most four playing at once. They pause outside the viewport, when the document is hidden, while the overview film plays, or while the video dialog is open. Reduced-motion preferences disable automatic playback. Every clip opens in a keyboard-accessible dialog with native playback controls and a direct download link. Without JavaScript, the cards still link directly to the MP4s. Language changes preserve the video elements and current dialog playback.

## Hosting

Default project URL: `https://zhangmacao.github.io/OceanStudio/`.

`https://oceanstudio.github.io/` requires control of the GitHub user or organization `OceanStudio` and its `OceanStudio.github.io` repository. An unrelated account cannot obtain this URL through a repository name or a CNAME file. All local asset links are relative so the site can be migrated after the correct ownership or an independently controlled custom domain is available. Update the canonical URL and Open Graph image/URL when migrating.

Select **Settings → Pages → Deploy from a branch → main → /docs**. No npm build or simulator installation is required. Preview with any static server from this directory.

The live URL accepts `?lang=en` and `?lang=zh`; an explicit URL language takes precedence over the saved language preference. A first visit defaults to English.
