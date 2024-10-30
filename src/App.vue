<script setup lang="ts"></script>

<template>
  <RouterView />

  <!-- antd 配置基础样式 -->
  <AConfig-provider
    :theme="{
      token: {
        colorPrimary: '#5161ce',
      },
    }"
  >
  </AConfig-provider>
</template>

<style scoped></style>
