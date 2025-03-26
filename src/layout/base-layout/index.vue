<script setup lang="ts">
import { useTabsState } from "@/store/useTabsStore"; // 导入用于管理标签页状态的 store
import routeItem from "@/router/config";
import SidebarMenu from "@/layout/context/SidebarMenu.vue"; // 导入侧边菜单组件
import HeaderComponent from "@/layout/context/HeaderComponent.vue"; // 导入头部组件
import ContentArea from "@/layout/context/ContentArea.vue";
import CacheNavigation from "@/layout/context/CacheNavigation.vue"; // 导入内容区域组件
import { message } from "ant-design-vue";

// 定义 layout 引用，用于获取布局元素
const layout = ref<HTMLElement | null>(null);
// 定义 collapsed 状态，表示菜单是否折叠
const collapsed = ref(false);
// 定义 isFixed 状态，表示菜单是否固定
const isFixed = ref(false);
// 使用 localStorage 存储当前选中的菜单项
const selected = useStorage("selected", routeItem[0]);
// 存储当前选中菜单项的键
const selectedKeys = ref<number[]>([selected.value && selected.value.meta.key]);
const router = useRouter(); // 获取 Vue Router 实例
const tabsState = useTabsState(); // 获取标签页状态
const refreshKey = ref(0); // 刷新键，用于触发内容区域的刷新

const lastSwitchTime = ref(0); // 记录上一次切换的时间
const minInterval = 600; // 最小切换间隔（毫秒）
let timer ; // 定时器
// 带防抖和提醒的 pushRouter
const pushRouter = (item) => {
  const currentTime = Date.now();
  const timeDiff = currentTime - lastSwitchTime.value;

  // 检查切换间隔是否太短
  if (timeDiff < minInterval) {
    message.warning("请勿频繁切换页面，请稍后再试！"); // 显示提醒

    if(timer) clearTimeout(timer); // 清除定时器
    timer = setTimeout(() => {
      selectedKeys.value = [router.currentRoute.value.meta.key as number]; // 更新选中键
    }, 200);

    return; // 阻止本次跳转
  }

  // 如果 item 是数字，则获取对应的菜单项
  if (typeof item === "number") {
    item = tabsState.getKeyArr(item);
  }

  if (router.hasRoute(item.name)) {
    router.push({ name: item.name });
    lastSwitchTime.value = currentTime; // 更新切换时间
  } else {
    console.error("Invalid route name:", item.name);
    router.push({ name: "NotFound" });
    lastSwitchTime.value = currentTime; // 更新切换时间
  }

  selectedKeys.value = [item.meta.key];
  selected.value = item;
  tabsState.setKeyArr(item);
}; // 防抖延迟 300ms

// 处理响应式布局断点
const handleBreakpoint = (broken) => {
  isFixed.value = broken; // 更新 isFixed 状态
};

// 组件挂载后执行
onMounted(() => {
  const { width } = useElementSize(layout); // 获取布局元素的宽度
  watchEffect(() => {
    if (width.value === 0) return; // 如果宽度为 0，直接返回
    collapsed.value = width.value < 768; // 根据宽度判断是否折叠菜单
  });
});

// 监听路由变化，更新选中的菜单项
watchEffect(() => {
  selected.value = routeItem.find((item) => item.name == router.currentRoute.value.name); // 查找当前路由对应的菜单项
  if (selected.value) selectedKeys.value = [selected.value?.meta.key];
  // 更新选中键
  else selectedKeys.value = []; // 如果没有选中项，则清空选中键
});

// 提供上下文参数，以供子组件使用
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
    <!-- 菜单遮罩层 -->
    <div
      :class="{ show: isFixed && !collapsed, mask: true }"
      @click="collapsed = true"
    ></div>

    <!-- 侧边菜单组件 -->
    <SidebarMenu @breakpoint="handleBreakpoint" @push-router="pushRouter" />

    <ALayout>
      <!-- 头部组件 -->
      <HeaderComponent />

      <!-- 历史缓存导航组件 -->
      <CacheNavigation @push-router="pushRouter" />

      <!-- 内容区域组件 -->
      <ContentArea @push-router="pushRouter" />
    </ALayout>
  </ALayout>
</template>

<style scoped>
:where(.css-dev-only-do-not-override-17yhhjv).ant-layout {
  background-color: rgb(247 250 252); /* 设置布局的背景色 */
}

.mask {
  display: none; /* 默认不显示遮罩层 */
  position: fixed; /* 固定定位 */
  top: 0;
  left: 0;
  z-index: 1; /* 确保遮罩层在最上层 */
  background-color: rgba(0, 0, 0, 0.25); /* 半透明背景 */
  width: 100vw; /* 全屏宽度 */
  height: 100vh; /* 全屏高度 */
}

.show.mask {
  display: block; /* 显示遮罩层 */
}

.fixed {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
}
</style>
