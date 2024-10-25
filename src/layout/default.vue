<script lang="ts" setup>
import LzyIcon from "@/components/LzyIcon.vue";
import items from "./config";
const selected = useStorage("selected", items[0]);
const selectedKeys = ref<string[]>([selected.value.index]); // 选中的菜单
const collapsed = ref<boolean>(false); // 是否折叠
const layout = templateRef<HTMLElement>("layout"); // 布局ref
const loading = ref(false); // 加载中新路由
const router = useRouter();

/* 跳转路由  */
const pushRouter = (item) => {
  selected.value = item;
  loading.value = true;
  /* 实现脱离动画 */
  setTimeout(() => {
    loading.value = false;
    router.push({ name: item.component });
  }, 300);
};
onMounted(() => {
  const { width } = useElementSize(layout);
  watchEffect(() => {
    if (width.value < 768) {
      collapsed.value = true;
    } else {
      collapsed.value = false;
    }
  });
});
</script>

<template>
  <a-layout class="ant-layout" ref="layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      style="background-color: #fff"
      collapsible
    >
      <div class="logo">
        <h2>{{ collapsed ? "Jz" : "Jz 博客管理系统" }}</h2>
      </div>

      <!-- 菜单 -->
      <a-menu v-model:selectedKeys="selectedKeys" mode="inline">
        <a-menu-item
          v-for="item in items"
          :key="item.index"
          @click="pushRouter(item)"
          class="menuitem"
        >
          <span class="anticon anticon-user">
            <LzyIcon :name="item.uicon" />
          </span>
          <span>{{ item.name }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <!-- 头部 -->
      <a-layout-header class="ant-layout-header">
        <!-- 折叠按钮 -->
        <a-tooltip placement="bottomLeft" mouseLeaveDelay="0">
          <template #title>
            <span>折叠菜单</span>
          </template>
          <button v-if="collapsed" @click="() => (collapsed = !collapsed)">
            <LzyIcon class="trigger" name="ant-design:menu-unfold-outlined" />
          </button>
          <button v-else @click="() => (collapsed = !collapsed)">
            <LzyIcon class="trigger" name="ant-design:menu-fold-outlined" />
          </button>
        </a-tooltip>
        <!-- 面包屑 -->
        <Transition name="fade" mode="out-in">
          <a-breadcrumb :key="selected.index">
            <a-breadcrumb-item>
              <LzyIcon
                :name="selected.uicon"
                style="font-size: 18px; margin-right: 4px; line-height: 1"
              />
              <span>{{ selected.name }}</span>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </Transition>
      </a-layout-header>
      <!-- 内容 -->
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '14px',
          minHeight: '280px',
        }"
      >
        <Transition name="router" mode="out-in">
          <RouterView v-if="!loading" />
        </Transition>
      </a-layout-content>
    </a-layout>
  </a-layout>
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
.logo {
  height: 60px;
  margin: 16px;
  text-align: center;
  color: var(--themeColor);
  font-family: "dindin";
  overflow: hidden;
  h2 {
    text-wrap: nowrap;
  }
}
.ant-layout-header {
  background-color: #fff;
  padding: 0;
  display: flex;
  align-items: center;

  button {
    padding: 8px 15px;
    margin-left: 10px;
    border: none;
    background-color: transparent;
    transition: 0.3s;
    border-radius: 5px;
    &:hover {
      background: #99999930;
      color: var(--themeColor);
    }
    svg.trigger {
      font-size: 22px;
      line-height: 64px;
      cursor: pointer;
    }
  }
}

:deep(.menuitem) .ant-menu-title-content {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(2px);
}

.router-enter-active {
  transition: 0.15s;
}
.router-leave-active {
  transition: 0.3s;
}
.router-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.router-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
