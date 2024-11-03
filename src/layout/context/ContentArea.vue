<script setup lang="ts">
import BetterScroll from "@/components/BetterScroll.vue";
import LzyIcon from "@/components/LzyIcon.vue";
import ToolsMenu from "@/layout/modules/ToolsMenu.vue";
import { useTabsState } from "@/store/useTabsState";
const tabsState = useTabsState();

const { layout, refreshKey } = inject<any>("paramsRef");

const { toggle: toggleFullscreen } = useFullscreen(layout);
const emit = defineEmits(["push-router"]);
const betterScroll = ref<any>(null);
const refreshSrcoll = () => {
  nextTick(() => {
    betterScroll.value!.refresh();
    console.log("betterScroll refresh");
  });
};
</script>

<template>
  <div class="content-area">
    <BetterScroll ref="betterScroll">
      <template v-for="(item, index) in tabsState.tabsKeyArr" :key="index">
        <ToolsMenu
          :disabled-keys="['1']"
          :tab-id="item.key + ''"
          @refresh="refreshSrcoll"
        >
          <a-button
            type="text"
            class="icon-btn"
            :class="{ active: index === tabsState.activeKey }"
            @click.stop="$emit('push-router', index)"
          >
            <LzyIcon :name="item.uicon" :size="16" />
            {{ item.name }}
            <LzyIcon
              class="icon-close"
              v-if="!item.noClose"
              @click.stop="tabsState.delSingleKeyItem(index)"
              name="iconoir:xmark"
              :size="16"
            />
          </a-button>
        </ToolsMenu>
      </template>
    </BetterScroll>

    <!-- 右侧操作栏 -->
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
  </div>

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
.content-area {
  padding: 10px 15px;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
}
/* Keep the relevant styles from the original component */
button.icon-btn {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  border-bottom: 2px solid transparent;
  border-radius: 5px;
  &.active {
    color: var(--themeColor);
    border-bottom: 2px solid var(--themeColor);
    border-radius: 5px 5px 0 0;
    border-radius: 5;
  }

  svg.icon-close {
    margin-left: 5px;
    font-size: 18px !important;
    z-index: 99;
    &:hover {
      color: #ff4d4f;
    }
  }
}

.rightExtra {
  display: flex;
  button {
    height: 100%;
  }
}
</style>
