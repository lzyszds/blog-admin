<script lang="ts" setup>
import LzyIcon from "@/components/LzyIcon.vue";
import items from "./config";
import { useTabsState } from "@/store/useTabsState";
import ToolsMenu from "@/components/ToolsMenu.vue";

const selected = useStorage("selected", items[0]);
const selectedKeys = ref<string[]>([selected.value.key]); // 选中的菜单
const collapsed = ref<boolean>(false); // 是否折叠
const layout = templateRef<HTMLElement>("layout"); // 布局ref
const loading = ref(false); // 加载中新路由
const router = useRouter();
const isFixed = ref(false); // 控制是否应用 `fixed` 样式
const tabsState = useTabsState();
const tabsRef = templateRef<HTMLElement>("tabsRef");
const refreshKey = ref(0); // 刷新路由

/* 跳转路由  */
const pushRouter = (item) => {
  if (typeof item == "number") {
    item = tabsState.getKeyArr(item);
  }
  selectedKeys.value = [item.key];
  selected.value = item;
  tabsState.setKeyArr(item);

  loading.value = true;
  /* 实现脱离动画 */
  setTimeout(() => {
    loading.value = false;
    router.push({ name: item.component });
  }, 300);
};

/* 监听屏幕宽度 变化时，控制是否应用 `fixed` 样式 */
const handleBreakpoint = (broken) => {
  isFixed.value = broken;
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
  <ALayout class="ant-layout" ref="layout">
    <!-- 菜单遮罩 -->
    <div
      :class="{ show: isFixed && !collapsed, mask: true }"
      @click="collapsed = true"
    ></div>

    <ALayoutSider
      v-model:collapsed="collapsed"
      :trigger="null"
      style="background-color: #fff"
      collapsible
      :collapsed-width="!isFixed ? 80 : 0"
      breakpoint="sm"
      :class="{ fixed: isFixed }"
      @breakpoint="handleBreakpoint"
    >
      <div class="logo" @click="pushRouter(items[0])">
        <h2>{{ collapsed ? "Jz" : "Jz 博客管理系统" }}</h2>
      </div>

      <!-- 菜单 -->
      <AMenu v-model:selectedKeys="selectedKeys" mode="inline">
        <AMenu-item
          v-for="item in items"
          :key="item.key"
          @click="pushRouter(item)"
          class="menuitem"
        >
          <span class="anticon anticon-user">
            <LzyIcon :name="item.uicon" style="font-weight: 600" />
          </span>
          <span class="menu-title-item">{{ item.name }}</span>
        </AMenu-item>
      </AMenu>
    </ALayoutSider>
    <ALayout>
      <!-- 头部 -->
      <ALayoutHeader class="ant-layout-header">
        <!-- 折叠按钮 -->
        <template v-if="!isFixed">
          <a-tooltip placement="bottomLeft" :mouseLeaveDelay="0">
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
        </template>
        <template v-else>
          <button v-if="collapsed" @click="() => (collapsed = !collapsed)">
            <LzyIcon class="trigger" name="ant-design:menu-unfold-outlined" />
          </button>
          <button v-else @click="() => (collapsed = !collapsed)">
            <LzyIcon class="trigger" name="ant-design:menu-fold-outlined" />
          </button>
        </template>

        <!-- 面包屑 -->
        <Transition name="fade" mode="out-in">
          <a-breadcrumb :key="selected.key">
            <a-breadcrumb-item>
              <LzyIcon
                :name="selected.uicon"
                style="font-size: 18px; margin-right: 4px; line-height: 1"
              />
              <span>{{ selected.name }}</span>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </Transition>

        <template #extra>
        12
        </template>
      </ALayoutHeader>

      <!-- 右键打开 菜单 -->
      <a-tabs
        v-model:activeKey="tabsState.activeKey"
        type="editable-card"
        hide-add
        @edit="tabsState.delKeyItem"
        class=""
        :animated="false"
        @tabClick="pushRouter"
        ref="tabsRef"
      >
        <a-tab-pane
          v-for="(item, index) in tabsState.tabsKeyArr"
          :key="index"
          :closable="!item.noClose"
        >
          <template #tab>
            <ToolsMenu :disabled-keys="['1']" :tab-id="item.key">
              <span>
                <LzyIcon :name="item.uicon" :size="16" style="vertical-align: sub" />
                {{ item.name }}
              </span>
            </ToolsMenu>
          </template>
        </a-tab-pane>
        <template #rightExtra>
          <div class="rightExtra">
            <ATooltip placement="bottom">
              <template #title>刷新页面</template>
              <AButton type="text">
                <LzyIcon @click="refreshKey++" size="26" name="iconoir:refresh-circle" />
              </AButton>
            </ATooltip>
            <ATooltip placement="bottom">
              <template #title>全屏</template>
              <AButton type="text"><LzyIcon size="26" name="iconoir:expand" /></AButton>
            </ATooltip>
          </div>
        </template>
      </a-tabs>

      <!-- 内容 -->
      <ALayout-content
        :style="{
          padding: '14px',
          overflow: 'hidden auto',
          minHeight: '500px',
        }"
        ref="mainRef"
      >
        <RouterView v-slot="{ Component }">
          <Transition name="router" mode="out-in">
            <component :is="Component" :key="refreshKey" />
          </Transition>
        </RouterView>
      </ALayout-content>
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
.logo {
  height: 60px;
  margin: 16px;
  text-align: center;
  color: var(--themeColor);
  font-family: "dindin";
  overflow: hidden;
  cursor: pointer;
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

.fixed {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
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

:deep(.ant-layout-header) {
  border-bottom: 1px solid #eee;
}

:deep(.ant-tabs-nav) {
  height: 50px;
  padding: 0;
  margin: 0;
  background-color: #fff;
  .ant-tabs-nav-list {
    padding: 2px;
  }
  .ant-tabs-tab {
    padding: 4px 20px;
    margin-left: 0 !important;
    border-radius: 50px !important;
    background-color: transparent;
    border: none;
    color: #999;
    text-align: center;
    user-select: none;
    transition: none;
    justify-content: center;
    align-items: center;
    button {
      margin-left: 5px;
      font-size: 14px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-right: 5px;
      padding-top: 2px;

      &:hover {
        background-color: #eee;
      }
      span {
        font-size: 12px !important;
      }
    }
    &.ant-tabs-tab-active {
      button {
        color: var(--themeColor);
      }
    }
  }

  .rightExtra {
    display: flex;
    margin-right: 10px;
    button {
      height: 100%;
    }
  }
}
:deep(.menu-title-item) {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol", "Noto Color Emoji";
}
</style>
