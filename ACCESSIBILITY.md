# HOIST 无障碍、UF 品牌与安全检查记录

检查日期：2026-10-01。目标：WCAG 2.1 A / AA。检查对象为采用 RCIM 稿件的静态网站，包括首页、HTML 论文、HTML 补充材料和无障碍说明。**本记录是开发检查结果，不是 ADA、WCAG 或 PDF/UA 合规认证。**

## 已完成的修改

- 信息图片设置具体 alt；复杂流程有文字解释；实验图表提供数字和表格，方法名称不只用颜色区分。
- 每页单一 H1，分级标题、main landmark、跳至正文链接和可见键盘焦点。结果页签支持方向键，按钮/链接/折叠内容支持键盘。
- 链接名称说明用途；打开新标签页的图片链接有相应说明。禁用 JavaScript 时两组结果仍可阅读。
- 页面在 320 CSS px 下回流；宽公式和数据表使用局部可键盘滚动区域。支持文字间距调整、浏览器放大和减少动态偏好。
- 没有自动播放、轮播、GIF 或必须悬停才能使用的功能。视频由用户启动，提供原生暂停和播放控件。
- 原视频的整段音轨经解码检查，RMS = 0，最大振幅 = 0；网站版删除空音轨。它没有语音或其他有效声音，不把视觉描述误标为语音 captions。页面明确说明静音，提供完整的分时间文字说明与 WebVTT descriptions。若将来添加语音/有效声音，必须增加并人工校对同步字幕，重新评估音频描述需求。
- 全文与补充材料提供语义 HTML，包括表格标题/表头、原生 MathML、图像描述和章节目录。

## 施工背景整合

首屏以真实施工吊装与 HOIST 机器人操作左右对照。两段各约 26 秒，静音，无自动播放或循环；保留原生 controls，并提供可键盘操作的共同播放/暂停按钮。单独操作播放器时共同按钮同步更新；结束后可重播，脚本不可用时仍有原生控件。每段都有具体 accessible name、可展开的文字替代和 WebVTT descriptions，标明来源、剪辑时间、裁剪及静音处理。DVIDS 施工视频标为美国公有领域，来源和使用条件已核对，页面包含其要求的非背书声明；它不代表 HOIST 的工地部署。媒体证据在 `public/media/ATTRIBUTION.json`。

首屏桌面使用高对比度深色遮罩和白字；手机/平板将标题和作者区移到视频外，保持两段视频左右对照。

首页 Overview 增加 MTA 的 CC BY 2.0 施工照片，使用描述性 alt、可见图注、作者/来源/许可链接，以及响应式本地图片。图注明示网页缩放与压缩。施工动机旁说明 HOIST 的实体载荷为 2.5 kg 实验箱体，区分行业背景与实验验证。

Peikko 与 NCC 视频以名称明确、可键盘访问的原站链接提供；没有新增第三方 iframe、自动播放或下载的商业视频。已有 HOIST 静音视频和文字描述保持可用。

## 检查结果

| 检查                         | 结果                                                            | 证据                                |
| ---------------------------- | --------------------------------------------------------------- | ----------------------------------- |
| axe-core，WCAG 2.1 A/AA 规则 | 9 组扫描，0 项自动违规                                          | `reports/axe-wcag21aa.json`         |
| 功能与回流检查               | 44 项通过，0 个页面脚本异常                                     | 同上                                |
| Astro / TypeScript 与 ESLint | 通过                                                            | `npm run build`、`npm run lint`     |
| 生产依赖安全审计             | 当前已知漏洞 0 项                                               | `reports/npm-audit-production.json` |
| 主论文网页 PDF 阅读版        | 26 页；有标签、英语语言标记、标题、表头、11 处图像 alt          | `reports/pdf-structure.json`        |
| 补充材料网页 PDF 阅读版      | 11 页；有标签、英语语言标记、标题、表头、6 处图像 alt           | 同上                                |
| PDF 视觉检查                 | 全部 37 页渲染检查；未发现文字超出页面边界                      | 已修复表格/表题分页问题             |
| GitHub Pages 子目录          | `/hoist/` 下 4 个页面、44 个本地 URL 通过；无资源错误或脚本异常 | `reports/github-pages-path.json`    |
| PDF 链接                     | 无 localhost 或 127.0.0.1 下载/引用链接                         | PDF 注释对象检查                    |

扫描包括桌面与手机视图，以及首页数据表/视频说明展开状态。报告保留 axe 的 `incomplete` 项，尤其是图片/视频内部文字与数学公式；这些项不应视为自动通过。版面复查覆盖图表的标注、对比度和数字替代，但没有测量原研究图片内部每个文字像素。

## PDF 及人工复查边界

下载文件是从 HTML 重新排版的 **带结构标签的网页阅读版**，不是原始投稿 PDF；页面已提示其页码不同。原始研究文件没有被覆盖。PDF 已有结构树和图片 alt，但部分数学内容由 Chromium 输出为 Figure，不能仅凭标签存在就判断公式可读。

正式发布前仍需使用 NVDA / VoiceOver / JAWS 等实际屏幕阅读器，检查完整阅读顺序、长表格的表头关联、公式读法与媒体替代说明；PDF 还需在 Acrobat/PAC 等工具中检查标签和阅读顺序，特别是数学公式。当前未运行这些辅助技术或 PDF/UA 专项验证。HTML MathML 阅读版是附带的全文选项，不构成免除 PDF 复查的理由。

## 项目标识与研究声明

按用户最新要求，页眉和页脚已移除 UF 标志，删除公开目录中的 UF 标志素材，favicon 改为 HOIST 项目的 H 字母图标。保留论文中的 Department of Civil and Coastal Engineering, University of Florida 作者单位文字。

所有页面的共享页脚增加以下声明：

> Research disclaimer. The research, views, and findings presented on this website are those of the authors and do not represent the official views, policies, or positions of the University of Florida.

按用户要求，界面、favicon、浏览器主题色均改用炭黑和灰白，不使用 UF 蓝橙主题。论文原始图表和真实场景中的颜色不改动。本地托管的 IBM Plex Sans 保持不变。项目无障碍、UF 无障碍服务和隐私声明入口继续可用。

移除标志和增加研究声明不改变本项目的无障碍要求，也不构成学校的品牌或域名审批。相关规范参见 [UF Web Standards](https://brandcenter.ufl.edu/web-standards/)。

## 安全及部署范围

网站为静态内容，不包含登录、表单收集、分析跟踪器或第三方嵌入式播放器。字体、脚本、视频和图片本地托管。构建后为实际内联脚本计算 SHA-256，并写入 meta CSP；不允许外部脚本、插件对象或表单提交。依赖通过锁文件固定，部署前进行已知漏洞审计。

meta CSP 不能提供 `frame-ancestors` 等仅响应头生效的保护，也不替代服务器配置。实际部署后应核对 HTTPS、资源/链接、目标域名，以及托管平台可配置的安全响应头。当前没有线上站点，因此没有声称完成线上安全验证。

## 后续更新

每次修改内容后运行 `npm run lint`、`npm run build`、`npm run audit:security` 和 `npm run test:a11y`。修改视频、公式、图表或 PDF 后，还需复查对应人工项目。GitHub Pages 工作流已将自动检查作为部署前置条件。
