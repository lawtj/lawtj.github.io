# Deploying the site

Use the commands below to update each published artifact.

## GitHub Pages site

Run `npm run deploy` from `apps/web` after building any site changes. The script builds the project, pushes the output to the `gh-pages` branch, and updates the live GitHub Pages site.

## CV (Quarto)

2. Commit the regenerated files in `apps/web/static/cv`; they are tracked on purpose so GitHub Pages can serve them without a runtime build step.
1. Edit `apps/cv/cv.qmd` as needed, then render it with `quarto render apps/cv/cv.qmd --output-dir apps/web/static/cv`. The output directory matches the static asset path that SvelteKit ships in both dev and production builds, so this step overwrites the HTML/CSS the site actually serves.
3. Run `npm run deploy` from `apps/web` (see above) whenever you want the live site to pick up the refreshed CV.

## Source code

Commit your changes and push to the `main` branch with `git push origin main` to share updates to the source code.
