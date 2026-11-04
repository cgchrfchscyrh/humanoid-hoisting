export const project = {
  name: "HOIST",
  title:
    "HOIST: Humanoid Optimization with Imitation and Sample-Efficient Tuning for Manipulating Suspended Loads",
  subtitle:
    "Humanoid Optimization with Imitation and Sample-Efficient Tuning for Manipulating Suspended Loads",
  description:
    "HOIST teaches humanoid robots to guide loads hanging from a hoist, using VR demonstrations, a vision-language-action model, and a small number of practice runs.",
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
  paperUrl: "https://arxiv.org/pdf/2606.00252",
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
  eprint = {2606.00252},
  archivePrefix = {arXiv},
  primaryClass = {cs.RO},
  url    = {https://arxiv.org/abs/2606.00252}
}`;
