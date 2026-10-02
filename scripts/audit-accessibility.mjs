import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { writeFile, mkdir } from "node:fs/promises";
const origin = (process.env.TEST_URL || "http://127.0.0.1:4332").replace(
  /\/$/,
  "",
);
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : {}),
  args: process.env.CI ? ["--no-sandbox"] : [],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
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
};
page.on("pageerror", (e) => report.errors.push(e.message));
const assert = (v, m) => {
  if (!v) report.errors.push(m);
  else report.checks.push(m);
};
async function scan(name) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  report.scans.push({
    name,
    violations: results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        reason: n.failureSummary,
      })),
    })),
    incomplete: results.incomplete.map((v) => ({
      id: v.id,
      nodes: v.nodes.length,
    })),
    passes: results.passes.length,
  });
}
for (const route of ["/", "/paper/", "/supplementary/", "/accessibility/"]) {
  const response = await page.goto(origin + route, {
    waitUntil: "networkidle",
  });
  if (!response?.ok())
    throw new Error(
      `Accessibility scan could not open ${origin + route}: HTTP ${response?.status()}`,
    );
  assert((await page.locator("h1").count()) === 1, route + ": one H1");
  assert(
    (await page.locator("img:not([alt])").count()) === 0,
    route + ": every image has alt text",
  );
  assert(
    (await page.locator("video[autoplay]").count()) === 0,
    route + ": no autoplay",
  );
  await page.keyboard.press("Tab");
  assert(
    (await page.locator(":focus").getAttribute("class")) === "skip-link",
    route + ": skip link is first keyboard stop",
  );
  await page.keyboard.press("Enter");
  assert(
    (await page.locator(":focus").getAttribute("id")) === "main",
    route + ": skip link focuses main content",
  );
  await scan(route + " desktop");
  if (route === "/") {
    await page.getByRole("tab", { name: "Real humanoid" }).focus();
    await page.keyboard.press("Enter");
    assert(
      await page.locator("#panel-real").isVisible(),
      "Real results keyboard selection",
    );
    await page.keyboard.press("ArrowLeft");
    assert(
      await page.locator("#panel-simulation").isVisible(),
      "Result tabs support arrow keys",
    );
    await page.locator("#panel-simulation summary").click();
    await page
      .getByText("Read residual-motion chart values as a table", {
        exact: true,
      })
      .click();
    await page
      .getByText("Read the descriptive video transcript", { exact: true })
      .click();
    await page
      .getByText("Video sources and visual descriptions", { exact: true })
      .click();
    await scan("home with data tables and transcript open");
    const toggle = page.locator("#hero-playback-toggle");
    await toggle.focus();
    await page.keyboard.press("Enter");
    await page.waitForFunction(() =>
      [...document.querySelectorAll(".hero-scene video")].every(
        (video) => !video.paused && video.currentTime > 0.2,
      ),
    );
    assert(
      (await toggle.innerText()) === "Pause clips",
      "Keyboard starts both hero clips and exposes pause action",
    );
    await page.keyboard.press("Space");
    assert(
      await page
        .locator(".hero-scene video")
        .evaluateAll((videos) => videos.every((video) => video.paused)),
      "Keyboard pauses both hero clips",
    );
    await page.locator("#robot-clip").evaluate((video) => video.play());
    assert(
      (await toggle.innerText()) === "Pause clips",
      "Shared control reflects individual-player playback",
    );
    await toggle.click();
    await page.locator(".hero-scene video").evaluateAll((videos) =>
      videos.forEach((video) => {
        video.currentTime = video.duration - 0.15;
      }),
    );
    await toggle.click();
    await page.waitForFunction(() =>
      [...document.querySelectorAll(".hero-scene video")].every(
        (video) => video.ended,
      ),
    );
    assert(
      (await toggle.innerText()) === "Replay both clips",
      "Clips stop at the end without looping",
    );
    await toggle.click();
    await page.waitForFunction(() =>
      [...document.querySelectorAll(".hero-scene video")].every(
        (video) => !video.paused && video.currentTime < 2,
      ),
    );
    assert(
      (await toggle.innerText()) === "Pause clips",
      "Replay restarts both clips",
    );
    await toggle.click();
    assert(
      (await page
        .locator(".hero-scene video[controls]:not([autoplay]):not([loop])")
        .count()) === 2,
      "Hero has two independently controlled non-autoplaying videos",
    );

    await page.getByRole("button", { name: "Copy citation" }).click();
    assert(
      (await page.evaluate(() => navigator.clipboard.readText())).includes(
        "liu2026hoist",
      ),
      "Citation copies with keyboard-accessible button",
    );
    assert(
      (await page.locator("video").count()) === 3 &&
        (await page.locator("video track[kind=descriptions]").count()) === 3,
      "All three silent videos have timed visual descriptions",
    );
  }
  for (const width of [320, 768]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    assert(
      !overflow,
      route + ": no page-level horizontal overflow at " + width + " CSS pixels",
    );
  }
  const spacing = await page.addStyleTag({
    content:
      "* {line-height: 1.5 !important;letter-spacing: .12em !important;word-spacing: .16em !important;} p {margin-bottom: 2em !important;}",
  });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    route + ": no page overflow with WCAG text spacing",
  );
  await spacing.evaluate((el) => el.remove());
  await page.setViewportSize({ width: 390, height: 900 });
  await scan(route + " mobile");
  await page.setViewportSize({ width: 1440, height: 1000 });
}
const nojs = await browser.newContext({ javaScriptEnabled: false });
const p = await nojs.newPage();
await p.goto(origin + "/");
assert(
  (await p.locator("#panel-real").isVisible()) &&
    (await p.locator("#panel-simulation").isVisible()),
  "Both result domains remain available without JavaScript",
);
assert(
  (await p.locator(".hero-scene video[controls]").count()) === 2 &&
    (await p.locator("#hero-playback-toggle").isHidden()),
  "Native hero players remain available without JavaScript",
);
await nojs.close();
await mkdir("reports", { recursive: true });
await writeFile("reports/axe-wcag21aa.json", JSON.stringify(report, null, 2));
await browser.close();
const count = report.scans.reduce((n, s) => n + s.violations.length, 0);
console.log(
  JSON.stringify(
    {
      scans: report.scans.length,
      violations: count,
      checks: report.checks.length,
      errors: report.errors,
      details: report.scans.filter((s) => s.violations.length),
    },
    null,
    2,
  ),
);
if (count || report.errors.length) process.exitCode = 1;
