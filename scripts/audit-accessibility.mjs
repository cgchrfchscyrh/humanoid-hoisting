import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { writeFile, mkdir } from "node:fs/promises";
const origin = (process.env.TEST_URL || "http://127.0.0.1:4511/humanoid-hoisting").replace(/\/$/, "");
const browser = await chromium.launch({headless:true, ...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {}), args:["--no-sandbox"]});
const context = await browser.newContext({viewport:{width:1440,height:1000}, reducedMotion:"reduce", permissions:["clipboard-read","clipboard-write"]});
const page = await context.newPage();
const report={date:new Date().toISOString(),engine:"axe-core via Playwright",target:"WCAG 2.1 A and AA",scans:[],checks:[],errors:[],limitations:["Automated checks do not establish complete ADA/WCAG conformance.","Original manuscript content and attachments are unchanged; full assistive-technology review remains separate."]};
const check=(ok,name)=>ok?report.checks.push(name):report.errors.push(name);
page.on("pageerror",e=>report.errors.push(e.message));
async function scan(name){const r=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();report.scans.push({name,violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,reason:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length})),passes:r.passes.length});}
try {
for (const route of ["/","/paper/","/supplementary/","/accessibility/"]) {
 const response=await page.goto(origin+route,{waitUntil:"networkidle"});
 check(response.ok(),route+": loads");
 check(await page.locator("h1").count()===1,route+": one H1");
 check(await page.locator('img:not([alt]),img[alt=""]').count()===0,route+": informative image alternatives");
 check(!/University of Florida|\bUF\b|Department of Civil and Coastal Engineering/.test(await page.locator("body").innerText()),route+": no institutional promotion or disclaimer");
 check(await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(x=>x.id);return ids.length===new Set(ids).size;}),route+": unique IDs");
 await page.keyboard.press("Tab");check(await page.locator(":focus").getAttribute("class")==="skip-link",route+": first keyboard stop is skip link");
 check(await page.locator(":focus").evaluate(x=>getComputedStyle(x).outlineStyle!=="none"),route+": visible focus");
 await page.keyboard.press("Enter");check(await page.locator(":focus").getAttribute("id")==="main",route+": skip link focuses main");
 await scan(route+" desktop");
 if(route==="/") {
  check(await page.locator("video").evaluateAll(vs=>vs.every(v=>v.paused&&v.muted&&v.controls&&v.playsInline)),"Reduced-motion page starts with all videos paused and native controls");
  check(await page.locator("video track[kind=descriptions]").count()===3,"All silent videos retain timed descriptions");
  check(!/\b\d+(?:\.\d+)?[- ]seconds?\b/.test(await page.locator("main").innerText()),"No redundant visible duration labels");
  await page.getByRole("tab",{name:"Real humanoid"}).focus();await page.keyboard.press("Enter");check(await page.locator("#panel-real").isVisible(),"Keyboard selects real-platform results");
  await page.keyboard.press("ArrowLeft");check(await page.locator("#panel-simulation").isVisible(),"Arrow key selects simulation results");
  await page.locator("#panel-simulation summary").click();
  await page.locator(".motion-analysis > summary").click();
  await page.getByText("Read residual-motion chart values as a table",{exact:true}).click();
  await page.getByText("Read the descriptive video transcript",{exact:true}).click();
  await page.getByText("Video sources and visual descriptions",{exact:true}).click();
  await scan("home with scientific data and media descriptions expanded");
  await page.getByRole("button",{name:"Copy citation"}).click();check((await page.evaluate(()=>navigator.clipboard.readText())).includes("liu2026hoist"),"Citation copies");
 }
 for(const width of [320,768]){await page.setViewportSize({width,height:900});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+": reflows at "+width);}
 const spacing=await page.addStyleTag({content:"*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}"});
 check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+": text-spacing reflow");await spacing.evaluate(x=>x.remove());
 await page.setViewportSize({width:390,height:900});await scan(route+" mobile");await page.setViewportSize({width:1440,height:1000});
}
const normal=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:"no-preference"});
const auto=await normal.newPage();await auto.goto(origin+"/",{waitUntil:"networkidle"});
await auto.waitForFunction(()=>[...document.querySelectorAll('.hero-scene video')].every(v=>!v.paused&&v.currentTime>.1));
check(true,"Both visible hero videos autoplay muted");
const button=auto.locator("#hero-playback-toggle");await button.focus();await auto.keyboard.press("Enter");
await auto.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.paused));check(await button.innerText()==="Play videos","Keyboard pauses every video");
await auto.locator("#demo").scrollIntoViewIfNeeded();await auto.locator("#construction-clip").scrollIntoViewIfNeeded();
check(await auto.locator("video").evaluateAll(vs=>vs.every(v=>v.paused)),"Global manual pause survives leaving and returning to view");
await button.focus();await auto.keyboard.press("Space");await auto.waitForFunction(()=>!document.querySelector('#construction-clip').paused);check(true,"Keyboard explicitly resumes playback");
await auto.locator("#construction-clip").evaluate(v=>{if(v instanceof HTMLVideoElement)v.pause();});await auto.waitForFunction(()=>document.querySelector('#construction-clip').paused);
await auto.locator("#demo").scrollIntoViewIfNeeded();await auto.waitForFunction(()=>!document.querySelector('#hoist-demo').paused);check(true,"Experiment video starts when scrolled into view");
check(await auto.locator('.hero-scene video').evaluateAll(vs=>vs.every(v=>v.paused)),"Offscreen hero videos pause");
await auto.locator("#construction-clip").scrollIntoViewIfNeeded();check(await auto.locator("#construction-clip").evaluate(v=>v.paused),"Individual manual pause survives returning to view");
await normal.close();
for(const setting of ["reduced-motion","save-data"]){
 const ctx=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:setting==="reduced-motion"?"reduce":"no-preference"});
 if(setting==="save-data")await ctx.addInitScript(()=>Object.defineProperty(navigator,"connection",{value:{saveData:true},configurable:true}));
 const p=await ctx.newPage();await p.goto(origin+"/",{waitUntil:"networkidle"});await p.locator("#demo").scrollIntoViewIfNeeded();
 check(await p.locator("video").evaluateAll(vs=>vs.every(v=>v.paused&&v.currentTime===0)),setting+": no automatic playback");
 await p.locator("#hero-playback-toggle").scrollIntoViewIfNeeded();await p.locator("#hero-playback-toggle").click();await p.waitForFunction(()=>[...document.querySelectorAll('.hero-scene video')].some(v=>!v.paused));check(true,setting+": explicit playback remains available");await ctx.close();
}
const nojs=await browser.newContext({javaScriptEnabled:false});const p=await nojs.newPage();await p.goto(origin+"/");
check(await p.locator("#panel-real").isVisible()&&await p.locator("#panel-simulation").isVisible(),"Without JavaScript both result domains remain readable");
check(await p.locator("video[controls]").count()===3&&await p.locator("#hero-playback-toggle").isHidden(),"Without JavaScript native players remain available");await nojs.close();
} catch(e){report.errors.push(e.stack||e.message);}
await mkdir("reports",{recursive:true});await writeFile("reports/axe-wcag21aa.json",JSON.stringify(report,null,2)+"\n");await browser.close();
const violations=report.scans.reduce((n,s)=>n+s.violations.length,0);console.log(JSON.stringify({scans:report.scans.length,checks:report.checks.length,violations,errors:report.errors},null,2));if(violations||report.errors.length)process.exitCode=1;
