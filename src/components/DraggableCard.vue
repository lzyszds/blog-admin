<template>
  <a-card style="padding: 5px" :bodyStyle="{ padding: '5px' }">
    <Transition name="fade" v-for="(item, index) in checkAll" :key="index">
      <dir
        class="draggable-item"
        draggable="true"
        @dragstart="onDragStart(index)"
        @dragover.prevent="onDragOver(index)"
        @drop="onDrop(index)"
      >
        <p>
          <LzyIcon name="iconoir:dialpad" size="18" style="vertical-align: sub" />
        </p>
        <a-checkbox v-model:checked="checkAll" @change="onCheckAllChange">
          {{ item.title }}
        </a-checkbox>
      </dir>
    </Transition>
  </a-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import LzyIcon from "./LzyIcon.vue";
const props = defineProps({
  columns: Array,
});
const { cloned: checkAll } = useCloned(props.columns);

let draggedItemIndex = null;

const onDragStart = (index) => {
  draggedItemIndex = index;
};

const onDragOver = (index) => {
  console.log("drag over", index);

  if (index !== draggedItemIndex) {
    const draggedItem = checkAll.value[draggedItemIndex];
    checkAll.value.splice(draggedItemIndex, 1); // 移除被拖拽的项
    checkAll.value.splice(index, 0, draggedItem); // 在新的位置插入
    draggedItemIndex = index; // 更新当前拖拽项的索引
  }
};

const onDrop = (index) => {
  const draggedItem = checkAll.value[draggedItemIndex];
  checkAll.value.splice(draggedItemIndex, 1); // 移除被拖拽的项
  checkAll.value.splice(index, 0, draggedItem); // 在新的位置插入
};

const onCheckAllChange = () => {
  // checkAll.value = checkAll.value.length > 0 ? [] : props.columns.map((item) => item.key);
};
</script>

<style scoped>
.draggable-item {
  width: 150px;
  height: 40px;
  display: flex;
  gap: 5px;
  margin: 0;
  align-items: center;
  padding: 0;
  border-radius: 5px;

  & > p {
    cursor: move;
    margin: 0;
    height: 100%;
    line-height: 40px;
    width: 20px;
    padding-left: 10px;
  }

  &:hover,
  &:active,
  &:focus {
    background-color: rgb(var(--themeColorRgb), 0.1);
  }
}

/* 1. declare transition */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-leave-active {
  position: absolute;
}
</style>
