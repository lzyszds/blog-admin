<script setup lang="ts">
const theme = {
  token: {
    colorPrimary: "#5161ce",
  },
};
</script>

<template>
  <RouterView />

  <!-- antd 配置基础样式 -->
  <AConfigProvider :theme="theme"> </AConfigProvider>
</template>

<style scoped></style>
