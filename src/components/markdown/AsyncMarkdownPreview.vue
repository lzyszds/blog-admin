<template>
  <div v-html="renderedHtml"></div>
</template>

<script setup>
import { fromHighlighter } from "@shikijs/markdown-it/core";
import MarkdownIt from "markdown-it";
import { createHighlighter } from "shiki";
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

const md = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const shiki = await createHighlighter({
  langs: ["js", "vue"],
  themes: ["one-dark-pro"],
});

md.use(markdownItContainer, "spoiler", {
  validate: function (params) {
    return params.trim().match(/^spoiler\s+(.*)$/);
  },

  render: function (tokens, idx) {
    var m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);

    if (tokens[idx].nesting === 1) {
      // opening tag
      return "<details><summary>" + md.utils.escapeHtml(m[1]) + "</summary>\n";
    } else {
      // closing tag
      return "</details>\n";
    }
  },
});

const renderedHtml = ref("");
watch(
  () => props.markdownInput,
  (newMarkdown) => {
    const data = md.render(newMarkdown || "");

    renderedHtml.value = data;
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
      padding: 0.125rem 0.25rem;
      border-radius: 0.25rem;
    }
    span {
      font-family: "Red Hat Display";
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
}
</style>
