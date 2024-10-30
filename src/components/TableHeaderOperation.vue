<script setup lang="ts">
import DraggableCard from "@/components/DraggableCard.vue";
const props = defineProps({
  selectedRowKeys: {
    type: Array,
    default: () => [],
  },
  addModal: { type: Function, default: () => {} },
  columns: { type: Array, default: () => [] },
});
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

    <AButton> <LzyIcon name="iconoir:refresh-double" size="15" /> 刷新 </AButton>

    <ADropdown :trigger="['click']" placement="bottomRight" arrow>
      <AButton> <LzyIcon name="iconoir:settings" size="16" />列设置</AButton>
      <template #overlay>
        <Transition name="ant-zoom-big">
          <DraggableCard :columns="columns"></DraggableCard>
        </Transition>
      </template>
    </ADropdown>
  </div>
</template>

<style scoped></style>
