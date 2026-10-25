# Project website

The public website is a buildless, bilingual static page. GitHub Pages serves the `docs/` directory; it has no connection to the simulation backend.

## Publication boundary

Publish only `index.html`, `styles.css`, `app.js`, `.nojekyll`, and the explicitly selected assets under `assets/`: the transparent logo and favicon, Manrope font and its OFL license, stills extracted from the English final film, and that finished MP4. The platform source, editable video package, recording scripts, experiment data, credentials, and machine configuration are excluded.

The MP4 is the accepted English final film, not the editable video project. Screenshots are selected frames from that film. Native controls support playback, volume, fullscreen, and seeking. The chapter buttons jump to the film's existing chapter boundaries. Language changes translate the webpage and preserve the video element and playback position; the featured film stays English.

## Hosting

Default project URL: `https://zhangmacao.github.io/OceanStudio/`.

`https://oceanstudio.github.io/` requires control of the GitHub user or organization `OceanStudio` and its `OceanStudio.github.io` repository. An unrelated account cannot obtain this URL through a repository name or a CNAME file. All local asset links are relative so the site can be migrated after the correct ownership or an independently controlled custom domain is available. Update the canonical URL and Open Graph image/URL when migrating.

Select **Settings → Pages → Deploy from a branch → main → /docs**. No npm build or simulator installation is required. Preview with any static server from this directory.

The live URL accepts `?lang=en` and `?lang=zh`; an explicit URL language takes precedence over the saved language preference. A first visit defaults to English.
