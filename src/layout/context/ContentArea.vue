<script setup lang="ts">

const { refreshKey } = inject<any>("paramsRef");

</script>

<template>
  <ALayout-content
    :style="{
      padding: '14px',
      overflow: 'hidden auto',
      minHeight: '500px',
      height: '100%',
    }"
  >
    <RouterView v-slot="{ Component }">
      <Transition name="router" mode="out-in">
        <component :is="Component" :key="refreshKey" />
      </Transition>
    </RouterView>
  </ALayout-content>
</template>

<style scoped>
.ant-layout-content {
  background: var(--color-bg-light);
  color: var(--color-text);
}
</style>
