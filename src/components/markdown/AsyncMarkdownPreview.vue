<template>
  <div v-html="renderedHtml"></div>
</template>

<script setup>
import { fromHighlighter } from "@shikijs/markdown-it/core";
import MarkdownIt from "markdown-it";
import { createHighlighter } from "shiki";
import getWasm from "shiki/wasm";

const props = defineProps({
  markdown: {
    type: String,
    required: true,
  },
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
md.use(
  fromHighlighter(shiki, {
    themes: {
      light: "one-dark-pro",
      dark: "one-dark-pro",
    },
  })
);
const renderedHtml = ref("1");
watch(
  () => props.markdown,
  (newMarkdown) => {
    const data = md.render(newMarkdown || "");
    renderedHtml.value = data;
  },
  { immediate: true }
);
</script>
<style>
 
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
  font-size: 21px;
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
</style>
