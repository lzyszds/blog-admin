<script setup lang="ts">
//@ts-ignore
import {ClassicEditor} from 'ckeditor5';
import {Ckeditor} from '@ckeditor/ckeditor5-vue';
import 'ckeditor5/ckeditor5.css';
import {editorConfig} from './ckeditor';
import Resources from '@/views/root/Resources.vue';

import('shiki/themes/one-dark-pro.mjs');

const infoCard: any = inject('infoCard');

// Markdown输入内容的模型定义
const editorData = defineModel({
  type: String,
  default: '',
});

const editor = ClassicEditor;

// const { saveForm } = defineProps(["saveForm"]);

/**
 * 资源弹窗
 * @param {boolean} modal - 是否显示资源弹窗
 * @param {string} selectImage - 选中的图片地址
 * @param {string} confirmImage - 确认选择后的图片地址（以这个来进行添加）
 */
const resource = useSessionStorage<{
  modal: boolean;
  selectImage: string;
  confirmImage: string;
}>('resourceModal', {modal: false, selectImage: '', confirmImage: ''});
//避免刷新页面后，因缓存导致的资源弹窗还在显示
resource.value.modal = false;

//确认选中图片
const confirm = () => {
  resource.value.confirmImage = resource.value.selectImage;
  resource.value.modal = false;
};
// 获取左侧文章主题的宽度
const {width} = useElementSize(infoCard);
// 编辑器即将计算的宽度
const editorSizeWidth = ref(width.value + 30);
// 窗口宽度
const {width: windWidth} = useWindowSize();
// 根据窗口宽度动态计算编辑器宽度
watchEffect(() => {
  if (windWidth.value <= 768) {
    editorSizeWidth.value = -25;
  } else {
    editorSizeWidth.value = -(width.value + 30);
  }
});

onBeforeUnmount(() => {
  resource.value = {modal: false, selectImage: '', confirmImage: ''};
});
</script>

<template>
  <div
      class="markdown-editor"
      id="markdown-editor"
      :style="{
      width: `calc(100vw + ${editorSizeWidth}px)`,
    }"
  >
    <AModal v-model:open="resource.modal" width="100%" wrap-class-name="resource-modal">
      <Resources
          type="blog"
          :is-selector="true"
          @select="(val) => (resource.selectImage = val)"
      />
      <template #footer>
        <div class="resource-footer">
          <a-button @click="resource.modal = false">取消</a-button>
          <a-button type="primary" @click="confirm">确定</a-button>
        </div>
      </template>
    </AModal>
    <Ckeditor v-model="editorData" :editor="editor" :config="editorConfig"/>
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
    &:not(.ck-reset_all) {
      background-color: var(--color-bg);
      color: var(--color-text);
    }

    .ck-sticky-panel__content {
      border: none;

      .ck-button:not(.ck-insert-table-dropdown-grid-box):focus,
      .ck-button:not(.ck-insert-table-dropdown-grid-box):active {
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
      overflow: auto;
      height: calc(100vh - 65px - 50px - 70px);
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

      p {
        white-space: normal;
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

    &.ck-image-insert-form {
      border-radius: 10px;
    }

    .ck-splitbutton__arrow::after {
      display: none;
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

  .ck-toolbar__items, .ck-list-styles-list, .ck-list-properties {
    border-radius: 0.5rem;

    button {
      border-radius: 0.5rem;
    }
  }

  button.ck-insert-table-dropdown-grid-box {
    border-radius: 3px !important;
    border-color: var(--themeColor);

    &.ck-on {
      background: rgba(var(--themeColorRgb), 0.3);
    }
  }
}
</style>
