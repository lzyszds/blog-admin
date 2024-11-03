<script setup lang="ts">
const { selected } = inject<any>("paramsRef");
</script>

<template>
  <!-- 面包屑 -->
  <Transition name="fade" mode="out-in">
    <ABreadcrumb :key="selected && selected.key" style="flex: 1">
      <ABreadcrumb-item>
        <LzyIcon
          :name="selected && selected.uicon"
          style="font-size: 18px; margin-right: 4px; line-height: 1"
        />
        <span>{{ selected && selected.name }}</span>
      </ABreadcrumb-item>
    </ABreadcrumb>
  </Transition>
</template>

<style scoped></style>
