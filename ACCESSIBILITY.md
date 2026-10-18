# Accessibility review — 18 October 2026

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
