<script setup lang="ts" name="lzyIcon">
import { Icon } from "@iconify/vue";

interface Props {
  name: string;
  height?: string;
  style?: string | Object;
  size?: number | string;
}
const props = defineProps<Props>();
let style = props.style;
if (props.size) {
  style = Object.assign(props.style || {}, { fontSize: props.size });
}
</script>

<template>
  <Icon class="LzyIcon" :icon="name" :style="style"></Icon>
</template>

<style scoped>
.LzyIcon {
  cursor: pointer;
  vertical-align: sub;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>
