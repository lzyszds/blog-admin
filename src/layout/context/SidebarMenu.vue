<script setup lang="ts">
import items from "../config";
const { isFixed, selectedKeys, collapsed } = inject<any>("paramsRef");

const emit = defineEmits<{
  (e: "push-router", item: any): void;
  (e: "breakpoint", broken: boolean): void;
}>();
</script>

<template>
  <ALayoutSider
    v-model:collapsed="collapsed"
    :trigger="null"
    style="background-color: #fff"
    collapsible
    :collapsed-width="!isFixed ? 80 : 0"
    breakpoint="sm"
    :class="{ fixed: isFixed }"
    @breakpoint="emit('breakpoint', $event)"
  >
    <div class="logo" @click="emit('push-router', items[0])">
      <h2>{{ collapsed ? "Jz" : "Jz 博客管理系统" }}</h2>
    </div>

    <AMenu v-model:selectedKeys="selectedKeys" mode="inline">
      <AMenu-item
        v-for="item in items"
        :key="item.key"
        @click="emit('push-router', item)"
        class="menuitem"
      >
        <span class="anticon anticon-user">
          <LzyIcon :name="item.uicon" style="font-weight: 600" />
        </span>
        <span class="menu-title-item">{{ item.name }}</span>
      </AMenu-item>
    </AMenu>
  </ALayoutSider>
</template>

<style scoped>
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
</style>
