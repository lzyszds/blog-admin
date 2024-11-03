<script setup lang="ts">
import BScroll from "@better-scroll/core";
import { useTabsState } from "@/store/useTabsState";
const tabsState = useTabsState();

const wrapperRef = templateRef("wrapperRef");
const contentRef = templateRef("contentRef");
let bs: any = null;

const initScroll = async () => {
  // 等待DOM更新
  await nextTick();
  if (bs) {
    bs.destroy();
  }
  const children = contentRef.value!.firstChild!.parentElement!.children as any;
  // 计算内容总宽度
  let totalWidth = 0;
  for (let child of children!) {
    totalWidth += child.offsetWidth;
  }
  const contentEl = wrapperRef.value.querySelector(".scroll-content") as HTMLElement;
  contentEl!.style.width = `${totalWidth}px`;

  bs = new BScroll(wrapperRef.value, {
    scrollX: true,
    scrollY: false,
    momentum: true,
  });
  bs.refresh();
};

// 监听 items 的变化
watch(
  () => tabsState.tabsKeyArr,
  () => {
    setTimeout(() => {
      initScroll();
    }, 500);
  },
  { deep: true, immediate: true }
);

onBeforeUnmount(() => {
  if (bs) {
    bs.destroy();
  }
});

// 对外暴露刷新方法
const refresh = () => {
  bs?.refresh();
};

defineExpose({
  refresh,
});
</script>

<template>
  <div class="scroll-wrapper" ref="wrapperRef">
    <div class="scroll-content" ref="contentRef">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.scroll-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.scroll-content {
  display: inline-flex; /* 改为 inline-flex */
  height: 100%;
  /* 移除 position: absolute */
}

.scroll-item {
  flex: 0 0 120px;
  height: 120px;
  margin: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
}

.scroll-item:hover {
  transform: translateY(-2px);
}
</style>
