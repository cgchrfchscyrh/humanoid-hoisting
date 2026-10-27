# Accessibility review — 18 October 2026

## Light vision presentation — 27 October 2026

Vision sections now share the surrounding light page background, dark type, and dark SVG linework. Evidence imagery uses a white surface; focus outlines, concept badges, and diagram relationships remain visible without relying on color.

Build, lint, dependency security audit, and the existing browser suite passed: **9 axe scans and 81 functional checks**, with no violations or failures. Desktop and 320 CSS-pixel layouts were reviewed. Original media and attachments are unchanged. Existing PDF and screen-reader limitations still apply; this is not full ADA/WCAG certification.


## Visual vision review — 27 October 2026

The project opening now uses a compact display headline while the formal paper title, author information, and citations remain intact. Each Vision section presents existing research imagery, three specific gaps paired with collaborating disciplines, and an original SVG drawing of a future system. Solid current-evidence badges and dashed “Future concept” badges distinguish demonstrated scope from proposed integration. The diagrams have concise image alternatives and a complete text equivalent; mobile layouts follow a top-to-bottom path. Original source figures remain available in keyboard-operable disclosures where applicable.

Build, lint, and security audit passed (zero reported dependency vulnerabilities). The updated browser suite passed **9 axe scans and 81 functional checks**, with zero violations or failures. Desktop views and 320 CSS-pixel layouts were inspected in the browser; all eight project headlines and vision maps fit without horizontal overflow. Native media controls, reduced-motion and data-saving preferences, manual-pause persistence, source credits, and media alternatives remain in place. See `reports/vision-review.json` and `reports/axe-wcag21aa.json`. No original attachment or research media was edited.

These checks do not constitute complete ADA/WCAG certification. PDF reading order, scientific-image legibility at every magnification, and multi-screen-reader usability still need separate review. The implementation does not claim clinical, field, or complete-system validation for future concepts.


## Current review — 27 October 2026

This revision replaces introductory topic subtitles with a title-led opening, removes visible text beneath each video, and connects a concrete research task to a larger collaborative vision. Full silent-video alternatives remain linked through `aria-describedby`, with timed WebVTT descriptions and complete descriptions/credits consolidated in the end-of-page media notes. Native controls, viewport playback, remembered manual pauses, reduced-motion and data-saving preferences remain available.

The current build and lint pass. The browser suite passed **9 axe scans and 80 functional checks**, with zero violations and errors. Desktop and 320 CSS-pixel layouts were visually reviewed after loading all figures. Dependency audit reports zero vulnerabilities. Original media and paper assets are unchanged. See `reports/story-review.json` and `reports/axe-wcag21aa.json`. This current review supersedes earlier descriptions of per-player captions or the previous section structure.

Automated checks are not complete ADA/WCAG certification. External PDF reading order, detailed scientific-artwork contrast, and multi-screen-reader usability still require separate review.


Target: WCAG 2.1 A and AA. Automated checks are a technical review, not a complete ADA/WCAG certification.

## Current presentation

The homepage now uses short Abstract, Method, Experiments, Results, and Citation sections. Scientific figures, video demonstrations, labeled result charts, and expandable data tables carry the research story. Detailed figure descriptions, media sources, and visual transcripts remain available in keyboard-operable disclosure controls. Full HTML paper and supplement reading editions remain linked.

The latest user request explicitly replaces the previous no-autoplay and institutional-footer requirements. Videos are silent, have native controls, and automatically play only while in view. A visible Pause videos control pauses all clips. Reduced-motion and Save-Data preferences prevent automatic playback; explicit playback remains available. Leaving and returning to the viewport does not override a manual pause. Offscreen videos pause. JavaScript-disabled visits retain native players and all research content. Author names are retained; affiliation blocks and institutional disclaimers have been removed from the website, without editing manuscript attachments.

## Verification

The local suite covers four routes, desktop/mobile axe scans, expanded scientific tables and media descriptions, skip links, visible focus, result-tab keyboard operation, citation copying, 320/768 CSS-pixel reflow, text spacing, no-JavaScript content, autoplay, keyboard pause/resume, offscreen pausing, individual and global pause persistence, reduced motion, and Save-Data behavior. Actual counts and findings are recorded in `reports/axe-wcag21aa.json`; deployment repeats the suite before publishing.

Incomplete `video-caption` findings require interpretation: all website videos are silent and have HTML descriptions plus timed WebVTT description tracks. No speech has been omitted. Original scientific images retain their colors and labels, with text descriptions and result tables that do not depend on color alone.

## Attachments and limits

The RCIM manuscript, original scientific figures, result values, supplementary content, and video files were not changed in this presentation update. The HTML paper and supplement are identified as reading editions. Existing downloadable PDF reading editions retain their prior tags; this update has not recertified their reading order, mathematics, or assistive-technology usability. Complete screen-reader and user testing remain separate from automated checks.

Research media and external imagery retain their source and license credits. Website styling uses neutral charcoal, gray, and white. No new third-party player, analytics, or data collection was added.

Contact: liusongyang@ufl.edu.

## Published verification

[Deployment 39156391028](https://github.com/cgchrfchscyrh/humanoid-hoisting/actions/runs/39156391028) published `ae4f357` after lint, production audit, build, 9 axe scans, and 63 functional checks passed with zero violations or errors. The CI report is retained in `reports/ci/axe-wcag21aa.json`.

Live verification covered four pages, 28 referenced resources, and three MP4 range responses. Silent automatic playback, keyboard pause, pause persistence, reduced-motion behavior, and 320 CSS-pixel reflow passed with no browser errors. HTTPS enforcement and the HTML CSP were verified. Provider-controlled response headers are recorded in `reports/visual-refresh-live.json`; absent security headers are not claimed as configured.
