
export const insertText = (text) => {
  const textarea = document.querySelector(".editor-textarea") as HTMLTextAreaElement;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;


  // 插入文本
  const content = textarea.innerText;
  textarea.innerText = content.substring(0, start) + text + content.substring(end);

  // 设置光标位置
  textarea.focus();
  textarea.selectionStart = textarea.selectionEnd = start + text.length;
};
