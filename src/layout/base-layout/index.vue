<script setup lang="ts">
import { useTabsState } from "@/store/useTabsState";
import items from "@/layout/config";
import SidebarMenu from "@/layout/context/SidebarMenu.vue";
import HeaderComponent from "@/layout/context/HeaderComponent.vue";
import ContentArea from "@/layout/context/ContentArea.vue";

const layout = ref<HTMLElement | null>(null);
const collapsed = ref(false);
const isFixed = ref(false);
const selected = useStorage("selected", items[0]);
const selectedKeys = ref<number[]>([selected.value && selected.value.key]); // 选中的菜单
const router = useRouter();
const tabsState = useTabsState();
const refreshKey = ref(0);

const pushRouter = (item) => {
  if (typeof item == "number") {
    item = tabsState.getKeyArr(item);
  }
  selectedKeys.value = [item.key];
  selected.value = item;
  tabsState.setKeyArr(item);

  /* 实现脱离动画 */
  setTimeout(() => {
    router.push({ name: item.component });
  }, 300);
};

const handleBreakpoint = (broken) => {
  isFixed.value = broken;
};

onMounted(() => {
  const { width } = useElementSize(layout);
  watchEffect(() => {
    if (width.value === 0) return;
    collapsed.value = width.value < 768;
  });
});

watchEffect(() => {
  selected.value = items.find((item) => item.component == router.currentRoute.value.name);
  if (selected.value) selectedKeys.value = [selected.value?.key];
  else selectedKeys.value = [];
});

provide("paramsRef", {
  layout,
  collapsed,
  isFixed,
  selected,
  selectedKeys,
  router,
  tabsState,
  refreshKey,
});
</script>

<template>
  <ALayout class="ant-layout" ref="layout">
    <!-- 菜单遮罩 -->
    <div
      :class="{ show: isFixed && !collapsed, mask: true }"
      @click="collapsed = true"
    ></div>

    <SidebarMenu @breakpoint="handleBreakpoint" @push-router="pushRouter" />

    <ALayout>
      <HeaderComponent />

      <ContentArea @push-router="pushRouter" />
    </ALayout>
  </ALayout>
</template>

<style scoped>
.ant-layout {
  min-height: 80vh;
  border-radius: 10px;
  overflow: hidden;
}
:where(.css-dev-only-do-not-override-17yhhjv).ant-layout {
  background-color: rgb(247 250 252);
}

.mask {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.25);
  width: 100vw;
  height: 100vh;
}
.show.mask {
  display: block;
}
</style>
