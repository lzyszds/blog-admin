<template>
  <div class="markdown-editor" id="markdown-editor">
    <Toolbar
      @insert-text="insertText"
      @toggle-preview="togglePreview"
      @toggle-fullscreen="toggleFullscreen"
    />

    <div class="editor-content" :class="{ 'is-fullscreen': isFullscreen }">
      <div class="editor-panes" :class="{ 'preview-only': previewOnly }">
        <textarea
          v-model="markdownInput"
          class="editor-textarea"
          placeholder="Enter markdown text here..."
          @input="debouncedUpdatePreview"
        ></textarea>
        <!-- v-show="!isEditing || previewOnly" -->

        <AsyncMarkdownPreview :markdown="markdownInput" class="preview-pane" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { debounce } from "lodash-es";
import Toolbar from "./Toolbar.vue";
import AsyncMarkdownPreview from "./AsyncMarkdownPreview.vue";

const markdownInput = defineModel();
const isFullscreen = ref(false);
const previewOnly = ref(false);
const isEditing = ref(true);

const debouncedUpdatePreview = debounce(() => {
  isEditing.value = false;
}, 300);

const insertText = (text) => {
  const textarea = document.querySelector(".editor-textarea");
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const content = markdownInput.value;

  markdownInput.value = content.substring(0, start) + text + content.substring(end);
  textarea.focus();
  textarea.selectionStart = textarea.selectionEnd = start + text.length;
  isEditing.value = true;
};

const togglePreview = () => {
  previewOnly.value = !previewOnly.value;
};

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

// Keyboard shortcuts
const handleKeyDown = (e) => {
  if (e.ctrlKey && e.key === "b") {
    e.preventDefault();
    insertText("**");
  } else if (e.ctrlKey && e.key === "i") {
    e.preventDefault();
    insertText("*");
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
#markdown-editor.markdown-editor {
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  font-family: menlo, Ubuntu Mono, consolas, Courier New, Microsoft Yahei,
    Hiragino Sans GB, WenQuanYi Micro Hei, sans-serif;
}

.editor-content {
  position: relative;
}

.editor-content.is-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.editor-panes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 500px;
}

.editor-panes.preview-only {
  grid-template-columns: 1fr;
}

.editor-textarea {
  box-sizing: border-box;
  padding: 20px 20px 30px;
  overflow: hidden;
  color: #2c3e50;
  font-size: 14px;
  font-family: menlo, Ubuntu Mono, consolas, Courier New, Microsoft Yahei,
    Hiragino Sans GB, WenQuanYi Micro Hei, sans-serif;
  line-height: 1.5;
  word-break: break-all;
  border: none;
  border-right: 1px solid #eee;
}

.editor-textarea:focus {
  outline: none;
}

.preview-pane {
  padding: 1rem;
  overflow: auto;
}
</style>
