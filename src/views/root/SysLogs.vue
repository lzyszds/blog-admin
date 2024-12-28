<script lang="ts" setup>
import { getSystemLog } from "@/api/system.ts"; // 引入获取系统日志的 API 方法
import dayjs from "dayjs"; // 引入 dayjs 用于日期处理
import { LogRequestResult } from "@/typings/LogType.ts"; // 引入日志请求结果的类型定义
import { computed, reactive, ref, watch } from "vue";
import JsonViewerItem from "@/components/JsonViewerItem.vue"; // 明确引入需要的 Vue API

// 使用接口定义 searchForm 的类型，提高代码可读性和可维护性
interface SearchForm {
  page: number;
  limit: number;
  date: string;
  type: "error" | "info"; // 限定 type 的可选值
}

// 定义搜索表单的响应式数据
const searchForm = reactive<SearchForm>({
  page: 1, // 当前页码，默认为 1
  limit: 10, // 每页显示条数，默认为 10
  date: dayjs().format("YYYY-MM-DD"), // 日期，默认为今天的日期，格式为 YYYY-MM-DD
  type: "error", // 日志类型，默认为 "error" (错误日志)
});

// 定义日志数据的响应式引用
const logData = ref<LogRequestResult>({
  data: [], // 日志数据数组，初始为空
  total: 0, // 日志总条数，初始为 0
});

// 定义当前激活的折叠面板的 key，用于控制日志详情的展开
const infoActiveKey = ref("");

// 使用计算属性来决定是否显示日志数据区域，避免不必要的渲染
const hasLogData = computed(() => logData.value.total > 0);


// 禁用日期选择器中未来的日期
const disabledDate = (current: any) => {
  return current && current > dayjs().endOf("day"); // 禁用当前日期之后的所有日期
};

// 定义一个异步函数来获取日志数据，方便复用和清晰逻辑
const fetchLogData = async () => {
  try {
    const { data } = await getSystemLog(searchForm); // 调用 API 获取系统日志
    logData.value = data; // 更新日志数据
  } catch (error) {
    console.error("Error fetching system log:", error); // 捕获 API 请求错误
    // 可以添加错误提示给用户，例如使用 message 组件
  }
};

watch(
  searchForm,
  () => {
    fetchLogData();
  },
  {
    deep: true, // 深度监听 searchForm 对象内部属性的变化
    immediate: true, // 初始化时立即执行一次
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
          >
          </a-date-picker>
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
        <a-pagination
          v-model:current="searchForm.page"
          v-model:pageSize="searchForm.limit"
          :page-size-options="['5', '10', '20', '30', '40']"
          size="small"
          :total="logData.total"
          show-size-changer
        />
      </template>
      <section v-if="hasLogData">
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

            <div class="json-viewer">
              <template v-for="(value, key) in item" :key="key">
                <JsonViewerItem :key-name="key" :value="value" :indent="0" />
              </template>
            </div>

            <!--            <p class="jsonColumns" v-for="(value, key) in item" :key="key">-->
            <!--              <span class="key">{{ key }}</span>-->
            <!--              <span class="colon">&nbsp;:&nbsp;</span>-->
            <!--              <span class="value">-->
            <!--                {{ value }}-->
            <!--              </span>-->
            <!--            </p>-->
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
