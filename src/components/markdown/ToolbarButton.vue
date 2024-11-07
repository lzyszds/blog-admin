<script setup lang="ts">
defineProps(["title", "iconName", "iconSize"]);
</script>

<template>
  <button class="toolbar-button" :data-mdtitle="title">
    <LzyIcon v-if="iconName" :name="iconName" :size="iconSize" />
    <slot></slot>
  </button>
</template>

<style scoped>
.toolbar-button {
  padding: 0.375rem;
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
  color: #64748b;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background-color 0.2s, color 0.2s;
  position: relative;

  &::before {
    content: attr(data-mdtitle);
    position: absolute;
    left: 100%;
    top: 40px;
    transform: translateX(-50%);
    background-color: #999;
    color: #fff;
    padding: 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
    z-index: 111;
    /* 不换行 */
    white-space: nowrap;
  }

  &:hover {
    background-color: #e2e8f0;
    color: #1e293b;
    &::before {
      opacity: 1;
    }
  }

  svg {
    font-size: 18px;
  }
}
.toolbar-group.right {
  .toolbar-button:nth-last-child(1) {
    &::before {
      left: 60%;
    }
  }
}
</style>
