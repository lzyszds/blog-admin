<script setup lang="ts">
import type { Trigger } from "ant-design-vue/es/dropdown/props";
import closeCurrentImage from "@/assets/icon/close-current.png";
import closeOtherImage from "@/assets/icon/close-other.png";
import closeAllImage from "@/assets/icon/close-all.png";
import closeLeftImage from "@/assets/icon/close-left.png";
import closeRightImage from "@/assets/icon/close-right.png";
const themeMode = useStorage<string>("themeMode", "light");

const { tabsState } = inject<any>("paramsRef");
/* 右键触发菜单 */
type Props = {
  trigger?: Trigger[];
  tabId: string;
  disabledKeys: string[];
};

const props = withDefaults(defineProps<Props>(), {
  trigger: () => ["contextmenu"],
});

const emit = defineEmits(["refresh"]);

const menuItem = [
  { key: "1", label: "关闭当前", icon: closeCurrentImage, size: 15 },
  { key: "2", label: "关闭其他", icon: closeOtherImage, size: 15 },
  { key: "3", label: "关闭全部", icon: closeAllImage, size: 18 },
  { key: "4", label: "关闭右侧", icon: closeRightImage, size: 12 },
  { key: "5", label: "关闭左侧", icon: closeLeftImage, size: 12 },
];

const handleClick = (item, tabId) => {
  let tabKeys, currentTabIndex;
  const { tabsKeyArr, delMultiKeyItem, delSingleKeyItem } = tabsState;
  switch (item.label) {
    case "关闭当前":
      delSingleKeyItem(tabId, true);
      break;
    case "关闭其他":
      /* 找出除了首页标签跟当前标签的其他标签 */
      tabKeys = tabsKeyArr
        .filter((tabsKey) => tabsKey.key != tabId && tabsKey.key != 1)
        .map((res) => res.key);
      if (tabKeys.length == 0) return;
      delMultiKeyItem(tabKeys, tabId, true);
      break;
    case "关闭全部":
      /* 找出除了首页标签跟当前标签的其他标签 */
      tabKeys = tabsKeyArr.filter((tabsKey) => tabsKey.key != 1).map((res) => res.key);
      if (tabKeys.length == 0) return;
      delMultiKeyItem(tabKeys, 1, true);
      break;
    case "关闭右侧":
      currentTabIndex = tabsKeyArr.findIndex((item) => item.key == tabId);
      tabKeys = [];
      tabsKeyArr.forEach((_element, index) => {
        if (index > currentTabIndex) {
          tabKeys.push(index);
        }
      });

      delMultiKeyItem(tabKeys, tabId);
      break;
    case "关闭左侧":
      currentTabIndex = tabsKeyArr.findIndex((item) => item.key == tabId);
      console.log(currentTabIndex);

      tabKeys = [];
      tabsKeyArr.forEach((_element, index) => {
        if (index < currentTabIndex && index != 0) {
          tabKeys.unshift(index);
        }
      });
      delMultiKeyItem(tabKeys, tabId);
      break;
  }
  emit("refresh");
};
</script>

<template>
  <ADropdown :trigger="props.trigger" placement="bottom" destroy-popup-on-hide>
    <slot></slot>
    <template #overlay>
      <AMenu>
        <AMenu-item
          v-for="item in menuItem"
          :key="item.key"
          :disabled="props.disabledKeys.includes(tabId) && ['1', '5'].includes(item.key)"
          @click="handleClick(item, tabId)"
        >
          <span class="menu-item">
            <img
              :style="{ filter: themeMode == 'dark' ? 'invert(1)' : '' }"
              :src="item.icon"
              :width="item.size"
              :height="item.size"
              alt=""
            />
            {{ item.label }}
          </span>
        </AMenu-item>
      </AMenu>
    </template>
  </ADropdown>
</template>

<style scoped>
.menu-item {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  color: var(--color-text);
}
</style>
