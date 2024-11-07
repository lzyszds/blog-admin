<template>
  <div class="toolbar">
    <div class="toolbar-group">
      <button
        @click="$emit('back', '')"
        class="toolbar-button"
        data-mdtitle="撤销 (Ctrl+Z)"
      >
        <LzyIcon name="lets-icons:back" />
      </button>

      <button
        @click="$emit('return', '')"
        class="toolbar-button"
        data-mdtitle="重做 (Ctrl+Y)"
      >
        <LzyIcon name="lets-icons:return" />
      </button>

      <button
        @click="$emit('return', '')"
        class="toolbar-button"
        data-mdtitle="清除 (Ctrl+Y)"
      >
        <LzyIcon name="lets-icons:del-alt-duotone-line" />
      </button>
    </div>
    <div class="divider"></div>
    <div class="toolbar-group">
      <a-popover trigger="click" overlayClassName="diySelect">
        <template #content>
          <p>一级标题</p>
          <p>二级标题</p>
          <p>三级标题</p>
          <p>四级标题</p>
          <p>五级标题</p>
        </template>
        <button
          type="text"
          class="toolbar-button"
          style="padding-right: 0; width: 40px"
          data-mdtitle="标题 (Ctrl+1~6)"
        >
          <span style="font-size: 17.5px">H</span>
          <LzyIcon size="18" name="lets-icons:arrow-drop-down" />
        </button>
      </a-popover>

      <button type="text" class="toolbar-button" data-mdtitle="加粗 (Ctrl+B)">
        <span style="font-size: 17.5px">B</span>
      </button>
      <button type="text" class="toolbar-button" data-mdtitle="斜体 (Ctrl+I)">
        <LzyIcon size="16" name="fluent:text-italic-16-filled" />
      </button>
      <button type="text" class="toolbar-button" data-mdtitle="引用 (Ctrl+Q)">
        <LzyIcon size="16" name="mdi:comment-quote-outline" />
      </button>
      <button type="text" class="toolbar-button" data-mdtitle="删除线">
        <LzyIcon size="20" name="clarity:strikethrough-line" />
      </button>
    </div>
    <div class="divider"></div>
    <div class="toolbar-group">
      <button type="text" class="toolbar-button" data-mdtitle="无序列表">
        <LzyIcon size="20" name="mdi:format-list-bulleted" />
      </button>
      <button type="text" class="toolbar-button" data-mdtitle="有序列表">
        <LzyIcon size="20" name="mdi:format-list-numbered" />
      </button>
      <button type="text" class="toolbar-button" data-mdtitle="插入表格">
        <LzyIcon size="20" name="mdi:table-large" />
      </button>
      <button type="text" class="toolbar-button" data-mdtitle="分割线">
        <LzyIcon size="20" name="mdi:minus" />
      </button>
      <button type="text" class="toolbar-button" data-mdtitle="折叠面板">
        <LzyIcon size="20" name="mdi:format-align-middle" />
      </button>
    </div>
    <div class="divider"></div>
    <div class="toolbar-group">
      <button @click="$emit('link', '')" class="toolbar-button" data-mdtitle="连接">
        <LzyIcon name="lets-icons:link" />
      </button>
      <a-popover trigger="click" overlayClassName="diySelect">
        <template #content>
          <p>上传图片</p>
          <p>添加链接</p>
        </template>
        <button
          @click="$emit('image', '')"
          class="toolbar-button"
          data-mdtitle="图片"
          style="width: 50px; padding: 0"
        >
          <LzyIcon name="lets-icons:img-box" />
          <LzyIcon size="18" name="lets-icons:arrow-drop-down" />
        </button>
      </a-popover>
      <button @click="$emit('image', '')" class="toolbar-button" data-mdtitle="文件">
        <LzyIcon name="lets-icons:folder-alt" />
      </button>
      <button @click="$emit('code', '')" class="toolbar-button" data-mdtitle="代码块">
        <LzyIcon name="mdi:code-json" />
      </button>
      <!-- <a-popover trigger="click" overlayClassName="diySelect">
        <template #content>
          <p>上传图片</p>
          <p>添加链接</p>
        </template>
        <button
          @click="$emit('image', '')"
          class="toolbar-button"
          data-mdtitle="文件"
          style="width: 48px; padding: 0"
        >
          <LzyIcon name="lets-icons:folder-alt" />
          <LzyIcon size="18" name="lets-icons:arrow-drop-down" />
        </button>
      </a-popover> -->
    </div>
    <div class="divider"></div>

    <div class="toolbar-group">
      <button
        @click="$emit('save', '')"
        class="toolbar-button"
        data-mdtitle="保存 (Ctrl+Y)"
      >
        <LzyIcon name="lets-icons:save" />
      </button>
    </div>

    <div class="toolbar-group right">
      <button @click="$emit('toggle-preview')" class="toolbar-button" data-mdtitle="预览">
        <LzyIcon name="lets-icons:eye-duotone" />
      </button>
      <button
        @click="$emit('toggle-preview')"
        class="toolbar-button"
        data-mdtitle="同步滚动"
      >
        <LzyIcon name="mdi:sync" />
      </button>
      <button
        @click="$emit('toggle-fullscreen')"
        class="toolbar-button"
        data-mdtitle="全屏"
      >
        <LzyIcon name="lets-icons:full-alt-light" />
      </button>
    </div>
  </div>
</template>

<script setup>
import LzyIcon from "../LzyIcon.vue";

const titleValue = ref("");

const emit = defineEmits(["insert-text", "toggle-preview", "toggle-fullscreen"]);

const insertTable = () => {
  emit(
    "insert-text",
    "\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n"
  );
};

const insertLink = () => {
  emit("insert-text", "[Link text](url)");
};

const insertImage = () => {
  emit("insert-text", "![Alt text](image-url)");
};

const insertCode = () => {
  emit("insert-text", "\n```\ncode block\n```\n");
};

const handleChangeTitle = (value) => {
  emit("insert-text", `\n${value} `);
};
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #ffffff;
}

.toolbar-group {
  display: flex;
  align-items: center;
  padding: 0 0.25rem;

  .diySelect {
  }
}
.divider {
  width: 1px;
  height: 1.1rem;
  border-right: 1px solid #aeaeae;
}

.toolbar-group.right {
  margin-left: auto;
}

.toolbar-button {
  padding: 0.375rem;
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
  color: #64748b;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background-color 0.2s, color 0.2s;
  position: relative;

  &::before {
    content: attr(data-mdtitle);
    position: absolute;
    left: 100%;
    top: 40px;
    transform: translateX(-50%);
    background-color: #999;
    color: #fff;
    padding: 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
    z-index: 111;
    /* 不换行 */
    white-space: nowrap;
  }

  &:hover {
    background-color: #e2e8f0;
    color: #1e293b;
    &::before {
      opacity: 1;
    }
  }

  svg {
    font-size: 18px;
  }
}

.diySelect {
  p {
    cursor: pointer;
    padding: 5px 12px;
    border-radius: 5px;
    user-select: none;
    &:hover {
      background-color: #e2e8f0;
    }
  }
}
</style>
