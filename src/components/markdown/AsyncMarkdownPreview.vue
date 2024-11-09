<template>
  <div v-html="renderedHtml"></div>
</template>

<script setup>
import MarkdownIt from "markdown-it";
import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import { fromHighlighter } from "@shikijs/markdown-it/core";

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

import { useEditor } from "@/hook/useEditor";

/* 插件 */
import mdMark from "markdown-it-mark";
import mdAttrs from "markdown-it-attrs";
import mdEmoji from "markdown-it-emoji";
import markdownItContainer from "markdown-it-container";
import mdBracketedSpans from "markdown-it-bracketed-spans";
import mdInlineComments from "markdown-it-inline-comments";

import getWasm from "shiki/wasm";

const props = defineProps({
  markdownInput: String,
});
const emit = defineEmits(["renderedHtml"]);

const md = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const langs = [
  "html",
  "css",
  "js",
  "jsx",
  "ts",
  "tsx",
  "vue",
  "json",
  "sh",
  "nginx",
  "xml",
];

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
];

const highlighter = await createHighlighterCore({
  themes: [import("shiki/themes/one-dark-pro.mjs")],
  langs: langModules,
  engine: createOnigurumaEngine(import("shiki/wasm")),
});

/* 自定义容器插件 折叠面板 */
md.use(markdownItContainer, "fold", {
  validate: function (params) {
    return params.trim().match(/^fold\s+(.*)$/);
  },

  render: function (tokens, idx) {
    var m = tokens[idx].info.trim().match(/^fold\s+(.*)$/);

    if (tokens[idx].nesting === 1) {
      // opening tag
      return "<details><summary>" + md.utils.escapeHtml(m[1]) + "</summary>\n";
    } else {
      // closing tag
      return "</details>\n";
    }
  },
});
/* shiki代码块高亮插件 */
md.use(
  fromHighlighter(highlighter, {
    theme: "one-dark-pro",
  })
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

const renderedHtml = ref("");
watch(
  () => props.markdownInput,
  (newMarkdown) => {
    try {
      const data = md.render(newMarkdown || "");
      renderedHtml.value = data;
      emit("renderedHtml", data);
    } catch (error) {}
  },
  { immediate: true }
);
</script>
<style>
.preview-pane {
  ul,
  ol {
    margin-bottom: 1rem;
    margin: 0;
    padding: 0;
  }

  li {
    margin-bottom: 1rem;
    margin-left: 1rem;
  }

  h1,
  h2,
  h3,
  h4 {
    animation-duration: 0.5s;
    animation-delay: 0.5s;
  }

  h1 {
    padding-bottom: 0.3em;
    font-size: 1.3em;
    color: #000;
    font-weight: 600;
    font-family: "dindin";
  }

  h2 {
    padding-bottom: 8px;
    border-bottom: 1px dashed #ddd;
    color: #000;
    font-size: 20px;
    font-weight: 600;
    font-family: "dindin";

    &::before {
      content: "#";
      color: #ff6d6d;
      margin-right: 20px;
    }
  }

  h3 {
    color: #222;
    font-size: 18px;
    font-weight: 600;

    &:before {
      content: "🌠";
      color: var(--themeColor);
      margin-right: 20px;
    }
  }

  h4 {
    color: #222;
    position: relative;
    font-size: 18px;
    font-weight: 600;

    &:before {
      content: "~";
      color: var(--themeColor);
    }
  }

  p {
    margin-bottom: 1rem;
    margin: 0;
    font-size: 14px;
  }

  & a,
  & p a code {
    color: var(--themeColor);
  }

  a > .v-md-svg-outbound {
    color: var(--themeColor);
    vertical-align: text-bottom;
    display: initial;
  }

  table {
    border-collapse: collapse;
    width: max-content;
    border-radius: 5px;
    margin: 0 auto;
    font-size: 15px;
  }

  th {
    color: #fff;
    padding: 0 8px;
    text-align: left;
    background-color: var(--themeColor);
  }

  td {
    padding: 0 8px;
    text-align: left;
  }

  tr:nth-child(even) {
    background-color: none;
  }

  pre {
    padding: 0.75rem;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
    overflow-x: auto;
    code {
      border-radius: 0.25rem;
      font-family: "Fira Code";
      font-weight: 400;
    }
  }
  details {
    border-radius: 5px;
    overflow: hidden;
    background: #f5f5f5;
    color: #333;
    border: 1px solid #ccc;
    summary {
      padding: 10px 15px;
      cursor: pointer;
      font-weight: bold;
      font-size: 14px;
      background: #e6e6e6;
      margin: 0;
    }
    p {
      padding: 10px 15px;
      background-color: #fff;
    }
  }

  blockquote {
    margin: 1rem 0;
    color: #999;
    font-size: 1.5rem;
    border-left: 0.2rem solid var(--themeColor);
    background: aliceblue;
    font-family: "dindin";
    p {
      padding: 0.5rem;
      padding-left: 10px;
    }
  }
}
</style>
