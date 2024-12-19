import {
  Alignment,
  AutoImage,
  AutoLink,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  Bold,
  CloudServices,
  Code,
  CodeBlock,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HorizontalLine,
  HtmlComment,
  HtmlEmbed,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  PageBreak,
  Paragraph,
  RemoveFormat,
  ShowBlocks,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Style,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TodoList,
  Underline,
  WordCount,
} from "ckeditor5";
import coreTranslations from "ckeditor5/translations/zh-cn.js";

import FileManagerDiy from "./FileManagerPlugin";

import "ckeditor5/ckeditor5.css";

export const editorConfig: any = {
  translations: [coreTranslations],
  plugins: [
    SourceEditing, // 编辑器源代码编辑
    Alignment, // 文本对齐：允许用户调整文本的对齐方式，如左对齐、居中对齐、右对齐和两端对齐。
    AutoImage, // 自动图片：自动将粘贴的图片 URL 转换为上传的图片（需要配置图片上传适配器）。
    AutoLink, // 自动链接：自动将粘贴的 URL 转换为可点击的链接。
    Autosave, // 自动保存：定期将编辑器内容自动保存到本地存储（localStorage）或其他后端存储，防止意外数据丢失。
    BalloonToolbar, // 浮动工具栏：当用户选择文本时，在选区上方显示一个包含常用格式选项的浮动工具栏。
    BlockQuote, // 块引用：允许用户创建和编辑块引用内容。
    Bold, // 加粗：允许用户将文本设置为粗体。
    CloudServices, // 云服务：提供 CKEditor 云服务集成，例如实时协作和拼写检查等功能（需要 CKEditor Cloud Services 账户）。
    Code, // 代码：允许用户将选定文本标记为行内代码样式。
    CodeBlock, // 代码块：允许用户插入和编辑多行代码块，并支持语法高亮（需要配置相应的语法高亮库）。
    Essentials, // 必需插件：这是一组 CKEditor 5 正常运行所必需的核心插件，通常不需要手动配置，除非进行非常底层的自定义构建。
    FindAndReplace, // 查找和替换：提供查找和替换编辑器内容的功能。
    FontBackgroundColor, // 字体背景颜色：允许用户更改文本的背景颜色。
    FontColor, // 字体颜色：允许用户更改文本的颜色。
    FontFamily, // 字体：允许用户更改文本的字体。
    FontSize, // 字体大小：允许用户更改文本的字体大小。
    GeneralHtmlSupport, // 通用 HTML 支持：允许编辑器处理和输出更广泛的 HTML 标签和属性，增强编辑器的灵活性和兼容性。
    Heading, // 标题：允许用户将文本设置为不同的标题级别（如 H1、H2、H3 等）。
    Highlight, // 高亮：允许用户使用不同的标记颜色高亮显示文本（例如，用作评论或注释）。
    HorizontalLine, // 水平线：允许用户插入水平分割线。
    HtmlComment, // HTML 注释：允许用户在编辑器内容中插入 HTML 注释。
    HtmlEmbed, // HTML 嵌入：允许用户插入原始 HTML 代码片段。
    ImageBlock, // 块状图片：将图片呈现为一个独立的块级元素。
    ImageCaption, // 图片标题：允许用户为图片添加标题。
    ImageInline, // 行内图片：将图片呈现为一个行内元素，可以与其他文本内容混合排列。
    ImageInsertViaUrl, // 通过 URL 插入图片：允许用户通过输入图片的 URL 地址来插入图片。
    ImageResize, // 图片缩放：允许用户调整图片的大小。
    ImageStyle, // 图片样式：提供不同的图片样式选项，如边框、阴影等。
    ImageTextAlternative, // 图片替代文本：允许用户为图片添加替代文本（alt 属性），用于无障碍访问和 SEO。
    ImageToolbar, // 图片工具栏：当用户选择图片时，显示一个包含图片相关操作的工具栏。
    ImageUpload, // 图片上传：允许用户将本地图片上传到服务器（需要配置图片上传适配器）。
    Indent, // 缩进：允许用户增加文本的缩进。
    IndentBlock, // 块级缩进：允许用户增加整个块级元素（如段落、列表项）的缩进。
    Italic, // 斜体：允许用户将文本设置为斜体。
    Link, // 链接：允许用户创建和编辑超链接。
    LinkImage, // 图片链接：允许用户将图片转换为链接。
    List, // 列表：允许用户创建和编辑无序列表和有序列表。
    ListProperties, // 列表属性：允许用户修改列表的属性，如编号类型（数字、字母等）和起始编号。
    PageBreak, // 分页符：允许用户插入分页符，用于打印时创建分页。
    Paragraph, // 段落：确保编辑器内容由段落元素包裹，提供基本的文本结构。
    RemoveFormat, // 清除格式：允许用户清除选定文本的格式。
    ShowBlocks, // 显示块级元素：在编辑器中可视化地显示块级元素的边界，方便用户理解文档结构。
    SpecialCharacters, // 特殊字符：允许用户插入特殊字符，如数学符号、箭头、货币符号等。
    SpecialCharactersArrows, // 特殊字符 - 箭头：提供插入各种箭头符号的功能。
    SpecialCharactersCurrency, // 特殊字符 - 货币：提供插入各种货币符号的功能。
    SpecialCharactersEssentials, // 特殊字符 - 基本符号：提供插入常用的特殊符号的功能。
    SpecialCharactersLatin, // 特殊字符 - 拉丁字母：提供插入带音标的拉丁字母的功能。
    SpecialCharactersMathematical, // 特殊字符 - 数学符号：提供插入数学符号的功能。
    SpecialCharactersText, // 特殊字符 - 文本符号：提供插入文本相关的特殊符号的功能，如版权符号、商标符号等。
    Strikethrough, // 删除线：允许用户为文本添加删除线。
    Style, // 样式：允许用户应用预定义的样式到选定内容，例如不同的文本外观或布局（需要预先定义样式规则）。
    Subscript, // 下标：允许用户将文本设置为下标。
    Superscript, // 上标：允许用户将文本设置为上标。
    Table, // 表格：允许用户插入和编辑表格。
    TableCaption, // 表格标题：允许用户为表格添加标题。
    TableCellProperties, // 表格单元格属性：允许用户修改表格单元格的属性，如背景颜色、边框样式、宽度、高度等。
    TableColumnResize, // 表格列宽调整：允许用户调整表格列的宽度。
    TableProperties, // 表格属性：允许用户修改表格的属性，如边框样式、宽度等。
    TableToolbar, // 表格工具栏：当用户选择表格或表格单元格时，显示一个包含表格相关操作的工具栏。
    TodoList, // 待办事项列表：允许用户创建和编辑待办事项列表（复选框列表）。
    Underline, // 下划线：允许用户为文本添加下划线。
    WordCount, // 字数统计：显示编辑器内容的字数和字符数。

    FileManagerDiy,
  ],
  toolbar: [
    "undo",
    "redo",
    "|",
    "sourceEditing",
    "showBlocks",
    "findAndReplace",
    "heading",
    "fontSize",
    "fontFamily",
    "fontColor",
    "fontBackgroundColor",
    "|",
    "bold",
    "italic",
    "underline",
    {
      label: "文字样式",
      icon: "text",
      items: [
        "strikethrough",
        "subscript",
        "superscript",
        "code",
        "removeFormat",
        "specialCharacters",
      ],
    },
    "|",
    "horizontalLine",
    "pageBreak",
    "link",
    "bookmark",
    "insertImageViaUrl",
    "fileManagerdiy",
    "insertTable",
    "highlight",
    "blockQuote",
    "codeBlock",
    "htmlEmbed",
    "|",
    "alignment",
    "|",
    "bulletedList",
    "numberedList",
    "todoList",
    "outdent",
    "indent",
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
  balloonToolbar: [
    "bold",
    "italic",
    "|",
    "link",
    "|",
    "bulletedList",
    "numberedList",
  ],
  fontFamily: {
    options: [
      "default",
      "HarmonyOS_Medium",
      "dindin",
      "Fira Code",
      "almama",
      "Ubuntu, Arial, sans-serif",
      "Ubuntu Mono, Courier New, Courier, monospace",
      "微软雅黑",
      "宋体",
      "楷体",
      "黑体",
    ],
  },
  fontSize: {
    options: [10, 12, 14, "default", 18, 20, 22],
    supportAllValues: true,
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
  htmlSupport: {
    allow: [
      {
        name: /^.*$/,
        styles: true,
        attributes: true,
        classes: true,
      },
    ],
  },
  image: {
    toolbar: [
      "toggleImageCaption",
      "imageTextAlternative",
      "|",
      "imageStyle:inline",
      "imageStyle:wrapText",
      "imageStyle:breakText",
      "|",
      "resizeImage",
    ],
  },
  language: "zh-cn",
  link: {
    addTargetToExternalLinks: true,
    defaultProtocol: "https://",
    decorators: {
      toggleDownloadable: {
        mode: "manual",
        label: "Downloadable",
        attributes: {
          download: "file",
        },
      },
    },
  },
  list: {
    properties: {
      styles: true,
      startIndex: true,
      reversed: true,
    },
  },
  menuBar: {
    isVisible: true,
  },

  placeholder: "在此处键入或粘贴您的内容！",

  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },

  simpleUpload: {
    // The URL that the images are uploaded to.
    uploadUrl:
      import.meta.env.VITE_BASE_URL + "/api/toolkit/uploadImageToPictureBed",

    // Enable the XMLHttpRequest.withCredentials property.
    withCredentials: true,
  },
};
