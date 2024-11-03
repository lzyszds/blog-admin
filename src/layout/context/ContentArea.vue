<script setup lang="ts">
import ToolsMenu from "@/components/ToolsMenu.vue";

const { tabsState, layout, refreshKey } = inject<any>("paramsRef");

const { toggle: toggleFullscreen } = useFullscreen(layout);
const emit = defineEmits(["push-router"]);
</script>

<template>
  <ATabs
    v-model:activeKey="tabsState.activeKey"
    type="editable-card"
    hide-add
    @edit="tabsState.delKeyItem"
    :animated="false"
    @tabClick="$emit('push-router', $event)"
  >
    <ATabPane
      v-for="(item, index) in tabsState.tabsKeyArr"
      :key="index"
      :closable="!item.noClose"
    >
      <template #tab>
        <ToolsMenu :disabled-keys="['1']" :tab-id="item.key + ''">
          <span>
            <LzyIcon :name="item.uicon" :size="16" />
            {{ item.name }}
          </span>
        </ToolsMenu>
      </template>
    </ATabPane>

    <!-- 右侧操作栏 -->
    <template #rightExtra>
      <div class="rightExtra">
        <ATooltip placement="bottom">
          <template #title>刷新页面</template>
          <AButton type="text" @click="refreshKey++">
            <LzyIcon size="20" name="iconoir:refresh-circle" />
          </AButton>
        </ATooltip>
        <ATooltip placement="bottom">
          <template #title>全屏</template>
          <AButton @click="toggleFullscreen" type="text">
            <LzyIcon size="20" name="iconoir:expand" />
          </AButton>
        </ATooltip>
      </div>
    </template>
  </ATabs>

  <ALayout-content
    :style="{
      padding: '14px',
      overflow: 'hidden auto',
      minHeight: '500px',
    }"
  >
    <RouterView v-slot="{ Component }">
      <Transition name="router" mode="out-in">
        <component :is="Component" :key="refreshKey" />
      </Transition>
    </RouterView>
  </ALayout-content>
</template>

<style scoped>
/* Keep the relevant styles from the original component */

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
