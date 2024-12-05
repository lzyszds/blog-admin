<script setup lang="ts">
import BetterScroll from "@/components/BetterScroll.vue";
import ToolsMenu from "@/layout/modules/ToolsMenu.vue";
import LzyIcon from "@/components/LzyIcon.vue";
import { useTabsState } from "@/store/useTabsStore";

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
          :tab-id="item.meta.key + ''"
          @refresh="refreshSrcoll"
        >
          <AButton
            type="text"
            class="icon-btn"
            :class="{ active: index === tabsState.activeKey }"
            @click.stop="$emit('push-router', index)"
          >
            <LzyIcon :name="item.meta.uicon" :size="16" />
            {{ item.meta.name }}
            <LzyIcon
              class="icon-close"
              v-if="!item.noClose"
              @click.stop="tabsState.delSingleKeyItem(index)"
              name="iconoir:xmark"
              :size="16"
            />
          </AButton>
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
</template>

<style scoped>
.content-area {
  padding: 5px 15px;
  background-color: var(--color-bg);
  display: flex;
  justify-content: space-around;
}

/* Keep the relevant styles from the original component */
.icon-btn {
  display: grid;
  grid-template-columns: 15px 1fr 12px;
  justify-content: space-around;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  border-bottom: 2px solid transparent;
  border-radius: 8px;
  margin-right: 4px;
  background-color: var(--color-bg-light);
  transition: 0s;
  width: 120px;
  padding: 2px 15px 2px 10px;

  &.active {
    color: #fff;
    background-color: var(--themeColor);
    border-bottom: 2px solid var(--themeColor);
  }

  svg.icon-close {
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
