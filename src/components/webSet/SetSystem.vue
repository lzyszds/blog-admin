<script lang="ts" setup>
import { WebSystemType } from "@/typings/WebSetType";
import { cloneDeep } from "lodash";
import { message, TableProps } from "ant-design-vue";
import { UnwrapRef } from "vue";

const { result } = defineProps<{ result: WebSystemType[] }>();

const data = ref(cloneDeep(result));

const editableData: UnwrapRef<Record<string, WebSystemType>> = reactive({});

const emit = defineEmits(["updateSystemData"]);

// 修改
const edit = (record: WebSystemType) => {
  const { configKey } = record;
  editableData[configKey] = cloneDeep(
    data.value.filter((item) => configKey === item.configKey)[0]
  );
};

// 保存
const save = (record: WebSystemType) => {
  if (record.configKey == "load_animation_gif")
    return message.error("加载动画不可修改,请前往图片懒加载设置修改");
  const { configKey } = record;
  const arr = Object.assign(
    data.value.filter((item) => configKey === item.configKey)[0],
    editableData[configKey]
  );

  delete editableData[configKey];
  emit("updateSystemData", {
    config_value: arr.configValue,
    config_id: arr.configId,
    config_key: arr.configKey,
    config_type: arr.configType,
    config_desc: arr.configDesc,
  });
};

const cancel = (record: WebSystemType) => {
  delete editableData[record.configKey];
};

const columns = ref<TableProps["columns"]>([
  {
    title: "key",
    dataIndex: "configKey",
    key: "configKey",
    width: 200,
  },
  {
    title: "value",
    dataIndex: "configValue",
    key: "configValue",
    ellipsis: true,
    width: 350,
  },
  {
    title: "类型",
    dataIndex: "configType",
    key: "configType",
    width: 100,
  },
  {
    title: "说明",
    dataIndex: "configDesc",
    key: "configDesc",
    width: 200,
  },
  {
    title: "操作",
    key: "action",
    width: 110,
    align: "center",
    // slots: {customRender: "action"},
  },
]);

const inputShow = (column) => {
  return ["configKey", "configValue", "configDesc"].includes(column.dataIndex);
};

const selectOption = [
  { value: "string", label: "字符串" },
  { value: "image", label: "图片" },
];

const selectShow = (column) => {
  return ["configType"].includes(column.dataIndex);
};
</script>

<template>
  <div class="setSystem">
    <ATable
      :columns="columns"
      :data-source="data"
      :pagination="{ size: 'small' }"
      :scroll="{ x: 750, y: 475 }"
    >
      <template #bodyCell="{ column, record, text }">
        <!-- key 和 value -->
        <template v-if="inputShow(column) && editableData[record.configKey]">
          <a-input
            v-model:value="editableData[record.configKey][column.dataIndex]"
            size="small"
            :disabled="record.configKey === 'load_animation_gif'"
          />
        </template>
        <!-- 类型 -->
        <template v-if="selectShow(column)">
          <ASelect
            v-if="editableData[record.configKey]"
            v-model:value="editableData[record.configKey][column.dataIndex]"
            size="small"
            style="width: 80px"
            :disabled="record.configKey === 'load_animation_gif'"
          >
            <ASelectOption
              v-for="item in selectOption"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </ASelectOption>
          </ASelect>
          <span v-else>
            {{ selectOption.filter((item) => item.value == text)[0].label }}
          </span>
        </template>

        <template v-else-if="column.key === 'action'">
          <div class="editable-row-operations">
            <span v-if="editableData[record.configKey]">
              <a-typography-link>
                <AButton size="small" type="primary" @click="save(record)">
                  保存
                </AButton>
              </a-typography-link>
              <a-popconfirm title="确定取消?" @confirm="cancel(record)">
                <AButton size="small" danger @click="edit(record)"> 取消 </AButton>
              </a-popconfirm>
            </span>
            <AButton v-else size="small" type="primary" @click="edit(record)">
              修改
            </AButton>
          </div>
        </template>
      </template>
    </ATable>
  </div>
</template>

<style scoped>
.setSystem {
  overflow: hidden;
  overflow-y: auto;
  padding: 10px;
  height: 100%;

  .ant-table-wrapper {
    flex: 1 1 0;
  }

  .editable-row-operations {
    display: flex;
    gap: 10px;
    justify-content: center;

    span {
      display: flex;
      gap: 10px;
    }

    button {
      font-size: 12px;
    }
  }
}
</style>
