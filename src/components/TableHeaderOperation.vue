<script setup lang="ts">
import DraggableCard from "@/components/DraggableCard.vue";

interface Props {
  selectedRowKeys: any[];
  addModal?: Function;
  loading: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits(["refresh", "multipleDel"]);
</script>

<template>
  <div class="actionBtn">
    <AButton type="primary" @click="props.addModal" v-if="props.addModal">
      <LzyIcon name="iconoir:calendar-plus" size="18" />
      新增
    </AButton>
    <a-tooltip
      placement="top"
      :title="!props.selectedRowKeys.length ? '请勾选数据' : ''"
      color="#ff4d4f"
      :arrow="false"
      trigger="click"
    >
      <AButton
        danger
        :disabled="!props.selectedRowKeys.length"
        @click="$emit('multipleDel')"
        class="multipleDel"
      >
        <LzyIcon name="iconoir:trash" size="16" />
        批量删除
      </AButton>
    </a-tooltip>

    <AButton @click="$emit('refresh')">
      <LzyIcon
        name="iconoir:refresh-double"
        size="14"
        :class="{ spin: loading }"
      />
      刷新
    </AButton>

    <DraggableCard></DraggableCard>
  </div>
</template>

<style scoped>
.actionBtn :deep(button) {
  display: flex;
  align-items: center;
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
