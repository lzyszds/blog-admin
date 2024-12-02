<script setup lang="ts">
import { ClassicEditor } from "ckeditor5";
import { Ckeditor } from "@ckeditor/ckeditor5-vue";
import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import { editorConfig } from "./ckeditor";

import("shiki/themes/one-dark-pro.mjs");

// Markdown输入内容的模型定义
const editorData = defineModel({
  type: String,
  default: "",
});

const editor = ClassicEditor;

// const { saveForm } = defineProps(["saveForm"]);
</script>

<template>
  <div class="markdown-editor" id="markdown-editor">
    <ckeditor v-model="editorData" :editor="editor" :config="editorConfig" />
  </div>
</template>

<style>
#markdown-editor.markdown-editor {
  --ck-color-button-on-color: var(--themeColor);
  --ck-color-button-on-background: rgba(var(--themeColorRgb), 0.1);
  --ck-border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  font-family: var(--font), fangsong;
  font-size: 15px;
  height: calc(100vh - 65px - 50px);
  display: flex;
  flex-direction: column;

  .ck {
    background-color: var(--color-bg);
    color: var(--color-text);

    .ck-sticky-panel__content {
      border: none;

      .ck-button:focus,
      .ck-button:active {
        outline: none;
        border-color: transparent;
        box-shadow: none;
        border-radius: 8px;
      }
    }

    .ck.ck-dropdown .ck-button.ck-dropdown__button.ck-on {
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }

    .ck-editor__main {
      overflow-y: auto;
      height: calc(100vh - 65px - 50px - 40px);
    }

    .ck-button__label {
      width: auto;
    }

    .ck-list__item {
      min-width: 100px;
      padding: 0 6px;
      margin-bottom: 3px;
      transition: 0.12s;

      .ck-on svg {
        color: #00ce3e;
      }

      button {
        border-radius: 6px !important;
        transition: 0.12s;
      }

      span {
        font-weight: 100 !important;
        font-size: 14px;
        height: 20px;
        line-height: 20px;
        transition: 0.12s;
      }
    }

    &.ck-dropdown__panel_se {
      border-top-left-radius: 8px;
      margin-top: 5px;

      ul {
        border-top-left-radius: 8px;
      }
    }

    pre {
      padding: 0.75rem;
      border-radius: 0.25rem;
      margin-bottom: 1rem;
      overflow-x: auto;
      line-height: 23px;
      background-color: #282c34;

      code {
        border-radius: 0.25rem;
        font-family: "Fira Code";
        font-weight: 400;
        /* 初始化计数器 */
        counter-reset: line-number;
        color: #fff;

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
  }

  .ck.ck-editor__editable {
    height: 100%;
    border-radius: 0.5rem;
    border: none;
    outline: none;
    box-shadow: none;

    &.ck-focused {
      border: none;
    }
  }
}
</style>
