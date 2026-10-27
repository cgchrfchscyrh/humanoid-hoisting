import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { writeFile, mkdir } from "node:fs/promises";

const origin = (process.env.TEST_URL || "http://127.0.0.1:4511/humanoid-hoisting").replace(/\/$/, "");
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage();
const report = {
  date: new Date().toISOString(),
  engine: "axe-core via Playwright",
  target: "WCAG 2.1 A and AA",
  scans: [],
  checks: [],
  errors: [],
  limitations: [
    "Automated checks do not establish complete ADA/WCAG conformance.",
    "Original manuscript content and attachments are unchanged; full assistive-technology review remains separate.",
    "Native player keyboard behavior is verified in Chromium; other browser and assistive-technology combinations require separate review.",
  ],
};
const check = (ok, name) => ok ? report.checks.push(name) : report.errors.push(name);
page.on("pageerror", e => report.errors.push(e.message));

async function scan(name) {
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  report.scans.push({
    name,
    violations: r.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, reason: n.failureSummary })) })),
    incomplete: r.incomplete.map(v => ({ id: v.id, nodes: v.nodes.length })),
    passes: r.passes.length,
  });
}

// Traverse the actual tab order into the browser's native player controls.
// Playback below changes with real keyboard input, never video.play()/pause().
async function tabToVideo(targetPage, video) {
  await targetPage.locator(".skip-link").focus();
  for (let i = 0; i < 100; i++) {
    await targetPage.keyboard.press("Tab");
    if (await video.evaluate(v => document.activeElement === v)) return;
  }
  throw new Error("Native video controls were not reachable through the tab order");
}

async function waitForPlayback(video, paused) {
  await video.page().waitForFunction(
    ({ id, expected }) => {
      const player = document.getElementById(id);
      return player instanceof HTMLVideoElement && player.paused === expected;
    },
    { id: await video.getAttribute("id"), expected: paused },
  );
}

try {
  for (const route of ["/", "/paper/", "/supplementary/", "/accessibility/"]) {
    const response = await page.goto(origin + route, { waitUntil: "networkidle" });
    check(response.ok(), route + ": loads");
    check(await page.locator("h1").count() === 1, route + ": one H1");
    check(await page.locator('img:not([alt]),img[alt=""]').count() === 0, route + ": informative image alternatives");
    const bodyText = await page.locator("body").innerText();
    check(!/University of Florida|\bUF\b|Department of Civil and Coastal Engineering/.test(bodyText), route + ": no institutional promotion or disclaimer");
    check(!/\bdownloads?\b|downloadable/i.test(bodyText) && await page.locator("[download]").count() === 0, route + ": no download buttons, links, or labels");
    check(await page.evaluate(() => {
      const ids = [...document.querySelectorAll("[id]")].map(x => x.id);
      return ids.length === new Set(ids).size;
    }), route + ": unique IDs");
    await page.keyboard.press("Tab");
    check(await page.locator(":focus").getAttribute("class") === "skip-link", route + ": first keyboard stop is skip link");
    check(await page.locator(":focus").evaluate(x => getComputedStyle(x).outlineStyle !== "none"), route + ": visible focus");
    await page.keyboard.press("Enter");
    check(await page.locator(":focus").getAttribute("id") === "main", route + ": skip link focuses main");
    await scan(route + " desktop");

    if (route === "/") {
      const videoCount = await page.locator("video").count();
      check(videoCount === 6, "Two introductory videos and four research excerpts are present");
      check(await page.locator("#hero-playback-toggle,#hero-playback-status").count() === 0, "Separate global playback button and status are removed");
      check(await page.locator("video").evaluateAll(vs => vs.every(v => v.paused && v.muted && v.controls && v.playsInline && v.controlsList.contains("nodownload"))), "Reduced-motion page starts paused with native controls and hidden native download option");
      check(await page.locator("video").evaluateAll(vs => vs.every(v => {
        const ids = (v.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
        return ids.length > 0 && ids.every(id => (document.getElementById(id)?.textContent || "").trim().length > 40);
      })), "Every silent video has a complete linked visual description");
      check(await page.locator("video").evaluateAll(vs => vs.every(v => v.querySelectorAll('track[kind="descriptions"][src]').length === 1)), "Every silent video retains one timed visual-description track");
      check(await page.locator("#overview video").count() === 1 && await page.locator("#method video").count() === 1 && await page.locator("#results video").count() === 2, "Research excerpts accompany Abstract, Method, and Results");
      check(!/\b\d+(?:\.\d+)?[- ]seconds?\b/.test(await page.locator("main").innerText()), "No redundant visible duration labels");
      await page.getByRole("tab", { name: "Real humanoid" }).focus();
      await page.keyboard.press("Enter");
      check(await page.locator("#panel-real").isVisible(), "Keyboard selects real-platform results");
      await page.keyboard.press("ArrowLeft");
      check(await page.locator("#panel-simulation").isVisible(), "Arrow key selects simulation results");
      await page.locator("#panel-simulation summary").click();
      await page.locator(".motion-analysis > summary").click();
      await page.getByText("Read residual-motion chart values as a table", { exact: true }).click();
      check(await page.locator("figure:has(video) > figcaption, details.clip-description").count() === 0, "Video captions and per-player description blocks are removed");
      check(await page.locator("#vision h2").count() === 1, "Story connects a controlled task to the larger collaborative vision");
      check(await page.locator("#video-notes .research-media-notes section").count() === 4, "Complete research-video alternatives are consolidated in media notes");
      await page.getByText("Video sources and visual descriptions", { exact: true }).click();
      await scan("home with scientific data and media descriptions expanded");
      await page.getByRole("button", { name: "Copy citation" }).click();
      check((await page.evaluate(() => navigator.clipboard.readText())).includes("liu2026hoist"), "Citation copies");
    }

    for (const width of [320, 768]) {
      await page.setViewportSize({ width, height: 900 });
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route + ": reflows at " + width);
    }
    const spacing = await page.addStyleTag({ content: "*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}" });
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route + ": text-spacing reflow");
    await spacing.evaluate(x => x.remove());
    await page.setViewportSize({ width: 390, height: 900 });
    await scan(route + " mobile");
    await page.setViewportSize({ width: 1440, height: 1000 });
  }

  const normal = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference" });
  const auto = await normal.newPage();
  auto.on("pageerror", e => report.errors.push(e.message));
  await auto.goto(origin + "/", { waitUntil: "networkidle" });
  const firstVideo = auto.locator(".hero-scene video").first();
  await firstVideo.scrollIntoViewIfNeeded();
  await auto.waitForFunction(() => [...document.querySelectorAll(".hero-scene video")].every(v => !v.paused && v.muted && v.loop && v.currentTime > .1));
  check(true, "Both visible hero videos autoplay muted and loop");
  await tabToVideo(auto, firstVideo);
  check(true, "Native video controls are reachable with Tab");
  await auto.keyboard.press("Space");
  await waitForPlayback(firstVideo, true);
  check(true, "Space on the native player pauses the video");

  for (const video of await auto.locator("figure.research-clip video").all()) {
    await video.scrollIntoViewIfNeeded();
    await waitForPlayback(video, false);
    check(await video.evaluate(v => v.muted && v.loop), "Research excerpt autoplays muted when visible: " + await video.getAttribute("id"));
  }
  check(await auto.locator(".hero-scene video").evaluateAll(vs => vs.every(v => v.paused)), "Offscreen hero videos pause");
  await firstVideo.scrollIntoViewIfNeeded();
  await waitForPlayback(auto.locator("figure.research-clip video").last(), true);
  check(await firstVideo.evaluate(v => v.paused), "Native manual pause survives leaving and returning to view");
  await tabToVideo(auto, firstVideo);
  await auto.keyboard.press("Space");
  await waitForPlayback(firstVideo, false);
  check(true, "Space on the native player explicitly resumes playback");
  await auto.emulateMedia({ reducedMotion: "reduce" });
  await auto.waitForFunction(() => [...document.querySelectorAll("video")].every(v => v.paused));
  check(true, "Enabling reduced motion pauses automatic playback immediately");
  await normal.close();

  for (const setting of ["reduced-motion", "save-data"]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: setting === "reduced-motion" ? "reduce" : "no-preference" });
    if (setting === "save-data") await ctx.addInitScript(() => Object.defineProperty(navigator, "connection", { value: { saveData: true }, configurable: true }));
    const p = await ctx.newPage();
    await p.goto(origin + "/", { waitUntil: "networkidle" });
    await p.locator("figure.research-clip video").last().scrollIntoViewIfNeeded();
    check(await p.locator("video").evaluateAll(vs => vs.every(v => v.paused && v.currentTime === 0)), setting + ": no automatic playback");
    const video = p.locator(".hero-scene video").first();
    await tabToVideo(p, video);
    await p.keyboard.press("Space");
    await waitForPlayback(video, false);
    check(true, setting + ": explicit native keyboard playback remains available");
    await p.keyboard.press("Space");
    await waitForPlayback(video, true);
    check(true, setting + ": native keyboard pause remains available");
    await ctx.close();
  }

  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const p = await nojs.newPage();
  await p.goto(origin + "/");
  check(await p.locator("#panel-real").isVisible() && await p.locator("#panel-simulation").isVisible(), "Without JavaScript both result domains remain readable");
  check(await p.locator("video[controls]").count() === 6 && await p.locator("#hero-playback-toggle").count() === 0, "Without JavaScript all six native players remain available");
  await nojs.close();
} catch (e) {
  report.errors.push(e.stack || e.message);
}

await mkdir("reports", { recursive: true });
await writeFile("reports/axe-wcag21aa.json", JSON.stringify(report, null, 2) + "\n");
await browser.close();
const violations = report.scans.reduce((n, s) => n + s.violations.length, 0);
console.log(JSON.stringify({ scans: report.scans.length, checks: report.checks.length, violations, errors: report.errors }, null, 2));
if (violations || report.errors.length) process.exitCode = 1;
