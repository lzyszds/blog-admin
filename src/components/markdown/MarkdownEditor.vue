<script setup lang="ts">
import Toolbar from "./Toolbar.vue";
import AsyncMarkdownPreview from "./AsyncMarkdownPreview.vue";
import { handleKeyDown } from "./utils/keydown";
import { useEditor } from "@/hook/useEditor";
import { useEditorStore } from "@/store/useEditorStore";

const previewPaneRef = templateRef("previewPaneRef");

// Markdown输入内容的模型定义
const markdownInput = defineModel({
  type: String,
  default: "",
});

/* 父组件传递过来的保存表单的方法 */
const { saveForm } = defineProps(["saveForm"]);

/* 暴露事件给父组件的上传图片事件 */
const emit = defineEmits(["updateImage"]);

const renderedHtml = ref("");

// 导入编辑器钩子并解构出相关方法
const useEditorOption = useEditor(markdownInput);
const {
  undo,
  redo,
  updateCurrentHistoryRange,
  saveHistory,
  markdownEditorRef,
} = useEditorOption;

//导入store中的部分数据
const editorStore = useEditorStore();

/* 监听文本输入，更新markdownInput的值 */
const updateMarkdownInput = (val) => {
  markdownInput.value = val.target.value;
};

/* 获取渲染后的HTML内容  */
const getRenderedHtml = (html) => {
  // 获取渲染后的HTML内容
  renderedHtml.value = html;
};

const registerHotkeys = ({ key, callback, preventDefault }) => {
  useEventListener(markdownEditorRef, key, ($event) => {
    if (preventDefault) $event.preventDefault();
    callback();
  });
};
/* 回车键处理 */
registerHotkeys({
  key: "enter",
  preventDefault: false,
  callback: (_editor, _e) => {
    // if (e.isComposing) return;
    // const cursorLineLeftText = this.getCursorLineLeftText();
    // let suffix;
    // let syntax;
    // if (ol.test(cursorLineLeftText)) {
    //   suffix = "x. ";
    //   syntax = olSyntax;
    //   e.preventDefault();
    // } else if (ul.test(cursorLineLeftText)) {
    //   suffix = "- ";
    //   syntax = ulSyntax;
    //   e.preventDefault();
    // } else {
    //   return;
    // }
    // const indent = cursorLineLeftText.search(syntax);
    // const suffixIndex = indent + suffix.length;
    // let beforeText = cursorLineLeftText.slice(0, suffixIndex);
    // const content = cursorLineLeftText.slice(suffixIndex, cursorLineLeftText.length);
    // if (content) {
    //   if (suffix === "x. ") {
    //     beforeText = beforeText.replace(/(\d+)/, window.parseInt(beforeText) + 1);
    //   }
    //   this.replaceSelectionText(`\n${beforeText}`, "end");
    // } else {
    //   // break
    //   this.delLineLeft();
    //   this.replaceSelectionText("\n", "end");
    // }
  },
});
const updateImage = (...arg) => {
  emit("updateImage", arg);
};

// 键盘快捷键的初始化和处理
onMounted(() => {
  saveHistory();
  console.log(previewPaneRef.value);
});
const editorParams = {
  ref: markdownEditorRef, // 绑定编辑器元素
  value: markdownInput, // 绑定编辑器输入内容
  option: useEditorOption, // 提供编辑器选项
  updateCurrentHistoryRange, // 更新当前历史记录范围
  saveForm, //保存草稿
};

provide("editor", editorParams);
</script>

<template>
  <!-- Markdown编辑器主组件 -->
  <div
    class="markdown-editor"
    id="markdown-editor"
    :class="{ 'is-fullscreen': editorStore.isFullscreen }"
  >
    <!-- 工具栏，包含切换预览和全屏功能 -->
    <Toolbar :useEditorOption="useEditorOption" @updateImage="updateImage" />

    <!-- 编辑内容区域，根据是否全屏切换样式 -->
    <div class="editor-content">
      <!-- 编辑器窗格，根据是否只预览切换样式 -->
      <div class="editor-panes">
        <!-- Markdown文本输入框，支持多种键盘快捷操作 -->
        <textarea
          v-model="markdownInput"
          id="editor-textarea"
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
          @input="updateMarkdownInput"
          @keydown="handleKeyDown($event, editorParams)"
        ></textarea>

        <!-- Markdown实时预览组件 -->
        <AsyncMarkdownPreview
          :markdownInput="markdownInput"
          v-show="editorStore.previewOnly"
          class="preview-pane"
          @renderedHtml="getRenderedHtml"
        />
        <div
          class="preview-pane"
          v-show="editorStore.showHtml"
          v-text="renderedHtml"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Markdown编辑器的整体样式 */
#markdown-editor.markdown-editor {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  font-family: menlo, Ubuntu Mono, consolas, Courier New, Microsoft Yahei,
    Hiragino Sans GB, WenQuanYi Micro Hei, sans-serif;
  height: calc(100vh - 65px - 50px);
  display: flex;
  flex-direction: column;

  /* 全屏模式下的编辑内容区域样式 */
  &.is-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    height: 100%;
  }
}

/* 编辑内容区域的样式 */
.editor-content {
  position: relative;
  overflow: auto;
  flex: 1;
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
  display: none;
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
  height: calc(100% - 32px);
  background-color: #fff;
  border-left: 1px solid #eee;
}
</style>
