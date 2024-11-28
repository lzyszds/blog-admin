<script setup lang="ts">
import LzyIcon from "@/components/LzyIcon.vue";

const { selected } = inject<any>("paramsRef");
</script>

<template>
  <!-- 面包屑 -->
  <Transition name="fade" mode="out-in">
    <ABreadcrumb
      :key="selected && selected.meta.key"
      style="flex: 1; margin-top: 2px"
    >
      <ABreadcrumb-item>
        <LzyIcon
          :name="selected && selected.meta.uicon"
          style="font-size: 18px; margin-right: 4px; line-height: 1"
        />
        <span>{{ selected && selected.meta.name }}</span>
      </ABreadcrumb-item>
    </ABreadcrumb>
  </Transition>
</template>

<style scoped></style>
