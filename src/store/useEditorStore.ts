import { defineStore } from 'pinia';

export const useEditorStore = defineStore('editor', () => {

  // 控制是否全屏的响应式变量
  const isFullscreen = ref(false);
  // 控制是否只显示预览的响应式变量
  const previewOnly = ref(true);
  /* 控制是否显示Html 代码预览 */
  const showHtml = ref(false);
  //控制是否开启同步滚动
  const syncScroll = ref(true);


  const setFullscreen = (value) => {
    isFullscreen.value = value
  }

  const togglePreviewOnly = () => {
    previewOnly.value = !previewOnly.value
    showHtml.value = !previewOnly.value
  }

  const toggleShowHtml = () => {
    showHtml.value = !showHtml.value;
    previewOnly.value = !showHtml.value
  }

  const toggleSyncScroll = () => {
    syncScroll.value = !syncScroll.value
  }


  return {
    isFullscreen,
    previewOnly,
    showHtml,
    syncScroll,
    setFullscreen,
    togglePreviewOnly,
    toggleShowHtml,
    toggleSyncScroll,
  }
})