import insertTextAtCursor from "insert-text-at-cursor";



export default ({ markdownEditorRef, useEditorOption }, markdownInput) => {
  console.log(markdownEditorRef, useEditorOption);


  return {
    "back": () => {
      useEditorOption.undo()
    },
    "return": () => {
      useEditorOption.redo()
    },
    "clear": () => {
      markdownEditorRef.value = ""
    },

    "title": (text) => {
      insertTextAtCursor(markdownEditorRef, text + " ")
    },
    "bold": () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString();

      if (selectedText) {
        const boldText = `**${selectedText}**`;
        const cursorPosition = markdownEditorRef.selectionStart;

        const beforeText = markdownEditorRef.value.substring(0, cursorPosition);
        const afterText = markdownEditorRef.value.substring(markdownEditorRef.selectionEnd);


        // 更新内容
        markdownInput.value = beforeText + boldText + afterText;

        setTimeout(() => {
          markdownEditorRef.setSelectionRange(cursorPosition + 2, cursorPosition + 2 + selectedText.length)
        }, 50)
      } else {
        insertTextAtCursor(markdownEditorRef, "** **")
        setTimeout(() => {
          markdownEditorRef.setSelectionRange(2, 2)
        }, 50)
      }
    },
    "italic": () => { },
    "quote": () => { },
    "strikethrough": () => { },

    "disorder": () => { },
    "order": () => { },
    "table": () => { },
    "hr": () => { },
    "fold": () => { },

    "link": () => { },
    "image": () => { },
    "file": () => { },
    "code": () => { },

    "save": () => { },

    "toggle-preview": () => { },
    "sync Scroll": () => { },
    "toggle-html": () => { },
    "toggle-fullscreen": () => { },
  }
}

