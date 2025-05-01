<script setup lang="ts">
import CollapseButton from "@/layout/modules/CollapseButton.vue";
import Breadcrumb from "@/layout/modules/Breadcrumb.vue";
import ThemeConfig from "@/layout/modules/ThemeConfig.vue";
import UserMenu from "@/layout/modules/UserMenu.vue";
import ClearReidsCache from "@/layout/modules/ClearReidsCache.vue";

defineEmits(["toggle-collapse"]);
</script>

<template>
  <ALayoutHeader class="ant-layout-header">
    <CollapseButton />
    <Breadcrumb />
    <div class="right">
      <ClearReidsCache />
      <ThemeConfig />
      <UserMenu />
    </div>
  </ALayoutHeader>
</template>

<style scoped>
/* Keep the relevant styles from the original component */
.ant-layout-header {
  background-color: var(--color-bg);
  padding: 0;
  display: flex;
  align-items: center;
  padding: 0 15px;
  border-bottom: 1px solid var(--color-border);

  .right {
    display: flex;
  }
}

@media screen and (max-width: 568px) {
  .ant-layout-header {
    padding: 0;
  }
}
</style>
