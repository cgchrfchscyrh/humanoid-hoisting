import { parseHTML } from "linkedom";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
const descriptions = {
  "figure1.jpg":
    "A construction worker guides a crane-suspended concrete panel. Beside this, the laboratory setup shows a humanoid next to a suspended box and a marked landing platform. The crane supports the weight; the humanoid provides horizontal guidance.",
  "figure2.jpg":
    "Three task panels. Standard pick-and-place directly actuates an object with an immediate response. Humanoid hoisting indirectly influences an externally suspended, oscillatory object. HOIST refines contact and stopping to improve placement and reduce angular motion.",
  "figure3.jpg":
    "Three motivation panels. Imitation can produce feasible motions but leave a placement error. Reinforcement learning from scratch can involve unstable exploration. HOIST initializes from demonstrations and refines the policy using task outcomes.",
  "figure4.jpg":
    "HOIST pipeline. VR demonstrations initialize a vision-language-action policy. Ego and side-view RGB, language and navigation commands condition the vision-language backbone. Robot state and depth condition the flow-matching action expert. It outputs action chunks executed as head, end-effector, navigation and base-height commands through a frozen whole-body controller. During RL, a SAC actor learns the initial noise from autonomous rollouts and terminal placement rewards; the VLA and controller remain frozen.",
  "figure5.png":
    "Simulation payload-motion comparison. Mean acceleration RMS is 8.31 for human teleoperation, 3.56 for VLA-50, and 3.75, 4.83 and 4.84 meters per second squared after 10, 20 and 30 RL rollouts. Mean angular-velocity RMS is 0.144, 0.141, 0.087, 0.064 and 0.106 radians per second, respectively. Error bars show standard deviation. Exact values are in the nearby IMU table.",
  "sim.png":
    "Three side-by-side simulation views, labeled VLA-50, VLA-80 and HOIST from left to right. Humanoids guide cable-suspended boxes toward target platforms. The quantitative placement comparison is given in the nearby table.",
  "real.png":
    "Three side-by-side real-robot views, labeled VLA-50, VLA-80 and HOIST from left to right. A humanoid guides a suspended gray box toward a target marked on a wooden platform. The quantitative comparison is given in the nearby table.",
  "sim_placement_manhattan.png":
    "Simulation trial-level Manhattan placement errors. Box plots show the interquartile range, whiskers show 1.5 times that range, and dots show individual trials. HOIST after 20 RL rollouts has the lowest mean error, 2.54 centimeters; the 30-rollout condition has larger variability. Exact aggregate values appear in the placement table.",
  "sim_placement_yaw.png":
    "Simulation trial-level absolute yaw errors. Box plots and dots show the distribution of trials. HOIST after 20 RL rollouts has the lowest mean yaw error, 0.29 degrees. Exact means and standard deviations appear in the placement table.",
  "real_placement_manhattan.png":
    "Real-platform trial-level Manhattan placement errors. Mean errors decrease from 9.28 centimeters for VLA-50 to 7.37, 6.69 and 6.38 centimeters after 10, 20 and 30 RL rollouts. The box plots and dots show trial variability; the placement table reports the aggregate values.",
  "real_placement_yaw.png":
    "Real-platform trial-level yaw errors have substantial variability. Mean yaw is 14.50 degrees for VLA-50 and 21.00, 12.10 and 28.90 degrees after 10, 20 and 30 RL rollouts. Refinement does not improve yaw monotonically.",
  "imu_acc_norm.png":
    "Simulation payload acceleration RMS comparison, with standard-deviation error bars. Mean values for teleoperation, VLA-50 and HOIST after 10, 20 and 30 RL rollouts are 8.31, 3.56, 3.75, 4.83 and 4.84 meters per second squared. The IMU table provides numerical values.",
  "imu_gyro_norm.png":
    "Simulation payload angular-velocity RMS comparison, with standard-deviation error bars. Mean values are 0.144 for teleoperation, 0.141 for VLA-50, and 0.087, 0.064 and 0.106 radians per second after 10, 20 and 30 RL rollouts. The 20-rollout condition has the lowest angular RMS.",
};
await mkdir("public/papers/figures", { recursive: true });
for (const name of ["main", "supplementary"]) {
  const { document } = parseHTML(
    "<html><body>" +
      (await readFile(`src/content/${name}.html`, "utf8")) +
      "</body></html>",
  );
  document.querySelector(".frontmatter")?.remove();
  for (const old of document.querySelectorAll("h5")) {
    const h = document.createElement("h3");
    h.id = old.id;
    h.innerHTML = old.innerHTML;
    old.replaceWith(h);
  }
  for (const el of document.querySelectorAll("[style]"))
    el.removeAttribute("style");
  for (const el of document.querySelectorAll("script,iframe,object,embed,form"))
    el.remove();
  for (const el of document.querySelectorAll("*"))
    for (const attr of el.attributes)
      if (attr.name.startsWith("on")) el.removeAttribute(attr.name);
  for (const img of document.querySelectorAll("img")) {
    const file = path.basename(img.getAttribute("src"));
    if (!descriptions[file]) throw new Error("Missing description: " + file);
    img.setAttribute("alt", descriptions[file]);
    img.setAttribute("loading", "lazy");
    img.setAttribute("src", `__BASE__papers/figures/${file}`);
    await copyFile(
      `2026_Hoist_CES/rcim_submission/pics/${file}`,
      `public/papers/figures/${file}`,
    );
  }
  const figures = [...document.querySelectorAll("figure")].filter(
    (f) => !f.parentElement.closest("figure"),
  );
  figures.forEach((fig, i) => {
    const cap = [...fig.children].find((c) => c.tagName === "FIGCAPTION");
    if (cap)
      cap.insertAdjacentHTML(
        "afterbegin",
        `<strong>Figure ${name === "supplementary" ? "S" : ""}${i + 1}. </strong>`,
      );
  });
  for (const [i, table] of [...document.querySelectorAll("table")].entries()) {
    const cap = table.querySelector("caption");
    if (cap)
      cap.insertAdjacentHTML(
        "afterbegin",
        `<strong>Table ${name === "supplementary" ? "S" : ""}${i + 1}. </strong>`,
      );
    for (const th of table.querySelectorAll("thead th"))
      th.setAttribute("scope", th.hasAttribute("colspan") ? "colgroup" : "col");
    for (const row of table.querySelectorAll("tbody tr")) {
      const first = row.firstElementChild;
      if (first?.tagName === "TD") {
        const th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.innerHTML = first.innerHTML;
        first.replaceWith(th);
      }
    }
    const wrapper = document.createElement("div");
    wrapper.className = "table-scroll";
    wrapper.setAttribute("role", "region");
    wrapper.setAttribute("tabindex", "0");
    wrapper.setAttribute(
      "aria-label",
      cap?.textContent.trim() || "Research data table",
    );
    table.replaceWith(wrapper);
    wrapper.append(table);
  }
  let eq = 0;
  for (const math of document.querySelectorAll('math[display="block"]')) {
    const wrapper = document.createElement("span");
    wrapper.className = "formula-scroll";
    wrapper.setAttribute("role", "region");
    wrapper.setAttribute("tabindex", "0");
    wrapper.setAttribute("aria-label", `Mathematical expression ${++eq}`);
    math.replaceWith(wrapper);
    wrapper.append(math);
  }
  if (document.querySelector("#refs"))
    document
      .querySelector("#refs")
      .insertAdjacentHTML("beforebegin", '<h2 id="references">References</h2>');
  for (const el of document.querySelectorAll("a"))
    if (el.getAttribute("href")?.startsWith("https:"))
      el.setAttribute("rel", "noopener noreferrer");
  const ids = [...document.querySelectorAll("[id]")].map((e) => e.id);
  const missing = [];
  for (const a of document.querySelectorAll('a[href^="#"]'))
    if (!ids.includes(a.getAttribute("href").slice(1)))
      missing.push(a.getAttribute("href"));
  if (missing.length)
    throw new Error("Missing targets " + name + ": " + missing.join(", "));
  const toc = [...document.querySelectorAll("h2")].map((el) => ({
    id: el.id,
    label: el.textContent,
  }));
  await writeFile(`src/content/${name}.html`, document.body.innerHTML);
  await writeFile(`src/content/${name}-toc.json`, JSON.stringify(toc, null, 2));
  console.log(name, {
    tables: document.querySelectorAll("table").length,
    figures: figures.length,
    images: document.querySelectorAll("img").length,
    equations: eq,
    headings: toc.length,
  });
}
