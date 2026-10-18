# HOIST research webpage

Live site: <https://cgchrfchscyrh.github.io/humanoid-hoisting/>

The website presents the RCIM version of **HOIST: Humanoid Optimization with Imitation and Sample-Efficient Tuning for Manipulating Suspended Loads**. English research content and original experimental values are preserved.

## 18 October 2026 presentation update

Inspired by the concise section structure and emphasis on research media at [VLK](https://vision-language-kinematics.github.io/), the homepage now uses Abstract, Method, Experiments, Results, and Citation. The title and authors appear above complete construction/robot videos. Detailed sources, visual descriptions, and tables are expandable; paper and supplementary reading editions remain linked. No VLK research content or media is copied.

Videos autoplay silently when visible, with native controls and a visible Pause videos button. Reduced-motion and Save-Data users receive paused media; manual pause persists when scrolling. Redundant duration labels have been removed. Per the latest explicit user request, the website no longer displays affiliation blocks or institutional disclaimers. Original manuscript attachments remain unchanged.

## Development

Node.js 24 is required.

```sh
npm ci
npm run lint
npm run audit:security
BASE_PATH=/humanoid-hoisting SITE_URL=https://cgchrfchscyrh.github.io npm run build
BASE_PATH=/humanoid-hoisting npm run preview -- --host 127.0.0.1 --port 4511
TEST_URL=http://127.0.0.1:4511/humanoid-hoisting npm run test:a11y
```

Set `CHROME_PATH` to a local Chrome executable, or install the Playwright browser. The GitHub Actions workflow builds and checks the site before publishing `dist/`.

## Editing

- `src/paper.mdx`: concise homepage content and scientific figures.
- `src/components/Header.astro`, `Demo.astro`, `MediaControls.astro`: research media and playback.
- `src/components/Results.astro`, `ResidualData.astro`: original charts and accessible tables.
- `src/content/`: full manuscript/supplement HTML reading editions; preserve scientific content.
- `public/media/`, `public/papers/`: existing video and PDF assets; originals remain unchanged.
- `src/pages/accessibility.astro`, `ACCESSIBILITY.md`: alternatives, behavior, and review limits.

## Security and accessibility

The build remains static with local fonts and media, a hash-based HTML CSP, and no accounts, analytics, or third-party player. The 18 October dependency cleanup updates vulnerable transitive packages and the Astro/TypeScript lint parser, and removes unused template plugins/checkers. The complete dependency audit is saved in `reports/npm-audit-production.json` (despite its historical filename, this revision covers all dependencies). There are no advisory exceptions.

Automated accessibility checks are not full WCAG/ADA certification. Original manuscript PDFs and screen-reader usability require separate assessment. See `ACCESSIBILITY.md` for scope and `reports/` for dated evidence.

Template attribution: [Roman Hauksson’s Academic Project Astro Template](https://github.com/RomanHauksson/academic-project-astro-template), based on [Nerfies](https://nerfies.github.io/), under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
