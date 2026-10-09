# Barnard LADR website

Website for the Language Acquisition and Development Research Laboratory (Ann Senghas, Barnard College).

Every page uses the same sidebar layout. All of the content that changes — people, projects, publications, news — lives in plain-text files in **`src/_data/`**, so updating the site means editing a list, not HTML.

## Updating the site (no coding needed)

You can do all of this in a web browser on github.com:

1. Open the repository on GitHub and go to the file you want (table below).
2. Click the pencil icon (**Edit this file**).
3. Make your change, following the instructions at the top of each file.
4. Click **Commit changes**. The live site updates within about two minutes.

| To change… | Edit this file |
| --- | --- |
| Lab members, former members, collaborators | `src/_data/people.yml` |
| Research projects (tiles + project pages) | `src/_data/projects.yml` |
| Publications | `src/_data/publications.yml` |
| News items | `src/_data/news.yml` |
| CV, email, address, menu, home-page numbers | `src/_data/site.yml` |
| "About NSL" text | `src/about-nsl.md` |
| "For Students" text | `src/for-students.md` |

### Common tasks

**Add a new lab member.** In `people.yml`, copy an existing current member's block, paste it below, change the details. To add a photo, upload it to `src/assets/img/` (on GitHub: open that folder → **Add file → Upload files**) and put its file name after `photo:`.

**Someone leaves the lab.** Change their `group: current` to `group: former` and add `years: "2022–2026"` and a `now:` line. They move to the Former Members section automatically.

**Upload a new CV.** Upload the PDF to `src/assets/files/`, then in `site.yml` change `cv:` to the new file name and update `cv_updated:`. Every "Download CV" button on the site updates.

**Add a paper with a downloadable PDF.** Upload the PDF to `src/assets/files/papers/`, then add an entry at the top of `publications.yml` with `pdf: "filename.pdf"`.

**Add a research project.** Copy a block in `projects.yml`, give it a new `slug` (short, lowercase-with-dashes), and edit. A tile and a project page are created automatically.

> YAML tip: indentation matters. Keep new lines lined up with the lines around them, and keep text inside quotes. If the site stops updating after an edit, open the **Actions** tab on GitHub. A red ✗ shows the line with the problem.

## First-time setup (for whoever sets up the repository)

1. Create a new repository on GitHub (e.g. `barnard-ladr`) and push this folder to it:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/barnard-ladr.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Wait for the green ✓ in the **Actions** tab. The site is at `https://YOUR-USERNAME.github.io/barnard-ladr/`.
4. Copy images and the CV over from the old Columbia site so the new site doesn't depend on it:
   ```bash
   bash scripts/copy-old-site-files.sh
   git add src/assets && git commit -m "Copy images from old site" && git push
   ```
   (Already done: the photos and CV are in `src/assets/`. Only needed again if you add files to the old site.)

Optional: to use a custom domain (e.g. `ladr.barnard.edu`), add it under **Settings → Pages → Custom domain** and ask Barnard IT to point the domain at GitHub Pages. Links are relative, so the site works at any address.

## Working on it locally

Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm start        # preview at http://localhost:8080, reloads as you edit
npm run build    # writes the finished site to _site/
```

## How it's built

- [Eleventy](https://www.11ty.dev) static site generator; templates are Nunjucks (`.njk`).
- `src/_includes/base.njk`: the one shared layout (sidebar, footer).
- `src/_includes/macros.njk`: tiles for people, projects, publications.
- `src/assets/css/site.css`: all styles; colors and fonts are set at the top in `:root`.
- `src/research-project.njk`: generates one page per entry in `projects.yml`.
- `.github/workflows/deploy.yml`: builds and publishes to GitHub Pages on every push.
