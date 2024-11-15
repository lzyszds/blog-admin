<template>
  <div>
    <div ref="preview" v-html="renderedHtml"></div>
  </div>
</template>

<script setup>
import MarkdownIt from "markdown-it";
import {createHighlighterCore} from "shiki/core";
import {createOnigurumaEngine} from "shiki/engine/oniguruma";
import {fromHighlighter} from "@shikijs/markdown-it/core";
import {Fancybox} from "@fancyapps/ui"; //图片放大

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


/* 插件 */
import mdMark from "markdown-it-mark"; // 高亮标记
import mdAttrs from "markdown-it-attrs"; // 添加自定义属性
import {full as mdEmoji} from 'markdown-it-emoji' // emoji
import mdBracketedSpans from "markdown-it-bracketed-spans"; // 括号跨度
import mdInlineComments from "markdown-it-inline-comments"; // 行内注释
import mdTipsCollectPlugin from "./plugin/tipsCollect";
import mdImagePlugin from "./plugin/image";
import setDirectoryId from "./plugin/directoryid";


const props = defineProps({
  markdownInput: String,
});

const emit = defineEmits(["renderedHtml"]);
const preview = templateRef("preview"); // 用于渲染markdown的容器
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
md.use(mdImagePlugin, {
  baseUrl: import.meta.env.VITE_BASE_URL,
});
setDirectoryId(md);
mdTipsCollectPlugin(md);
/* 图片放大插件绑定 */
const fancyboxBind = () => {
  Fancybox.bind(preview.value, {
    Carousel: {
      Panzoom: {
        zoomLevels: 5,
      },
    },
  });
};

const renderedHtml = ref("");
watch(
    () => props.markdownInput,
    (newMarkdown) => {
      try {
        const data = md.render(newMarkdown || "");
        renderedHtml.value = data;
        emit("renderedHtml", data);
        fancyboxBind();
      } catch (error) {
        console.error(error);
      }
    },
    {immediate: true}
);

onMounted(() => {
  fancyboxBind();
});
</script>
<style>
.preview-pane {
  ul,
  ol {
    margin: 0;
    padding: 0;
    list-style-position: inside; /* 确保标记符号在列表项内部 */
  }

  ul li {
    padding-left: 0.2rem;
  }

  h1,
  h2,
  h3,
  h4 {
    animation-duration: 0.5s;
    animation-delay: 0.5s;
    color: #000000db;
  }

  h1 {
    padding-bottom: 0.3em;
    font-size: 1.3em;
    font-weight: 600;
    font-family: "dindin";
  }

  h2 {
    padding-bottom: 8px;
    border-bottom: 1px dashed #ddd;
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
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  table thead {
    background-color: #5161ce;
    color: white;
  }

  table th,
  table td {
    padding: 12px 15px;
    text-align: left;
  }

  table th {
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    letter-spacing: 0.5px;
  }

  table tbody tr:nth-child(even) {
    background-color: #f8f8f8;
  }

  table tbody tr:hover {
    background-color: rgba(81, 97, 206, 0.1);
    transition: background-color 0.3s ease;
  }

  @media (max-width: 600px) {
    .table th,
    .table td {
      padding: 8px 10px;
    }

    .table th {
      font-size: 12px;
    }
  }

  pre {
    padding: 0.75rem;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
    overflow-x: auto;
    line-height: 23px;

    code {
      border-radius: 0.25rem;
      font-family: "Fira Code";
      font-weight: 400;
      /* 初始化计数器 */
      counter-reset: line-number;

      .line::before {
        counter-increment: line-number;
        /* 计数器自增 */
        content: counter(line-number);
        /* 显示行号 */
        display: inline-block;
        /* 行号的宽度，可以调整 */
        text-align: left;
        margin-right: 10px;
        width: 30px;
        /* 行号和代码的间距 */
        color: #495162;
      }
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

  .markdown-plugin-tip {
    border-radius: 10px;
    font-family: "dindin";
    padding: 10px;
    border-radius: 5px;
    border-left: 5px solid var(--themeColor);
    margin-top: 10px;
    background-color: #e6e6e6;

    .markdown-tip-title {
      color: var(--color-primary);
      font-size: 20px;
      font-weight: 600;
    }

    &.tip {
      border-color: #4a9ff5;

      .markdown-tip-title {
        color: #4a9ff5;
      }
    }

    &.warning {
      border-color: #ffd500;

      .markdown-tip-title {
        color: #be9e01;
      }
    }

    &.danger {
      border-color: #ff5050;

      .markdown-tip-title {
        color: #ff5050;
      }
    }

    &.danger {
      border-color: #ff5050;

      .markdown-tip-title {
        color: #ff5050;
      }
    }

    &.success {
      border-color: #00cb6ce6;

      .markdown-tip-title {
        color: #00cb6ce6;
      }
    }

    &.note {
      border-color: #00cb6ce6;

      .markdown-tip-title {
        color: #00cb6ce6;
      }
    }

    &.attention {
      border-color: #ffb400;

      .markdown-tip-title {
        color: #ffb400;
      }
    }

    &.caution {
      border-color: #ff5050;

      .markdown-tip-title {
        color: #ff5050;
      }
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

  .img-wrapper {
    position: relative;
    --height: 20px;
    background-color: #f0f2f5;
    padding: 5px 1px;
    border-radius: 10px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
    cursor: zoom-in;
    border: 1px solid #aaa;
    margin: 5px 0 10px;
    width: 100%;

    &:hover {
      .img-pseudo::before {
        content: "🔎点击放大图片";
      }

      img {
        filter: brightness(0.7);
      }
    }

    img {
      margin: var(--height) 5px 0;
      border-radius: 10px;
      transition: 0.5s;
      width: calc(100% - 10px);
    }

    .img-pseudo {
      background-color: var(--themeColor);
      height: var(--height);
      width: calc(100%);
      border-radius: 10px 10px 0 0;
      text-align: center;
      position: absolute;
      top: 0;
      left: 0;
      color: #fff;
      font-size: 12px;

      &::before {
        content: attr(data-clipboard-text);
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
