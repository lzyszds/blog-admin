
/* Froala Editor 富文本编辑器 插件 */
//Import Froala Editor 
import 'froala-editor/js/plugins.pkgd.min.js';
//Import third party plugins
import 'froala-editor/js/third_party/embedly.min';
import 'froala-editor/js/third_party/font_awesome.min';
import 'froala-editor/js/third_party/spell_checker.min';
import 'froala-editor/js/third_party/image_tui.min';

// Import Froala Editor css files.
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import '@/style/essay.css';
import 'froala-editor/js/languages/zh_cn.js';
import 'highlight.js/styles/github-dark-dimmed.css'

import VueFroala from 'vue-froala-wysiwyg';
import Prism from 'prismjs';


export const editorConfig = {
  language: "zh_cn",
  placeholderText: "开始编辑...",
  events: {
    'initialized': function () {

      //@ts-ignore
      this.$el.find('pre').each((index, element) => {
        Prism.highlightAll();
      });
    },
    'contentChanged': function () {
      // @ts-ignore 每次内容发生变化时重新应用代码高亮
      Prism.highlightAll();
    }
  },
  toolbarButtons: {
    // 文本格式化选项
    moreText: {
      buttons: [
        'bold',                // 粗体
        'italic',              // 斜体
        'underline',           // 下划线
        'strikeThrough',       // 删除线
        'subscript',           // 下标
        'superscript',         // 上标
        'fontFamily',          // 字体
        'fontSize',            // 字号
        'textColor',           // 文字颜色
        'backgroundColor',     // 背景颜色
        'inlineClass',         // 内联类
        'inlineStyle',         // 内联样式
        'clearFormatting'      // 清除格式
      ]
    },
    // 段落格式化选项
    moreParagraph: {
      buttons: [
        'alignLeft',           // 左对齐
        'alignCenter',         // 居中对齐
        'alignRight',          // 右对齐
        'alignJustify',        // 两端对齐
        'formatOL',            // 有序列表
        'formatUL',            // 无序列表
        'paragraphFormat',     // 段落格式
        'paragraphStyle',      // 段落样式
        'lineHeight',          // 行高
        'outdent',             // 减少缩进
        'indent',              // 增加缩进
        'quote'                // 引用
      ]
    },
    // 富媒体插入选项
    moreRich: {
      buttons: [
        'codeView',
        'codeBlock',
        'insertLink',          // 插入链接
        'insertImage',         // 插入图片
        'insertVideo',         // 插入视频
        'insertTable',         // 插入表格
        'emoticons',           // 表情符号
        'fontAwesome',         // Font Awesome 图标
        'specialCharacters',   // 特殊字符
        'embedly',             // Embedly 嵌入
        'insertFile',          // 插入文件
        'insertHR',             // 插入水平线
        'markdown',            //  Markdown

      ]
    },
    // 其他杂项选项
    moreMisc: {
      buttons: [
        'undo',                // 撤销
        'redo',                // 重做
        'fullscreen',          // 全屏
        'print',               // 打印
        'getPDF',              // 获取PDF
        'spellChecker',        // 拼写检查
        'selectAll',           // 全选
        'html',                // HTML代码
        'help'                 // 帮助
      ],
      align: 'right',          // 对齐方式：右对齐
      buttonsVisible: 2        // 可见按钮数：2个
    }
  },
  htmlAllowedTags: ['.*'],
  htmlAllowedAttrs: ['.*'],
  
};
export const setupMarkDown = (app) => {
  app.use(VueFroala)
}