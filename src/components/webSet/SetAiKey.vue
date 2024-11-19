<script lang="ts" setup>
import { AiKeyType } from "@/typings/WebSetType";
import { cloneDeep } from "lodash";
import { message, TableProps } from "ant-design-vue";
import { UnwrapRef } from "vue";
import { addAiKeyApi, getAiKeysList, updateAiKeyApi } from "@/api/openAi";

// 获取AI Key列表
const getAiKeyListHandle = async () => {
  const { data, code, msg } = await getAiKeysList();
  if (code == 200) {
    return data;
  } else {
    message.error(msg);
    return [];
  }
};
// 获取AI Key列表
const result = await getAiKeyListHandle();
// 将获取到的数据赋值给data
const data = ref([...result]);

// 定义分页配置
const paginationConfig = ref({
  pageSize: 8,
  current: 1,
  total: result.length,
});

// 定义可编辑的数据
const editableData: UnwrapRef<Record<string, AiKeyType>> = reactive({});

const addAiKey = () => {
  //如果当前已经有新增的列还没进行保存 则不进行新增
  if (editableData["undefined"]) {
    return message.error("请先保存要新增的数据内容，一次只能增加一条");
  }
  // 将数据添加到data中
  data.value.push({}) && edit({} as any);
};

// 修改
const edit = (record: AiKeyType) => {
  const { keyName } = record;
  // 将数据深拷贝到editableData中
  editableData[keyName] = cloneDeep(
    data.value.filter((item) => keyName === item.keyName)[0],
  );
};

// 将要修改的内容进行保存
const editSave = (record: AiKeyType) => {
  const { id, keyName } = record;

  // 将editableData中的数据赋值给data
  Object.assign(
    data.value.filter((item) => keyName === item.keyName)[0],
    editableData[keyName],
  );

  // 如果keyValue为空，则提示用户输入
  if (!editableData[keyName].keyValue || !editableData[keyName].keyName) {
    return message.error("keyName和keyValue不能为空");
  }

  const requestApi = id ? updateAiKeyApi : addAiKeyApi;
  // 调用addAiKeyApi接口，将数据保存到服务器
  requestApi(editableData[keyName]).then(async (res) => {
    if (res.code == 200) {
      message.success("修改成功");
      //更新表格数据
      data.value = [...(await getAiKeyListHandle())];
      // 删除editableData中的数据
      delete editableData[keyName];
    } else {
      message.error(res.msg);
    }
  });
};

// 取消
const cancel = (record: AiKeyType) => {
  if (!record.id) {
    // 删除data中的数据
    data.value = data.value.filter((item) => item.keyName !== record.keyName);
  }
  // 删除editableData中的数据
  delete editableData[record.keyName];
};

// 定义表格列
const columns = ref<TableProps["columns"]>([
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
    width: 70,
  },
  {
    title: "keyName",
    dataIndex: "keyName",
    key: "keyName",
    width: 100,
  },
  {
    title: "keyValue",
    dataIndex: "keyValue",
    key: "keyValue",
    ellipsis: true,
    width: 350,
  },
  {
    title: "来源",
    dataIndex: "keySource",
    key: "keySource",
    ellipsis: true,
    width: 300,
  },
  {
    title: "说明",
    dataIndex: "keySourceType",
    key: "keySourceType",
    ellipsis: true,
    width: 120,
  },
  {
    title: "操作",
    key: "action",
    width: 110,
    align: "center",
    // slots: {customRender: "action"},
  },
]);

// 判断是否显示输入框
const inputShow = (column) => {
  return ["keyName", "keyValue", "keySource", "keySourceType"].includes(
    column.dataIndex,
  );
};

// 监听分页配置中的current值的变化
watch(
  () => paginationConfig.value.current,
  (newVal) => {
    if (!newVal) return;
    // 根据分页配置中的current值，截取data中的数据
    data.value = [...result].slice(
      (newVal - 1) * paginationConfig.value.pageSize,
      newVal * paginationConfig.value.pageSize,
    );
  },
  { immediate: true },
);
</script>

<template>
  <div class="setSystem">
    <ATable
      :columns="columns"
      :data-source="data"
      :pagination="false"
      :scroll="{ x: 750, y: 475 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="inputShow(column) && editableData[record.keyName]">
          <a-input
            v-model:value="editableData[record.keyName][column.dataIndex]"
            size="small"
            :disabled="record.keyName === 'load_animation_gif'"
          />
        </template>

        <template v-else-if="column.key === 'keySource'">
          <a-tooltip placement="bottom">
            <template #title>
              <span>点击前往查看</span>
            </template>
            <a :href="record.keySource" target="_blank">
              {{ record.keySource }}
            </a>
          </a-tooltip>
        </template>

        <template v-else-if="column.key === 'action'">
          <div class="editable-row-operations">
            <span v-if="editableData[record.keyName]">
              <a-typography-link>
                <AButton size="small" type="primary" @click="editSave(record)">
                  保存
                </AButton>
              </a-typography-link>
              <a-popconfirm title="确定取消?" @confirm="cancel(record)">
                <AButton size="small" danger @click="edit(record)">
                  取消
                </AButton>
              </a-popconfirm>
            </span>
            <AButton v-else size="small" type="primary" @click="edit(record)">
              修改
            </AButton>
          </div>
        </template>
      </template>
      <template #footer>
        <section class="tableFooter">
          <AButton type="primary" @click="addAiKey"> 添加更多</AButton>
          <APagination
            size="small"
            v-model="paginationConfig.current"
            :total="paginationConfig.total"
            :page-size="paginationConfig.pageSize"
            @change="(value) => (paginationConfig.current = value)"
          ></APagination>
        </section>
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

  :deep(.ant-table-footer) {
    background: transparent;
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

  .tableFooter {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.formAikey {
  padding: 20px 20px 5px;
}
</style>
