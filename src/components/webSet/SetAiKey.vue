<script setup lang="ts">
import { getAiKeysList, addAiKeyApi } from "@/api/openAi";

interface AiKeyType {
  keyName: string;
  keyValue: string;
}

const { data } = await getAiKeysList();

const aiKeyData = ref<AiKeyType[]>([...data]);

//新增项
const addAiKey = () => {
  aiKeyData.value.push({
    keyName: "",
    keyValue: "",
  });
};
//保存
const setUp = async () => {
  //TODO
  addAiKeyApi(aiKeyData.value).then((res) => {
    console.log("🚀 ~ setUp ~ res:", res);
  });
};

//删除
const deleteAiKey = (scope: any) => {
  aiKeyData.value.splice(scope.$index, 1);
};
</script>

<template>
  <div class="setAikey">
    <ElTable :data="aiKeyData" class="aiKeyTable">
      <ElTableColumn prop="keyName" label="AiKey" width="100">
        <template #default="scope">
          <ElInput v-model="scope.row.keyName" />
        </template>
      </ElTableColumn>
      <ElTableColumn prop="keyValue" label="AiValue">
        <template #default="scope">
          <ElInput v-model="scope.row.keyValue" />
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="80px" center>
        <template #default="scope">
          <ElButton type="text" @click="deleteAiKey(scope)">删除</ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
    <div class="aiKeyTools">
      <ElButton type="primary" @click="addAiKey"> 添加更多 </ElButton>
      <ElButton type="primary" @click="setUp"> 保存设置 </ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setAikey {
  border-radius: 10px;
  padding: 10px;
  :deep(.el-table__inner-wrapper) {
    padding-bottom: 20px;
  }
}
</style>
