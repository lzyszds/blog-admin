import MarkdownIt from "markdown-it";
import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import { fromHighlighter } from "@shikijs/markdown-it/core";
import mdAttrs from "markdown-it-attrs";
import mdMark from "markdown-it-mark";
import { full as mdEmoji } from "markdown-it-emoji";
import mdBracketedSpans from "markdown-it-bracketed-spans";
import mdInlineComments from "markdown-it-inline-comments";
import mdImagePlugin from "@/components/markdown/plugin/image.ts";
import setDirectoryId from "@/components/markdown/plugin/directoryid.ts";
import mdTipsCollectPlugin from "@/components/markdown/plugin/tipsCollect.ts";

// 手动导入每个语言模块
import htmlLang from "shiki/langs/html.mjs";
import cssLang from "shiki/langs/css.mjs";
import jsLang from "shiki/langs/javascript.mjs";
import jsxLang from "shiki/langs/jsx.mjs";
import tsLang from "shiki/langs/typescript.mjs";
import tsxLang from "shiki/langs/tsx.mjs";
import vueLang from "shiki/langs/vue.mjs";
import jsonLang from "shiki/langs/json.mjs";
import shLang from "shiki/langs/shellscript.mjs";
import nginxLang from "shiki/langs/nginx.mjs";
import xmlLang from "shiki/langs/xml.mjs";
import markDownLang from "shiki/langs/markdown.mjs";
import yamlLang from "shiki/langs/yaml.mjs";

const md = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});

// 批量导入所有语言模块
const langModules = [
  htmlLang,
  cssLang,
  jsLang,
  jsxLang,
  tsLang,
  tsxLang,
  vueLang,
  jsonLang,
  shLang,
  nginxLang,
  xmlLang,
  markDownLang,
  yamlLang,
];

const highlighter = await createHighlighterCore({
  themes: [import("shiki/themes/one-dark-pro.mjs")],
  langs: langModules,
  engine: createOnigurumaEngine(import("shiki/wasm")),
});

/* 自定义容器插件 折叠面板 */

/* shiki代码块高亮插件 */
md.use(
  fromHighlighter(highlighter, {
    theme: "one-dark-pro",
  }),
);
/* 自定义属性插件 attrs */
md.use(mdAttrs, {
  // optional, these are default options
  leftDelimiter: "{",
  rightDelimiter: "}",
  allowedAttributes: [], // empty array = all attributes are allowed
});
md.use(mdMark);
md.use(mdEmoji);
md.use(mdBracketedSpans);
md.use(mdInlineComments);
md.use(mdImagePlugin, {
  baseUrl: import.meta.env.VITE_BASE_URL,
});
setDirectoryId(md);
mdTipsCollectPlugin(md);

export default md;
