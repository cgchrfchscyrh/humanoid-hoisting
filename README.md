# HOIST 论文项目网页

基于 [Academic Project Astro Template](https://github.com/RomanHauksson/academic-project-astro-template)，内容采用本目录的 **RCIM journal 稿件**。网页保留英文，维护说明使用中文。首页、论文全文、补充材料和无障碍说明共四个页面。

[在线网页](https://cgchrfchscyrh.github.io/humanoid-hoisting/) · [GitHub 仓库](https://github.com/cgchrfchscyrh/humanoid-hoisting)

## 预览与构建

使用 Node.js 24 或更新版本；`.nvmrc` 选择版本 24。

```sh
npm ci
npm run dev
```

开发地址为 <http://localhost:4321>。静态构建与生产预览：

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4332
```

打开 <http://localhost:4332>。`dist/` 可部署到静态托管服务，无需后端。构建包含 Astro / TypeScript 检查，并为生成的脚本写入带 SHA-256 哈希的 Content Security Policy。

本机暂未配置系统 Node；当前会话可用以下方式执行相同命令。临时运行时不属于项目交付文件。

```sh
PATH=/tmp/hoist-runtime/node/bin:$PATH npm run dev
```

## 内容与编辑位置

| 文件                                                  | 用途                                                  |
| ----------------------------------------------------- | ----------------------------------------------------- |
| `src/paper.mdx`                                       | 首页摘要、方法、图表与研究介绍                        |
| `src/data/project.ts`                                 | 标题、作者、联系方式、公开链接、BibTeX                |
| `src/components/Header.astro`                         | 左右双视频首屏、共同播放/暂停、媒体来源与文字描述     |
| `src/components/ConstructionContext.astro`            | 施工照片、研究动机、行业视频原站链接                  |
| `src/components/Results.astro`                        | 模拟与真实平台的实验数据                              |
| `src/components/Demo.astro`                           | 视频与按时间整理的文字说明                            |
| `src/components/SiteHeader.astro`、`SiteFooter.astro` | 项目导航、研究声明、无障碍联系入口                    |
| `src/content/`                                        | 转换后的论文全文、补充材料、目录和转换清单            |
| `src/styles/global.css`                               | 炭黑 / 灰白配色、IBM Plex Sans 字体、响应式和打印样式 |
| `public/papers/`                                      | 带结构标签的 PDF 网页阅读版与全文插图                 |
| `public/media/`                                       | 压缩后的无声视频、海报和描述轨道                      |
| `public/favicon.svg`                                  | HOIST 项目 H 字母图标，不使用 UF 标志                 |

首页默认进入 HTML 全文阅读版，同时提供 PDF 下载。`paperUrl`、`codeUrl`、`arxivUrl` 可在获得正式公开链接后填写；空链接不会显示。不推定已录用、DOI 或 arXiv 编号。

19.9 cm 和 3.56° 改善对应 **模拟环境、追加 20 次 RL rollout**；真实平台的 31.3% 对应追加 30 次 rollout 后从 9.28 cm 降至 6.38 cm。满足阈值的均值不等于每次试验的成功率。

## 无障碍与安全检查

详细结果、限制和品牌素材来源见 [ACCESSIBILITY.md](ACCESSIBILITY.md)。

```sh
npm run lint
npm run build
npm run audit:security
npx playwright install chromium
# 另一个终端保持 4332 端口的生产预览运行
npm run test:a11y
```

测试可通过 `TEST_URL` 指定含子目录的地址，通过 `CHROME_PATH` 使用现有 Chrome。报告保存为 `reports/axe-wcag21aa.json`。当前检查覆盖四个页面、桌面/手机布局、键盘导航、结果切换、文字间距、320px 回流、无 JavaScript 访问与视频设置，以及双视频的键盘播放/暂停、独立控件联动和结束重播。自动通过不等于完整 WCAG 或 ADA 认证。

## 更新全文与 PDF

通常修改首页不必运行这一步。只有稿件变化时，才在保留原始材料的本机重新转换。需要 Python 3 和 Pandoc；可使用 `PANDOC` 环境变量指定 Pandoc 可执行文件。

```sh
python3 scripts/convert_manuscripts.py
node scripts/prepare-reading-editions.mjs
npm run build
# 保持 4332 端口的生产预览运行
node scripts/render-pdf.mjs
npm run build
```

必须按顺序运行两个转换脚本，避免重复处理已经转换的 HTML。提交 `src/content/`、`public/papers/figures/` 和新 PDF，CI 不需要原始论文目录或 Pandoc。PDF 是重新排版的网页阅读版，页码与投稿稿件不同；原始稿件保持不变。重新生成后需要核对论文内容、逐页检查版面，并复查标签、阅读顺序和公式。HTML 版本保留原生 MathML。

## GitHub Pages 部署

1. 在正式发布前完成单位的品牌/域名流程，以及 `ACCESSIBILITY.md` 中的人工复查。
2. 将项目源文件提交到 `cgchrfchscyrh/humanoid-hoisting` 仓库的 `main` 分支，保留 `.github/workflows/astro.yml`。`.gitignore` 已排除原始研究文件夹、`node_modules/` 和构建产物。
3. 在 **Settings → Pages** 中选择 **GitHub Actions**。
4. 推送后工作流执行依赖安全审计、类型检查、构建和 axe 检查；检查失败会阻止部署。

Pages 自动提供站点域名和仓库子路径。其他静态服务可以设置：

```sh
SITE_URL=https://example.com BASE_PATH=/hoist/ npm run build
```

在本地模拟当前 GitHub Pages 子路径时，构建和预览都需要设置 `BASE_PATH=/humanoid-hoisting/`，测试地址也要包含该子路径。

独立域名根路径使用 `BASE_PATH=/`。正式域名用于 canonical、社交预览和论文元数据；不要将示例域名作为公开地址。GitHub Pages 的技术支持不替代 UF 的域名与品牌要求。本地目录已关联 `https://github.com/cgchrfchscyrh/humanoid-hoisting.git`。推送 `main` 会运行检查并部署到上面的在线地址。

## 来源与许可

- 正文、补充材料和图表：`2026_Hoist_CES/rcim_submission/` 的 RCIM LaTeX 源文件。
- 视频：`1204_HOIST_Humanoid_Optimizati_Supplementary Materials/hoist.mp4`。原音轨所有样本均为零，网站版删除空音轨并压缩；没有省略语音内容。
- 首屏采用左右双视频背景，左为真实吊装，右为 HOIST 实体机器人。桌面标题/作者/按钮叠加在背景上，手机与平板将文字移到画面外。无自动播放或循环，共同按钮与原生控件均可暂停；无 JavaScript 时保留原生控件。
- 首屏施工视频：[CRANE #2](https://www.dvidshub.net/video/760467/crane-2)，U.S. Navy / Defense VI Records Center / DVIDS，原站标为美国公有领域，遵循原站使用条件。截取 01:38–02:04、移除音轨，保留来源及规定的非背书声明；HOIST 片段取自原视频 00:16–00:42，裁出右侧 HOIST 实验。具体来源、处理和封面帧记录在 `public/media/ATTRIBUTION.json`。
- 首页施工背景照片：MTA Capital Construction Mega Projects，2017-10-03，CC BY 2.0。原始来源和许可保存在 `src/assets/construction/ATTRIBUTION.json`，页面图注提供署名和许可链接。仅做响应式缩放/压缩，不改变画面内容；该图片不属于论文实验图。
- Peikko 与 NCC 行业视频仅链接到发布者原站，没有复制、嵌入或自动播放。后续若嵌入，需先核对授权、字幕和键盘操作。
- 原始研究材料保持原样，不随网页仓库提交。
- 模板源自 Roman Hauksson，设计继承 [Nerfies](https://nerfies.github.io/) 和 [Eliahu Horwitz 的模板](https://github.com/eliahuhorwitz/Academic-project-page-template)。原说明保存在 `TEMPLATE-README.md`。
- 模板及改编页面设计遵循 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。论文、研究图片、PDF 和视频保留各自作者的权利。
