<script setup lang="ts"></script>

<template>
  <RouterView />

  <!-- antd 配置基础样式 -->
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#5161ce',
      },
    }"
  >
  </a-config-provider>
</template>

<style scoped></style>
