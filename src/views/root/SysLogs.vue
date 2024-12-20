<script lang="ts" setup>
import { useToggle, useVirtualList } from "@vueuse/core";
import { computed } from "vue";

const [isEven, toggle] = useToggle();
const allItems = Array.from(Array.from({ length: 99999 }).keys());
const filteredList = computed(() =>
  allItems.filter((i) => (isEven.value ? i % 2 === 0 : i % 2 === 1))
);

const { list, containerProps, wrapperProps } = useVirtualList(filteredList, {
  itemHeight: 22,
});
</script>

<template>
  <div>
    <p>Showing {{ isEven ? "even" : "odd" }} items</p>
    <AButton @click="toggle">Toggle Even/Odd</AButton>
    <div v-bind="containerProps" style="height: 300px">
      <div v-bind="wrapperProps">
        <div v-for="item in list" :key="item.index" style="height: 22px">
          Row: {{ item.data }}
        </div>
      </div>
    </div>
  </div>
</template>
