<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus";

import { getUsersTable } from "@/store/usersTable";
const usersTableData = getUsersTable();
</script>

<template>
  <APopover placement="bottomRight" trigger="click">
    <AButton>
      <template #icon>
        <LzyIcon name="iconoir:settings" size="16" />
      </template>
      <span>列设置</span>
    </AButton>
    <template #content>
      <VueDraggable
        v-model="usersTableData.columns"
        :animation="150"
        filter=".none_draggable"
      >
        <div
          v-for="item in usersTableData.columns"
          :key="item.key"
          class="draggable-item"
        >
          <LzyIcon name="iconoir:dialpad" size="18" style="vertical-align: sub" />
          <ACheckbox v-model:checked="item.checked" class="none_draggable flex-1">
            {{ item.title }}
          </ACheckbox>
        </div>
      </VueDraggable>
    </template>
  </APopover>
</template>

<style scoped>
.draggable-item {
  width: auto;
  height: 40px;
  display: flex;
  gap: 5px;
  margin: 0;
  align-items: center;
  padding: 0;
  border-radius: 5px;

  & > svg {
    cursor: move;
    margin: 0;
    height: 100%;
    line-height: 40px;
    width: 20px;
    padding-left: 10px;
  }

  &:hover,
  &:active,
  &:focus,
  &.active {
    background-color: rgb(var(--themeColorRgb), 0.1);
  }
}

/* 1. declare transition */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-leave-active {
  position: absolute;
}
</style>
