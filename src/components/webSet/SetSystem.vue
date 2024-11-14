<script setup lang="ts">
import { WebSystemType } from "@/typings/WebSetType";
import { cloneDeep, differenceWith, isEqual } from "lodash";

const { result } = defineProps<{
  result: WebSystemType[];
}>();

const data = ref(cloneDeep(result));

const emit = defineEmits(["updateSystemData"]);

const addAiKey = () => {
  data.value.push({
    config_desc: "",
    config_id: 0,
    config_key: "",
    config_value: "",
    config_type: "string",
  });
};

// 保存
const save = () => {
  const diffArr = differenceWith(data.value, result, isEqual);
  emit("updateSystemData", diffArr);
};

const handleDelect = (scope: any) => {
  data.value.splice(scope.$index, 1);
};
</script>

<template>
  <div class="setSystem">
    <ElTable :data="data" class="aiKeyTable">
      <ElTableColumn label="key" width="200">
        <template #default="scope">
          <ElInput v-model="scope.row.config_key" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="value">
        <template #default="{ row }">
          <ElInput v-if="row.config_type == 'string'" v-model="row.config_value" />
          <div v-else class="img-box">
            <ElUpload :limit="1" :auto-upload="false" list-type="picture-card">
              <img v-if="row.config_value" :src="'hono/static' + row.config_value" />
            </ElUpload>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn label="类型" width="120">
        <template #default="scope">
          <ElSelect v-model="scope.row.config_type" placeholder="请选择">
            <ElOption label="字符串" value="string" />
            <ElOption label="图片" value="image" />
          </ElSelect>
        </template>
      </ElTableColumn>
      <ElTableColumn label="说明">
        <template #default="scope">
          <ElInput v-model="scope.row.config_desc" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="80px" center>
        <template #default="scope">
          <ElButton type="text" @click="handleDelect(scope)">删除</ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
    <div class="aiKeyTools">
      <ElButton type="primary" @click="addAiKey"> 添加更多 </ElButton>
      <ElButton type="primary" @click="save"> 保存设置 </ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setSystem {
  overflow-y: auto;
  padding: 10px;
  :deep(.el-table__inner-wrapper) {
    padding-bottom: 20px;
  }
  :deep(.el-upload-list--picture-card) {
    display: flex;
  }
  :deep(.el-upload.el-upload--picture-card) {
    width: 200%;
    height: 90%;
    padding: 10px;
    img {
      flex: 1;
      height: auto;
      max-height: 100px;
      border-radius: 10px;
      object-fit: cover;
    }
  }
}
</style>
