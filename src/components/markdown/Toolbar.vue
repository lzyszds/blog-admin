<template>
  <div class="toolbar">
    <div class="toolbar-group">
      <ToolbarButton
        title="撤销 (Ctrl+Z)"
        icon-name="lets-icons:back"
        @click="clickHandle('back')"
      />

      <ToolbarButton
        @click="clickHandle('return')"
        title="重做 (Ctrl+Y)"
        icon-name="lets-icons:return"
      />

      <ToolbarButton
        @click="clickHandle('clear')"
        icon-name="lets-icons:del-alt-duotone-line"
        title="清除"
      />
    </div>
    <div class="divider"></div>
    <div class="toolbar-group">
      <a-popover trigger="click" overlayClassName="diySelect">
        <template #content>
          <p @click="clickHandle('title', '#')">一级标题</p>
          <p @click="clickHandle('title', '##')">二级标题</p>
          <p @click="clickHandle('title', '###')">三级标题</p>
          <p @click="clickHandle('title', '####')">四级标题</p>
          <p @click="clickHandle('title', '#####')">五级标题</p>
        </template>
        <ToolbarButton
          icon-name="mdi:format-header-1"
          icon-size="20"
          title="标题 (Ctrl+1~6)"
          style="padding: 3px 0 0; width: 50px"
        >
          <LzyIcon size="20" name="lets-icons:arrow-drop-down" />
        </ToolbarButton>
      </a-popover>

      <ToolbarButton @click="clickHandle('bold')" title="加粗 (Ctrl+B)">
        <span style="font-size: 17.5px">B</span>
      </ToolbarButton>

      <ToolbarButton
        @click="clickHandle('italic')"
        icon-name="fluent:text-italic-16-filled"
        icon-size="16"
        title="斜体 (Ctrl+I)"
      />

      <ToolbarButton
        @click="clickHandle('quote')"
        icon-name="mdi:comment-quote-outline"
        icon-size="16"
        title="引用 (Ctrl+Q)"
      />

      <ToolbarButton
        @click="clickHandle('strikethrough')"
        icon-name="clarity:strikethrough-line"
        icon-size="20"
        title="删除线"
      />
    </div>
    <div class="divider"></div>
    <div class="toolbar-group">
      <ToolbarButton
        @click="clickHandle('disorder')"
        icon-name="mdi:format-list-bulleted"
        icon-size="20"
        title="无序列表"
      />
      <ToolbarButton
        @click="clickHandle('order')"
        icon-name="mdi:format-list-numbered"
        icon-size="20"
        title="有序列表"
      />
      <ToolbarButton
        @click="clickHandle('table')"
        icon-name="mdi:table-large"
        icon-size="20"
        title="插入表格"
      />
      <ToolbarButton
        @click="clickHandle('hr')"
        icon-name="mdi:minus-box-multiple-outline"
        icon-size="20"
        title="分割线"
      />
      <ToolbarButton
        @click="clickHandle('fold')"
        icon-name="mdi:format-align-middle"
        icon-size="20"
        title="折叠面板"
      />
    </div>
    <div class="divider"></div>
    <div class="toolbar-group">
      <ToolbarButton
        @click="clickHandle('link')"
        icon-name="lets-icons:link"
        title="链接"
      />
      <a-popover trigger="click" overlayClassName="diySelect">
        <template #content>
          <p>上传图片</p>
          <p>添加链接</p>
        </template>
        <ToolbarButton
          @click="clickHandle('image')"
          icon-name="lets-icons:img-box"
          title="图片"
          style="width: 50px; padding: 0"
        >
          <LzyIcon size="18" name="lets-icons:arrow-drop-down" />
        </ToolbarButton>
      </a-popover>
      <ToolbarButton
        @click="clickHandle('file')"
        icon-name="lets-icons:folder-alt"
        title="文件"
      />
      <ToolbarButton
        @click="clickHandle('code')"
        icon-name="mdi:code-json"
        title="代码块"
      />
    </div>
    <div class="divider"></div>

    <div class="toolbar-group">
      <ToolbarButton
        @click="clickHandle('save')"
        icon-name="lets-icons:save"
        title="保存 (Ctrl+S)"
      />
    </div>

    <div class="toolbar-group right">
      <ToolbarButton
        @click="clickHandle('toggle-preview')"
        icon-name="lets-icons:eye-duotone"
        title="预览"
      />

      <ToolbarButton
        @click="clickHandle('sync Scroll')"
        icon-name="mdi:sync"
        title="同步滚动"
      />

      <ToolbarButton
        @click="clickHandle('toggle-html')"
        icon-name="mdi:code-tags"
        title="切换 HTML"
      />

      <ToolbarButton
        @click="clickHandle('toggle-fullscreen')"
        icon-name="lets-icons:full-alt-light"
        title="全屏"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ToolbarButton from "./ToolbarButton.vue";
import implement from "./utils/implement";

const props = defineProps<{
  markdownEditorRef: any;
  useEditorOption: any;
}>();
const markdownInput = inject("markdownInput");

const clickHandle = (mark: any, ...arg) => {
  implement(props, markdownInput)[mark](...arg);
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

.diySelect {
  p {
    cursor: pointer;
    padding: 5px 12px;
    margin: 0;
    border-radius: 5px;
    user-select: none;
    &:hover {
      background-color: #e2e8f0;
    }
  }
}
</style>
