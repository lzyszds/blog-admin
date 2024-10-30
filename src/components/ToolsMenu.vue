<script setup lang="ts">
import LzyIcon from "./LzyIcon.vue";
import type { Trigger } from "ant-design-vue/es/dropdown/props";

/* 右键触发菜单 */
type Props = {
  trigger?: Trigger[];
  tabId: string;
  disabledKeys: string[];
};
const props = withDefaults(defineProps<Props>(), {
  trigger: () => ["contextmenu"],
});

const menuItem = [
  { key: "1", label: "关闭当前", icon: "" },
  { key: "2", label: "关闭其他", icon: "" },
  { key: "3", label: "关闭全部", icon: "" },
  { key: "4", label: "关闭左侧", icon: "" },
  { key: "5", label: "关闭右侧", icon: "" },
];
const handleOpenChange = (flag: boolean) => {
  if (flag) {
    console.log("打开");
  } else {
    console.log("关闭");
  }
};
</script>

<template>
  <a-dropdown
    :trigger="props.trigger"
    placement="bottom"
    destroy-popup-on-hide
    @openChange="handleOpenChange"
  >
    <slot></slot>
    <template #overlay>
      <a-menu>
        <a-menu-item
          v-for="item in menuItem"
          :key="item.key"
          :disabled="
            props.disabledKeys.includes(props.tabId) && ['1', '4'].includes(item.key)
          "
        >
          <a href="javascript:;">
            <LzyIcon name="ant-design:menu-unfold-outlined" />
            {{ item.label }}
          </a>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style scoped></style>
