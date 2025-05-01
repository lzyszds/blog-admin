<script setup lang="ts">
import { clearRedisCacheAll } from "@/api/toolkit";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";
import { createVNode } from "vue";

const clearReidsCache = () => {
  Modal.confirm({
    title: "你确定要清理当前系统的缓存吗?",
    icon: createVNode(ExclamationCircleOutlined),
    content: "当点击确定按钮时,将对系统缓存进行清理！",
    onOk() {
      clearRedisCacheAll()
        .then(() => {
          Modal.success({
            title: "清理缓存成功",
            content: "缓存清理成功,刷新页面即可",
            onOk() {
              window.location.reload();
            },
          });
        })
        .catch((err) => {
          Modal.error({
            title: "清理缓存失败",
            content: err,
          });
        });
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onCancel() {},
  });
};
</script>

<template>
  <!-- 主题配置 -->
  <ATooltip placement="bottom">
    <template #title> 清除缓存 </template>
    <AButton type="text" @click="clearReidsCache">
      <LzyIcon size="20" name="iconoir:database-backup" />
    </AButton>
  </ATooltip>
</template>

<style scoped></style>
