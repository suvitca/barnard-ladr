# Notes for Claude Code

Eleventy 3 static site for the Barnard LADR lab, deployed to GitHub Pages via `.github/workflows/deploy.yml`.

- Content lives in `src/_data/*.yml`; prefer editing data over templates. Keep the instruction comments at the top of each YAML file intact. The PI edits these by hand on github.com.
- One layout only (`src/_includes/base.njk`). Don't add new page types or layouts; the PI wants every page to feel like part of one site with the sidebar always visible.
- Images and files are referenced by bare file name and resolved with the `img` / `file` filters, which fall back to the old Columbia site if a file isn't in `src/assets/` yet.
- Links in templates are written root-relative (`/people/`); a transform in `eleventy.config.js` makes them relative at build time. Don't hard-code a path prefix.
- Design tokens are in `:root` in `src/assets/css/site.css`. Fonts: Schibsted Grotesk (UI/headings), Source Serif 4 (body).
- Check work with `npm run build`, and preview with `npm start`.
