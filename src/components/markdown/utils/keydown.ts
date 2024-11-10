import insertTextAtCursor from "insert-text-at-cursor";
import useImplement from './implement';
const insertDiy = (textarea, text) => {
  // 在当前光标位置插入文本
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  // 更新 input 的值
  textarea.value =
    textarea.value.substring(0, start) + text + textarea.value.substring(end);

  // 更新光标位置
  nextTick(() => {
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
  });
}


export const handleKeyDown = (e, editor) => {

  const { leftBtnConfig, rightBtnConfig } = useImplement(editor);


  /* 加粗 */
  if (e.ctrlKey && e.key === "b") {
    const bold = leftBtnConfig.find(bar => bar.name === 'bold') as any;
    if (bold) bold.action()
  }

  /* 斜体 */
  if (e.ctrlKey && e.key === "i") {
    const italic = leftBtnConfig.find(bar => bar.name === 'italic') as any;
    if (italic) italic.action()
  }

  /* 引用 */
  if (e.ctrlKey && e.key === "q") {

    const quote = leftBtnConfig.find(bar => bar.name === 'quote') as any;
    if (quote) quote.action()
  }

  /* 删除线 */
  if (e.ctrlKey && e.key === "d") {
    e.preventDefault();
    const del = leftBtnConfig.find(bar => bar.name === 'strikethrough') as any;
    if (del) del.action()
  }

  /* 无序列表 */
  if (e.ctrlKey && e.key === "u") {
    e.preventDefault();
    const disorder = leftBtnConfig.find(bar => bar.name === 'disorder') as any;
    if (disorder) disorder.action()
  }

  /* 有序列表 */
  if (e.ctrlKey && e.key === "o") {
    e.preventDefault();
    const ordered = leftBtnConfig.find(bar => bar.name === 'order') as any;
    if (ordered) ordered.action()
  }

  /* 表格 */
  if (e.ctrlKey && e.key === "t") {
    e.preventDefault();
    const table = leftBtnConfig.find(bar => bar.name === 'table') as any;
    if (table) table.action()
  }

  /* 分割线 */
  if (e.ctrlKey && e.key === "h") {
    e.preventDefault();
    const hr = leftBtnConfig.find(bar => bar.name === 'hr') as any;
    if (hr) hr.action()
  }

  // console.log(e.ctrlKey, e.shiftKey, e.key === "f");


  /* 折叠 */
  if (e.ctrlKey && e.shiftKey && e.key === "f") {
    e.preventDefault();
    const fold = leftBtnConfig.find(bar => bar.name === 'fold') as any;
    if (fold) fold.action()
  }

  /* 链接 */
  if (e.ctrlKey && e.key === "l") {
    e.preventDefault();
    const link = leftBtnConfig.find(bar => bar.name === 'link') as any;
    if (link) link.action()
  }

  /* 图片 */
  if (e.ctrlKey && e.key === "g") {
    e.preventDefault();
    const image = leftBtnConfig.find(bar => bar.name === 'image') as any;
    if (image) image.menus[1].action()
  }

  /* 用于处理按下 Enter 键时自动补全无序和有序列表项的方法加进去 */
  if (e.key === "Enter") {
    // 检测是否按下 Enter 键
    // 获取 textarea 中当前光标位置和文本内容
    const textarea = e.target;
    const cursorPos = textarea.selectionStart;
    const text = textarea.value;

    // 获取光标所在行的文本内容
    const lineStart = text.lastIndexOf("\n", cursorPos - 1) + 1;
    const lineText = text.slice(lineStart, cursorPos);

    // 检测当前行是否为无序或有序列表项
    const unorderedListMatch = /^[-*+]\s/.test(lineText);
    const orderedListMatch = /^(\d+)\.\s/.test(lineText);

    if (unorderedListMatch) {
      // 无序列表：在光标位置插入新的无序列表项
      e.preventDefault();
      const insertText = "\n- ";
      insertDiy(textarea, insertText);
    } else if (orderedListMatch) {
      // 有序列表：在光标位置插入新的有序列表项，递增编号
      e.preventDefault();
      const match = lineText.match(/^(\d+)\./);
      const number = match ? parseInt(match[1], 10) + 1 : 1;
      const insertText = `\n${number}. `;
      insertDiy(textarea, insertText);
    }
  }
  /* 缩进 */
  if (e.key === "Tab") {
    e.preventDefault();
    insertTextAtCursor(e.target, "  ");
  }

  /* 保存草稿 */
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    const save = rightBtnConfig.find(bar => bar.name === 'save') as any;
    if (save) save.action()
  }


};