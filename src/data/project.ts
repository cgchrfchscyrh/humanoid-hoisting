export const project = {
  name: "HOIST",
  title:
    "HOIST: Humanoid Optimization with Imitation and Sample-Efficient Tuning for Manipulating Suspended Loads",
  subtitle:
    "Humanoid Optimization with Imitation and Sample-Efficient Tuning for Manipulating Suspended Loads",
  description:
    "Learning to guide suspended loads with humanoid robots. HOIST combines VR demonstrations, vision-language-action policies, and sample-efficient reinforcement learning.",
  institution: "University of Florida",
  department: "Department of Civil and Coastal Engineering",
  year: "2026",
  authors: [
    { name: "Songyang Liu", email: "liusongyang@ufl.edu", note: "*" },
    { name: "Shunyu Yao", email: "shunyu.yao@ufl.edu", note: "*" },
    { name: "Dingyuan Huang", email: "dingyuanhuang@ufl.edu", note: "" },
    { name: "Shuai Li", email: "shuai.li@ufl.edu", note: "†" },
  ],
  // Add public URLs when available. Empty links are omitted from the page.
  paperUrl: "",
  codeUrl: "",
  arxivUrl: "",
};

/** Public assets work at both / and /repository-name/. */
export function asset(path: string) {
  return `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export const bibtex = `@misc{liu2026hoist,
  title  = {${project.title}},
  author = {Liu, Songyang and Yao, Shunyu and Huang, Dingyuan and Li, Shuai},
  year   = {2026},
  note   = {Research manuscript}
}`;
