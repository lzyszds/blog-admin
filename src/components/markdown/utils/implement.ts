import { useEditorStore } from "@/store/useEditorStore";
import insertTextAtCursor from "insert-text-at-cursor";

interface result {
  name: string,
  icon?: string,
  iconSize?: string,
  tip?: string,
  action?: (text?: string) => void
}

interface CustomToolbar extends result {
  menus?: result[]
}

interface CustomToolbar extends result {
  menus?: result[]
}
interface RightToolbar extends result {
  active: Ref<boolean>
  menus?: result[]
}


interface BtnConfig {
  leftBtnConfig: CustomToolbar[],
  rightBtnConfig: RightToolbar[],
}


interface Editor {
  ref: Ref<HTMLTextAreaElement>
  value: Ref<string>
  option: any,
  updateHistoryRange: any, // 更新历史记录范围
  updateCurrentHistoryRange: any, // 更新当前历史记录范围
  saveForm: () => {}  // 保存草稿
}




export default (editor: Editor): BtnConfig => {

  /* 文本框v-model值 */
  const input = editor.value

  const dom = editor.ref

  const editorStore = useEditorStore()
  const { setFullscreen, togglePreviewOnly, toggleShowHtml, toggleSyncScroll } = editorStore

  /* 插入标记文本 */
  const insetTagText = (openTag, closeTag, defaultText, notSelected?) => {
    const start = dom.value.selectionStart;
    const end = dom.value.selectionEnd;
    const selectedText = input.value.substring(start, end);

    if (selectedText) {
      const formattedText = `${openTag}${selectedText}${closeTag}`;
      const beforeText = input.value.substring(0, start);
      const afterText = input.value.substring(end);

      // 更新内容
      input.value = beforeText + formattedText + afterText;

      // 使用 setTimeout 来确保选择范围更新 必须要先获取焦点
      setTimeout(() => {
        dom.value.focus();
        if (notSelected) return
        dom.value.setSelectionRange(start + openTag.length, end + openTag.length);
      }, 0);
    } else {
      const cursorPos = start;
      const insertText = `${openTag}${defaultText}${closeTag}`;
      input.value = input.value.substring(0, cursorPos) + insertText + input.value.substring(cursorPos);
      setTimeout(() => {
        dom.value.focus();
        if (notSelected) return
        dom.value.setSelectionRange(cursorPos + openTag.length, cursorPos + openTag.length + (defaultText || '文本').length);
      }, 0);
    }
  }


  /* 同步滚动事件 */
  const srcollHanlde = () => {
    const previewDomArr = document.querySelectorAll('.preview-pane')
    previewDomArr.forEach(item => {
      if (item.scrollHeight != 0) {
        /* 获取编辑器滚动条所在位置的比例 */
        const account = dom.value.scrollTop / (dom.value.scrollHeight - dom.value.clientHeight)
        item.scrollTop = account * (item.scrollHeight - item.clientHeight)
      }
    })
  }
  nextTick(() => {
    dom.value.addEventListener('scroll', srcollHanlde)
  })

  /* 监听全屏事件 */
  const exit = (event) => {
    if (event.key === 'Escape') {
      setFullscreen(false)
      document.removeEventListener('keydown', exit);
    }
  };


  return {
    leftBtnConfig: [
      {
        name: "back",
        icon: "lets-icons:back",
        tip: "撤销 (Ctrl+Z)",
        action: () => {
          editor.option.undo()
        }
      },
      {
        name: "return",
        icon: "lets-icons:return",
        tip: "重做 (Ctrl+Y)",
        action: () => {
          editor.option.redo()
        }
      },
      {
        name: 'clear',
        icon: "lets-icons:del-alt-duotone-line",
        tip: "清空文本",
        action: () => {
          editor.value.value = ""
        }
      },
      { name: 'hr' },
      {
        name: "title",
        icon: "mdi:format-header-1",
        tip: "标题",
        menus: [
          { name: "一级标题", icon: "material-symbols:format-h1", action: () => insetTagText("# ", "", "一级标题") },
          { name: "二级标题", icon: "material-symbols:format-h2", action: () => insetTagText("## ", "", "二级标题") },
          { name: "三级标题", icon: "material-symbols:format-h3", action: () => insetTagText("### ", "", "三级标题") },
          { name: "四级标题", icon: "material-symbols:format-h4", action: () => insetTagText("#### ", "", "四级标题") },
          { name: "五级标题", icon: "material-symbols:format-h5", action: () => insetTagText("##### ", "", "五级标题") },
        ],
      },
      {
        name: "bold",
        icon: "material-symbols:format-bold-rounded",
        tip: "加粗 (Ctrl+B)",
        action: () => {
          insetTagText("**", "**", "加粗文本")
        }
      },
      {
        name: "italic",
        icon: "fluent:text-italic-16-filled",
        tip: "斜体 (Ctrl+I)",
        action: () => {
          insetTagText('_', '_', '斜体')
        }
      },
      {
        name: "quote",
        icon: "mdi:comment-quote-outline",
        tip: "引用 (Ctrl+Q)",
        action: () => {
          insetTagText("> ", "", "引用文本")
        }
      },
      {
        name: "strikethrough",
        icon: "clarity:strikethrough-line",
        tip: "删除线 (Ctrl+D)",
        action: () => {
          insetTagText("~~", "~~", "删除线文本")
        }
      },
      { name: 'hr' },
      {
        name: "disorder",
        icon: "mdi:format-list-bulleted",
        tip: "无序列表 (Ctrl+U)",
        action: () => {
          insetTagText("- ", "", "无序列表项");
        }
      },
      {
        name: "order",
        icon: "mdi:format-list-numbered",
        tip: "有序列表 (Ctrl+O)",
        action: () => {
          insetTagText("1. ", "", "有序列表项");
        }
      },
      {
        name: "table",
        icon: "mdi:table-large",
        tip: "表格 (Ctrl+T)",
        action: () => {
          insetTagText("| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容1 | 内容2 | 内容3 |", "", "");
        }
      },
      {
        name: "hr",
        icon: "mdi:minus-box-multiple-outline",
        tip: "分割线 (Ctrl+H)",
        action: () => {
          //分割线
          insetTagText("\n------------------------------------\n", "", "", true);
        }
      },
      {
        name: "fold",
        icon: "mdi:format-align-middle",
        tip: "折叠 (Ctrl+F)",
        action: () => {
          insetTagText("::: fold ", "\n\n隐藏内容\n:::", "折叠标题")
        }
      },
      {
        name: "tip",
        icon: "mdi:tooltip-question-outline",
        tip: "提示",
        menus: [
          {
            name: "Info", icon: "mdi:information-outline", action: (text) => {
              insetTagText("::: info ", "\n\n" + text + "\n:::", text)
            }
          },
          {
            name: "Tip", icon: "mdi:lightbulb-on-outline", action: (text) => {
              insetTagText("::: tip ", "\n\n" + text + "\n:::", text)
            }
          },
        ],
      },
      { name: 'hr' },
      {
        name: "link",
        icon: "lets-icons:link",
        tip: "链接 (Ctrl+L)",
        action: () => {
          insetTagText("[", `](http://)`, "链接文本")
        }
      },
      {
        name: "image",
        icon: "lets-icons:img-box",
        iconSize: "18",
        tip: "图片 (Ctrl+G)",
        menus: [
          { name: "上传图片", action: () => { } },
          {
            name: "添加图片链接", action: () => {
              insetTagText("![", `](http://)`, "图片描述")
            }
          },
        ],
      },
      {
        name: "file",
        icon: "lets-icons:folder-alt",
        tip: "文件 (Ctrl+F)",
        action: () => {
          insetTagText("[", `](http://)`, "文件描述");
        }
      },
      {
        name: "code",
        icon: "mdi:code-json",
        tip: "代码块",
        action: () => {
          insetTagText("```", "\n```\n", "language");
        }
      },
      {
        name: "save",
        icon: "lets-icons:save",
        tip: "保存",
        action: editor.saveForm
      },
      { name: 'hr' },
    ],
    rightBtnConfig: [
      {
        name: "toggle-preview",
        icon: "lets-icons:eye-duotone",
        tip: "切换预览",
        active: computed(() => editorStore.previewOnly),
        action: togglePreviewOnly
      },
      {
        name: "viewHtml",
        icon: "mdi:code-tags",
        tip: "切换 HTML",
        active: computed(() => editorStore.showHtml),
        action: toggleShowHtml
      },
      {
        name: "sync",
        icon: "mdi:sync",
        tip: "同步滚动",
        active: computed(() => editorStore.syncScroll),
        action: () => {

          toggleSyncScroll()

          /* 监听编辑器滚动事件 */
          if (editorStore.syncScroll) {
            dom.value.addEventListener('scroll', srcollHanlde)
          } else {
            dom.value.removeEventListener('scroll', srcollHanlde)
          }
        }
      },

      {
        name: "fullscreen",
        icon: "lets-icons:full-alt-light",
        tip: "全屏",
        active: computed(() => editorStore.isFullscreen),
        action: () => {
          setFullscreen(!editorStore.isFullscreen)
          if (editorStore.isFullscreen) {
            // 注册一次 `Escape` 退出事件
            document.addEventListener('keydown', exit);
          } else {
            // 退出全屏时，确保事件已被移除
            document.removeEventListener('keydown', exit);
          }
        }
      },
    ]
  }
}



