<script setup lang="ts">
import {
  addSystemConfig,
  getSystemConfig,
  updateSystemConfig,
} from "@/api/system";
import SetLoadGif from "@/components/webSet/SetLoadGif.vue";
import { WebSystemType } from "@/typings/WebSetType";
import { message } from "ant-design-vue";
import SetSystem from "@/components/webSet/SetSystem.vue";
import SetAiKey from "@/components/webSet/SetAiKey.vue";

const activeKey = useStorage("activeKey", "1");

const { data } = await getSystemConfig();
const result: WebSystemType[] = data;

const updateSystemData = async (arr) => {
  try {
    const resultPromise = await Promise.all(
      arr.map((item) => {
        const { config_id, ...arg } = item;
        if (config_id != 0 && config_id != "") {
          return updateSystemConfig(item);
        } else {
          return addSystemConfig(arg);
        }
      }),
    );
    return message.success(resultPromise[0].data);
  } catch (err) {
    console.log("🚀 ~ updateSystemData ~ err:", err);
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
          <SetSystem :result="result" />
        </section>
      </ATab-pane>
      <ATab-pane key="3" tab="Ai密钥配置">
        <section class="webSetItem">
          <SetAiKey :result="result" />
        </section>
      </ATab-pane>
      <ATab-pane key="4" tab="页脚内容设置">
        <section class="webSetItem"></section>
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
