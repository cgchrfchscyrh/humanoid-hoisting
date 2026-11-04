# Accessibility review — 18 October 2026

## Terminology review — 4 November 2026

Homepage text, video descriptions, and timed description tracks now use crane, rigging, precast, and robot-learning terms from OSHA 1926 Subpart CC and the HOIST paper. The HTML paper and supplement were not changed. The 4D phrase is the authors' own.

## Evidence tiles and method first — 4 November 2026

The homepage now runs from the opening videos to the 4D evidence and gallery, then the method, the results, and the citation. Four stat tiles use text only, with a real heading and a named source link each, so nothing depends on color. Their figures come from O*NET's work-context survey for riggers and from the U.S. Bureau of Labor Statistics factsheet on crane fatalities. The results heading uses the paper's 20-rollout values from Table 1, as the abstract does.

## Homepage without top bar or footer — 4 November 2026

The homepage top bar and footer were removed at the author's request, and gallery videos now touch. The accessibility and credits link and the template attribution moved to one line in the citation band. Sub-pages keep their header and footer as the way back to the homepage. With no bars, the homepage has no site-wide navigation; the skip link and in-page order remain. A further Holy Maker excerpt replaced the bow plane clip in the gallery.

## Opening pair and no top navigation — 4 November 2026

The opening now shows people guiding a hanging concrete base beside the robot film, at one height with no cropping, and the top navigation links were removed at the author's request. The two videos have the same 21.8-second length and act as one player: they start, pause, resume, and loop together, and the existing reduced-motion, data-saving, and offscreen rules apply to both. Both are silent, with native controls, timed descriptions, and text alternatives. The people clip and one gallery clip are excerpts from Holy Maker's video, which the project team reports having permission to use. They are stored on this site, so YouTube's player is no longer embedded and no third-party content loads with the page. The written permission was not reviewed here. Their descriptions were written from frames at 1-second steps.

## Robot opening film and six-clip gallery — 4 November 2026

The homepage opens with a full-width silent film of the real robot, with no text over it. On wide screens the complete panel sits over a blurred copy of itself; narrow screens use a separate copy of the panel with no blurred sides. The gallery now has six clips of people pushing or pulling a load, with a source link placed on each video. At the author's request, gallery titles, the text explaining the research videos, and the visible description and credit disclosures were removed from the homepage. Every video keeps a complete text alternative for screen readers and a timed description track, and the figure description stays available to screen readers. Full descriptions, source credits, and the required DoW statement moved to the accessibility page, linked from the footer. Sighted visitors no longer see these descriptions on the homepage. Text sizes were brought closer together. Existing PDF and screen-reader limitations still apply.

## Opening film and plainer text — 4 November 2026

The homepage now opens with a full-width silent film of two U.S. Navy shipyards, using native controls, the existing viewport playback rules, a timed description track, and a complete text alternative. White text sits on a dark gradient so it stays readable over bright frames. Frame-to-frame brightness was measured for the flash criterion: no more than one large swing in any second. That is a screening check, not a certified flash analysis.

The gallery's concrete house clip is copyrighted by its owner and plays through YouTube's embedded player. It works as a plain link without JavaScript, and nothing from the player loads until a visitor activates it, although its preview image comes from YouTube. **YouTube's player and that video's audio and captions were not reviewed and are outside this site's control.** Its description was written from YouTube's preview frames at 10-second steps, not from continuous viewing.

Headings and explanations were rewritten in plainer language. The result sentence comes from Table 2 of the paper. Existing PDF and screen-reader limitations still apply.

## Real-world gallery reselected — 3 November 2026

The nine real-world clips were replaced with single-shot excerpts in which people handle or guide the lifted load by hand or by tag line. Each clip has a new text alternative and timed description written after reviewing its frames, and its source and license credit are listed in the media notes. All nine sources are marked public domain on DVIDS.

Build and the browser suite passed: **9 axe scans and 92 functional checks**, with no violations or failures. All nine players keep the same display size at 390 and 1440 CSS pixels, with no horizontal overflow. Existing PDF and screen-reader limitations still apply.

## Video explanation bubbles — 2 November 2026

The real and simulation videos each have a short plain-language bubble: beside the video on wide screens and directly below it on narrower ones. The bubbles add to, and do not replace, the linked text alternatives and timed descriptions.

Build, lint, and the updated browser suite passed: **9 axe scans and 92 functional checks**, with no violations or failures. Layouts from 320 to 1920 CSS pixels were reviewed. Existing PDF and screen-reader limitations still apply.

## Method figure bubbles — 2 November 2026

The method explanation now appears as four bubbles beside the matching figure panels on wide screens, and below the figure on narrower ones. Number badges identify the panels without relying on color or position, and reading order stays 0, 1–2, 3, 4.

Build, lint, and the updated browser suite passed: **9 axe scans and 91 functional checks**, with no violations or failures. Layouts from 320 to 1920 CSS pixels were reviewed. Existing PDF and screen-reader limitations still apply.

## Results section removed — 2 November 2026

The homepage no longer includes the Results section; result tables remain in the HTML paper and supplementary editions. The page title's display styling, which was lost when the Vision section was removed, is restored, and the audit now checks that the title is larger than section headings.

Build, lint, and the updated browser suite passed: **9 axe scans and 89 functional checks**, with no violations or failures. Desktop and 320 CSS-pixel layouts were reviewed. Existing PDF and screen-reader limitations still apply.

## Simplified homepage — 2 November 2026

The homepage no longer includes the task-overview section, method steps and clip, result tabs and position-error charts, or the Vision section. The method figure now has a plain-language explanation beneath it, and simulation and real-humanoid results appear together, so no tab interaction is needed. Result tables remain available.

Build, lint, and the updated browser suite passed: **9 axe scans and 90 functional checks**, with no violations or failures. Desktop and 320 CSS-pixel layouts were reviewed. Existing PDF and screen-reader limitations still apply.

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
