
/**  
 *  纯粹用来处理编辑器的撤回跟重做问题
 *  
 */
export const useEditor = (markdownInput) => {
  const markdownEditorRef = ref<HTMLTextAreaElement | null>(null)
  let timmer: number | null = null;
  const triggerInputBySetHistory = ref(false);

  let historyStack: { value: string; range: { start: number; end: number } }[] = [];
  let historyIndex = 0;



  function saveHistory() {

    const range = getRange();
    const history = {
      value: markdownInput.value,
      range,
    };

    historyStack = historyStack.slice(0, historyIndex + 1);
    historyStack.push(history);
    if (historyStack.length > 30) historyStack.shift();
    historyIndex = historyStack.length - 1;
  }

  function updateHistory(
    index: number,
    data: Partial<{ value: string; range: { start: number; end: number } }>
  ) {
    const history = historyStack[index];
    if ("value" in data) history.value = data.value!;
    Object.assign(history.range, data.range);
  }
  function goHistory(index: number) {
    const { value, range } = historyStack[index];
    markdownInput.value = value;
    triggerInputBySetHistory.value = true;

    nextTick(() => {
      triggerInputBySetHistory.value = false;
      setRange(range);
    });
  }

  function getRange() {
    return {
      start: markdownEditorRef.value?.selectionStart ?? 0,
      end: markdownEditorRef.value?.selectionEnd ?? 0,
    };
  }

  function setRange({ start, end }: { start: number; end: number }) {
    markdownEditorRef.value?.setSelectionRange(start, end);
    updateCurrentHistoryRange();
  }

  function focus() {
    markdownEditorRef.value?.focus();
  }

  // function insertText(text: string) {
  //   if (markdownEditorRef.value) {
  //     insertTextAtCursor(markdownEditorRef.value, text);
  //   }
  // }

  function undo() {
    if (historyIndex > 0) {
      historyIndex--;
      goHistory(historyIndex);
    }
  }

  function redo() {
    if (historyIndex < historyStack.length - 1) {
      historyIndex++;
      goHistory(historyIndex);
    }
  }

  function updateCurrentHistoryRange() {
    if (!timmer) {
      updateHistory(historyIndex, {
        range: getRange(),
      });
    }
  }


  function clearTimeout() {
    if (timmer) window.clearTimeout(timmer);
    timmer = null;
  }

  watch(
    () => markdownInput.value,
    () => {
      clearTimeout();
      if (!triggerInputBySetHistory.value) {
        timmer = window.setTimeout(() => {
          saveHistory();
          clearTimeout();
        }, 400);
      }
    }
  );

  return {
    markdownEditorRef,
    markdownInput,
    saveHistory,
    updateHistory,
    goHistory,
    getRange,
    setRange,
    focus,
    // insertText,
    undo,
    redo,
    updateCurrentHistoryRange,
    historyStack,
    historyIndex,
    triggerInputBySetHistory,
    clearTimeout,
  };

}