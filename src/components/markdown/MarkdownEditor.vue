<template>
  <!-- Markdown编辑器主组件 -->
  <div class="markdown-editor" id="markdown-editor">
    <!-- 工具栏，包含切换预览和全屏功能 -->
    <Toolbar @toggle-preview="togglePreview" @toggle-fullscreen="toggleFullscreen" />

    <!-- 编辑内容区域，根据是否全屏切换样式 -->
    <div class="editor-content" :class="{ 'is-fullscreen': isFullscreen }">
      <!-- 编辑器窗格，根据是否只预览切换样式 -->
      <div class="editor-panes" :class="{ 'preview-only': previewOnly }">
        <!-- Markdown文本输入框，支持多种键盘快捷操作 -->
        <textarea
          v-model="markdownInput"
          ref="markdownEditorRef"
          class="editor-textarea"
          placeholder="Enter markdown text here..."
          @keydown.ctrl.z.prevent.exact="undo"
          @keydown.meta.z.prevent.exact="undo"
          @keydown.ctrl.y.prevent.exact="redo"
          @keydown.meta.y.prevent.exact="redo"
          @keyup.shift.up.exact="updateCurrentHistoryRange"
          @keyup.shift.down.exact="updateCurrentHistoryRange"
          @keyup.shift.left.exact="updateCurrentHistoryRange"
          @keyup.shift.right.exact="updateCurrentHistoryRange"
        ></textarea>

        <!-- Markdown实时预览组件 -->
        <AsyncMarkdownPreview :markdownInput="markdownInput" class="preview-pane" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { debounce } from "lodash-es";
import Toolbar from "./Toolbar.vue";
import AsyncMarkdownPreview from "./AsyncMarkdownPreview.vue";
import { insertText } from "./utils/insert";
import { handleKeyDown } from "./utils/keydown";
import { useEditor } from "@/hook/useEditor";

// Markdown输入内容的模型定义
const markdownInput = defineModel({
  type: String,
  default: "",
});
// 控制是否全屏的响应式变量
const isFullscreen = ref(false);
// 控制是否只显示预览的响应式变量
const previewOnly = ref(false);

// 导入编辑器钩子并解构出相关方法
const {
  undo,
  redo,
  updateCurrentHistoryRange,
  markdownEditorRef,
  saveHistory,
  updateHistoryRange,
} = useEditor(markdownInput);

// 切换预览模式的方法
const togglePreview = () => {
  previewOnly.value = !previewOnly.value;
};

// 切换全屏模式的方法
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

// 键盘快捷键的初始化和处理
onMounted(() => {
  saveHistory();
  useEventListener(markdownEditorRef, "keydown", (event) => {
    handleKeyDown(event, markdownInput);
  });
});
</script>

<style scoped>
/* Markdown编辑器的整体样式 */
#markdown-editor.markdown-editor {
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  font-family: menlo, Ubuntu Mono, consolas, Courier New, Microsoft Yahei,
    Hiragino Sans GB, WenQuanYi Micro Hei, sans-serif;
}

/* 编辑内容区域的样式 */
.editor-content {
  position: relative;
  height: calc(100% - 48px);
}

/* 全屏模式下的编辑内容区域样式 */
.editor-content.is-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

/* 编辑器窗格的样式 */
.editor-panes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 500px;
  height: 100%;
}

/* 只预览模式下的编辑器窗格样式 */
.editor-panes.preview-only {
  grid-template-columns: 1fr;
}

/* Markdown文本输入框的样式 */
.editor-textarea {
  box-sizing: border-box;
  padding: 1em;
  overflow: hidden;
  color: #2c3e50;
  font-size: 14px;
  font-family: menlo, Ubuntu Mono, consolas, Courier New, Microsoft Yahei,
    Hiragino Sans GB, WenQuanYi Micro Hei, sans-serif;
  line-height: 1.5;
  word-break: break-all;
  border: none;
  border-right: 1px solid #eee;
  resize: none;
  height: 100%;
  overflow-y: auto;
}

/* Markdown文本输入框聚焦时的样式 */
.editor-textarea:focus {
  outline: none;
}

/* 预览窗格的样式 */
.preview-pane {
  padding: 1rem;
  overflow: auto;
}
</style>