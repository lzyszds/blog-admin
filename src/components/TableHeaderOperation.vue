<script setup lang="ts">
import DraggableCard from "@/components/DraggableCard.vue";
interface Props {
  selectedRowKeys: any[];
  addModal: Function;
  loading: boolean;
}
const props = defineProps<Props>();
const emits = defineEmits(["refresh"]);
/* 刷新表格数据 */
const refresh = () => emits("refresh");
</script>

<template>
  <div class="actionBtn">
    <AButton type="primary" @click="props.addModal">
      <LzyIcon name="iconoir:user-plus" size="18" /> 新增
    </AButton>

    <AButton
      danger
      :disabled="!props.selectedRowKeys.length"
      style="padding-left: 5px; padding-right: 5px"
    >
      <LzyIcon name="iconoir:trash" size="16" />
      批量删除
    </AButton>

    <AButton @click="refresh">
      <LzyIcon name="iconoir:refresh-double" size="15" :class="{ spin: loading }" />
      刷新
    </AButton>

    <DraggableCard></DraggableCard>
  </div>
</template>

<style scoped>
.actionBtn button {
  svg {
    margin-right: 5px;
  }
}

/* 一直旋转 */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.spin {
  animation: rotate 2s linear infinite;
}
</style>
