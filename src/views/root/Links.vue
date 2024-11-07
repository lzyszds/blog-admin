<script setup lang="ts">
import mdIt from "markdown-it";
import markdownItContainer from "markdown-it-container";

const md = mdIt({
  html: true,
  linkify: true,
  typographer: true,
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

console.log(md.render("::: spoiler click me\n*content*\n:::\n"));

// Output:
//
// <details><summary>click me</summary>
// <p><em>content</em></p>
// </details>
</script>

<template>
  <div></div>
</template>

<style scoped></style>
