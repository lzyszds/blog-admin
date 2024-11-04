<script setup lang="ts">
import DraggableCard from "@/components/DraggableCard.vue";
interface Props {
  selectedRowKeys: any[];
  addModal: Function;
  loading: boolean;
}
const props = defineProps<Props>();
const emits = defineEmits(["refresh", "multipleDel"]);
</script>

<template>
  <div class="actionBtn">
    <AButton type="primary" @click="props.addModal">
      <LzyIcon name="iconoir:user-plus" size="18" /> 新增
    </AButton>

    <AButton
      danger
      :disabled="!props.selectedRowKeys.length"
      @click="$emit('multipleDel')"
      class="multipleDel"
    >
      <LzyIcon name="iconoir:trash" size="16" />
      批量删除
    </AButton>

    <AButton @click="$emit('refresh')">
      <LzyIcon name="iconoir:refresh-double" size="16" :class="{ spin: loading }" />
      刷新
    </AButton>

    <DraggableCard></DraggableCard>
  </div>
</template>

<style scoped>
.actionBtn :deep(button) {
  svg {
    margin-right: 5px;
    vertical-align: text-bottom;
  }
  &.multipleDel {
    padding: 0 5px;
    
    &[disabled] {
      color: var(--color-border);
    }
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
