import {
  Autoformat,
  SimpleUploadAdapter,
  BlockQuote,
  Bold,
  CloudServices,
  Code,
  CodeBlock,
  Essentials,
  Font,
  Heading,
  HorizontalLine,
  ImageBlock,
  ImageCaption,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Italic,
  Link,
  List,
  Markdown,
  Mention,
  Paragraph,
  ShowBlocks,
  SourceEditing,
  Strikethrough,
  Table,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
} from "ckeditor5";
import coreTranslations from "ckeditor5/translations/zh-cn.js";
import premiumFeaturesTranslations from "ckeditor5-premium-features/translations/zh-cn.js";

import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";


export const editorConfig: any = {
  translations: [coreTranslations, premiumFeaturesTranslations],
  plugins: [
    SimpleUploadAdapter,//上传图片
    Autoformat, // 自动格式化
    BlockQuote, // 引用
    Bold, // 加粗
    CloudServices, // 云服务
    Code, // 代码
    Font, // 字体
    CodeBlock, // 代码块
    Essentials, // 基础
    Heading, // 标题
    HorizontalLine, // 水平线
    Image, // 图片
    ImageToolbar, // 图片工具栏
    ImageUpload, // 图片上传
    ImageInsertViaUrl,//图片插入链接
    ImageBlock,
    ImageCaption,
    ImageInsert,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    // Base64UploadAdapter, // 图片上传
    Italic, // 斜体
    Link, // 链接
    List, // 列表
    Markdown, // Markdown
    Mention, // 提及
    Paragraph, // 段落
    Table, // 表格
    TableToolbar, // 表格工具栏
    TextTransformation, // 文本转换
    TodoList, // 待办事项
    SourceEditing, // 源码编辑
    ShowBlocks, // 显示html代码
    Strikethrough, // 删除线
    Underline, // 下划线
  ],
  language: "zh-cn",
  toolbar: [
    "undo",
    "redo",
    "|",
    "sourceEditing",
    "showBlocks",
    "|",
    "heading",
    "|",
    {
      label: "Basic styles",
      icon: "text",
      items: [
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "code",
        "|",
        "textPartLanguage",
      ],
    },
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "bulletedList",
    "numberedList",
    "todoList",
    "|",
    "link",
    'insertImage',
    "insertTable",
    "blockQuote",
    "codeBlock",
    "horizontalLine",
    "specialCharacters",
  ],
  codeBlock: {
    languages: [
      { language: "html", label: "html" },
      { language: "css", label: "css" },
      { language: "js", label: "js" },
      { language: "jsx", label: "jsx" },
      { language: "ts", label: "ts" },
      { language: "tsx", label: "tsx" },
      { language: "vue", label: "vue" },
      { language: "json", label: "json" },
      { language: "sh", label: "sh" },
      { language: "nginx", label: "nginx" },
      { language: "xml", label: "xml" },
      { language: "markdown", label: "markdown" },
      { language: "yaml", label: "yaml" },
    ],
  },
  heading: {
    options: [
      {
        model: "paragraph",
        title: "原文",
        class: "ck-heading_paragraph",
      },
      {
        model: "heading1",
        view: "h1",
        title: "一级标题",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2",
        view: "h2",
        title: "二级标题",
        class: "ck-heading_heading2",
      },
      {
        model: "heading3",
        view: "h3",
        title: "三级标题",
        class: "ck-heading_heading3",
      },
      {
        model: "heading4",
        view: "h4",
        title: "四级标题",
        class: "ck-heading_heading4",
      },
      {
        model: "heading5",
        view: "h5",
        title: "五级标题",
        class: "ck-heading_heading5",
      },
      {
        model: "heading6",
        view: "h6",
        title: "六级标题",
        class: "ck-heading_heading6",
      },
    ],
  },
  image: {
    toolbar: [
      'toggleImageCaption',
      'imageTextAlternative',
      '|',
      'imageStyle:alignBlockLeft',
      'imageStyle:block',
      'imageStyle:alignBlockRight',
      '|',
      'resizeImage'
    ],
    styles: {
      options: ['alignBlockLeft', 'block', 'alignBlockRight']
    }
  },

  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },

  simpleUpload: {
    // The URL that the images are uploaded to.
    uploadUrl: import.meta.env.VITE_BASE_URL + '/api/toolkit/uploadImageToPictureBed',

    // Enable the XMLHttpRequest.withCredentials property.
    withCredentials: true,
  }

};
