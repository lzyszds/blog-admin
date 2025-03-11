<script setup lang="ts">
import { addSystemConfig, getSystemConfig, updateSystemConfig } from "@/api/system";
import SetLoadGif from "@/components/webSet/SetLoadGif.vue";
import { WebSystemType } from "@/typings/WebSetType";
import { message } from "ant-design-vue";
import SetSystem from "@/components/webSet/SetSystem.vue";
import SetAiKey from "@/components/webSet/SetAiKey.vue";
import SetFooterOrAi from "@/components/webSet/SetFooterOrAi.vue";

const activeKey = useStorage("activeKey", "1");

const { data } = await getSystemConfig();
const result: WebSystemType[] = data;

const updateSystemData = async (item) => {
  try {
    const { config_id, ...arg } = item;
    let result;
    if (config_id && config_id !== 0) {
      result = await updateSystemConfig(item);
    } else {
      result = await addSystemConfig(arg);
    }
    message.success(result.data);
  } catch (err) {
    console.error("Error updating system data:", err);
    message.error("更新系统数据时出错");
  }
};
</script>

<template>
  <ACard style="height: 100%">
    <ATabs v-model:activeKey="activeKey" :tab-position="'top'" centered>
      <ATab-pane key="1" tab="图片懒加载设置">
        <section class="webSetItem">
          <SetLoadGif :result="result" @updateSystemData="updateSystemData" />
        </section>
      </ATab-pane>
      <ATab-pane key="2" tab="系统变量设置">
        <section class="webSetItem">
          <SetSystem :result="result" @updateSystemData="updateSystemData" />
        </section>
      </ATab-pane>
      <ATab-pane key="3" tab="Ai密钥配置">
        <section class="webSetItem">
          <SetAiKey :result="result" />
        </section>
      </ATab-pane>
      <ATab-pane key="4" tab="页脚内容设置">
        <section class="webSetItem">
          <SetFooterOrAi />
        </section>
      </ATab-pane>
    </ATabs>
  </ACard>
</template>

<style scoped>
:deep(.ant-card-body) {
  height: 100%;

  & > div {
    height: 100%;

    .ant-tabs-content {
      height: 100%;

      .ant-tabs-tabpane {
        height: 100%;
      }
    }
  }
}

.webSetItem {
  height: 100%;
}
</style>
