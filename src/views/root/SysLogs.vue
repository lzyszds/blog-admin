<script lang="ts" setup>
import { getSystemLog } from "@/api/system.ts";
import dayjs from "dayjs";
import { LogRequestResult } from "@/typings/LogType.ts";

const searchForm = reactive({
  page: 1,
  limit: 10,
  date: dayjs().format("YYYY-MM-DD"),
  type: "error",
});

const logData = ref<LogRequestResult>({
  data: [],
  total: 0,
});

const infoActiveKey = ref("");

const handleData = (data: any) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
};

const isObject = (data: any) => {
  return typeof data === "object";
};

const disabledDate = (current: any) => {
  return current && current > dayjs().endOf("day");
};

watch(
  searchForm,
  async () => {
    const { data } = await getSystemLog(searchForm);
    logData.value = data;
  },
  {
    deep: true,
    immediate: true,
  },
);
</script>

<template>
  <main>
    <a-card title="搜索工具">
      <div class="searchCard">
        <section>
          日志日期：
          <a-date-picker
            v-model:value="searchForm.date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate"
          ></a-date-picker>
        </section>
        <section>
          日志类型：
          <a-select
            v-model:value="searchForm.type"
            placeholder="选择类型"
            style="width: 100%"
          >
            <a-select-option value="error">错误日志</a-select-option>
            <a-select-option value="info">正常日志</a-select-option>
          </a-select>
        </section>
      </div>
    </a-card>

    <a-card title="系统日志" :bordered="false" style="margin-top: 10px">
      <template #extra>
        <!-- 分页  -->
        <a-pagination
          v-model:current="searchForm.page"
          v-model:pageSize="searchForm.limit"
          :page-size-options="['5', '10', '20', '30', '40']"
          size="small"
          :total="logData.total"
          show-size-changer
        />
      </template>
      <section v-if="logData.total">
        <a-collapse v-model:activeKey="infoActiveKey">
          <a-collapse-panel
            v-for="(item, index) in logData.data"
            :key="index"
            :header="item.time"
          >
            <template #extra>
              <a-space>
                <a-tag color="error" v-if="searchForm.type === 'error'">
                  错误日志
                </a-tag>
                <a-tag color="success" v-else> 正常日志</a-tag>
              </a-space>
            </template>

            <span v-if="!isObject(handleData(item.message))">
              {{ handleData(item.message) }}
            </span>
            <section v-else>
              <p
                style="margin: 0"
                v-for="(value, key) in handleData(item.message)"
                :key="key"
              >
                {{ key }}:{{ value }}
              </p>
            </section>
          </a-collapse-panel>
        </a-collapse>
      </section>
      <a-empty v-else>
        <template #description>
          <span style="color: rgba(0, 0, 0, 0.25)">暂无日志</span>
        </template>
      </a-empty>
    </a-card>
  </main>
</template>
<style scoped>
.searchCard {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  section {
    display: grid;
    grid-template-columns: 70px 200px;
    justify-content: center;
    align-items: center;
  }
}

:deep(.ant-pagination-options) {
  .ant-select-sm {
    width: 95px;
    text-align: center;
  }
}
</style>
