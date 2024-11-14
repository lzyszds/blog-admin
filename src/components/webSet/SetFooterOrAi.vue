<script setup lang="ts">
import { addFooterInfo, getFooterInfo, updateFooterInfo } from "@/api/system";
import { message, notification } from "ant-design-vue";

const footerRefData = ref(); //页脚数据

const footerVisible = ref(false); //页脚弹窗是否显示
const footerNewForm = reactive({
  footer_type: 1,
  footer_content: "",
  footer_url: "",
  footer_order: 0,
}); //页脚新表单

async function getFooterInfoList() {
  footerRefData.value = await getFooterInfo();
}
getFooterInfoList();

const append = (data: any) => {
  footerVisible.value = true;
  if (data) {
    footerNewForm.footer_type = data.footer_content;
    footerNewForm.footer_order = data.footer_order;
  }
};
function addFormFooter() {
  addFooterInfo({
    footer_type: footerNewForm.footer_type,
    footer_content: footerNewForm.footer_content,
    footer_url: footerNewForm.footer_url,
    footer_order: footerNewForm.footer_order,
  }).then(async (res) => {
    message[res.code == 200 ? "success" : "error"](res.msg!);
    await getFooterInfoList();
    footerVisible.value = false;
  });
}

const remove = (node: Node, data: any) => {
  //@ts-ignore
  const parent = node.parent;
  const children: any[] = parent.data.children || parent.data;
  const index = children.findIndex((d) => d.footer_id === data.footer_id);
  children.splice(index, 1);
  footerRefData.value = [...footerRefData.value];
};

const save = async (data) => {
  const result = await updateFooterInfo(data);
  if (result.code === 200) {
    notification.info({
      message: result.msg,
    });
  }
};

//通过数据返回当前节点的级别
const getLevel = (data: any) => {
  if (data.footer_content == "页脚数据设置") {
    return 1;
  } else if (!data.footer_url) {
    return 2;
  } else {
    return 3;
  }
};
</script>

<template>
  <div class="setFooterOrAi">
    <div class="setFooter">
      <h3 class="header">页脚数据设置</h3>
      <ElDialog v-model="footerVisible" :show-close="false" width="500">
        <template #header="{ close }">
          <div class="my-header">
            <h1 style="margin: 0">页脚数据设置</h1>
            <LzyBtn name="gg:close" @click="close"></LzyBtn>
          </div>
        </template>
        <ElForm>
          <ElFormItem label="页脚类型">
            <ElInput v-model="footerNewForm.footer_type" disabled />
          </ElFormItem>
          <ElFormItem label="页脚级别">
            <ElInput v-model="footerNewForm.footer_order" disabled />
          </ElFormItem>

          <ElFormItem label="页脚内容">
            <ElInput v-model="footerNewForm.footer_content" />
          </ElFormItem>
          <ElFormItem label="页脚链接">
            <ElInput v-model="footerNewForm.footer_url" />
          </ElFormItem>
        </ElForm>
        <template #footer>
          <ElButton @click="footerVisible = false">取 消</ElButton>
          <ElButton type="primary" @click.stop="addFormFooter">保存设置</ElButton>
        </template>
      </ElDialog>
      <el-tree
        style="max-width: 800px"
        :data="footerRefData"
        node-key="footer_id"
        default-expand-all
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span v-if="getLevel(data) === 1">{{ data.footer_content }}</span>
            <ElInput v-else v-model="data.footer_content" size="small" />
            <ElInput v-if="data.footer_url" v-model="data.footer_url" size="small" />
            <span>
              <ElButton
                type="primary"
                size="small"
                v-if="getLevel(data) === 1"
                @click.stop="save(data)"
              >
                保存设置
              </ElButton>
              <ElButton
                type="danger"
                size="small"
                v-if="getLevel(data) !== 1"
                @click.stop="remove(node, data)"
              >
                删除
              </ElButton>
              <ElButton
                type="primary"
                size="small"
                v-if="getLevel(data) !== 3"
                @click.stop="append(data)"
              >
                新增
              </ElButton>
            </span>
          </span>
        </template>
      </el-tree>
      <div class="tools">
        <ElButton type="primary" size="small" @click.stop="append">新增</ElButton>
        <ElButton type="primary" size="small" @click.stop="save(footerRefData)">
          保存设置
        </ElButton>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  gap: 5px;
  & .el-input:nth-child(1) {
    width: 200px;
  }
}
</style>
<style lang="scss" scoped>
.setFooterOrAi {
  display: flex;
  width: 100%;
  h3.header {
    text-align: center;
    margin: 0;
    padding: 10px;
    background-color: var(--themeColor);
    color: #fff;
  }
  .setFooter {
    width: 50%;
    border: 3px solid var(--themeColor);
    border-left: none;
    border-radius: 0;
    padding: 0;
    position: relative;
    border-radius: 0 10px 10px 0;

    .el-tree {
      height: 370px;
      overflow-y: auto;
      margin: 0 auto;
      padding: 10px;
    }
    .tools {
      position: absolute;
      bottom: 0;
      display: flex;
      padding: 10px;
      background-color: #fff;
    }
  }
}

.my-header {
  display: flex;
  justify-content: space-between;
}
</style>
