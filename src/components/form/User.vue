<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { Rule } from "ant-design-vue/es/form";

type ModalParamsType = {
  modalParams: {
    isOpen: boolean;
    title: string;
    params: {};
    sureCallback: {
      callback: () => (params: any) => Promise<any>;
      refreshData: any;
    };
  };
};

const { modalParams } = defineProps<ModalParamsType>();

const form = reactive({
  name: "",
  url: "",
  owner: "",
  type: "",
  approver: "",
  dateTime: null,
  description: "",
});

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: "Please enter user name" }],
  url: [{ required: true, message: "please enter url" }],
  owner: [{ required: true, message: "Please select an owner" }],
  type: [{ required: true, message: "Please choose the type" }],
  approver: [{ required: true, message: "Please choose the approver" }],
  dateTime: [{ required: true, message: "Please choose the dateTime", type: "object" }],
  description: [{ required: true, message: "Please enter url description" }],
};

const onClose = () => {
  modalParams.isOpen = false;
};
</script>

<template>
  <ADrawer
    :title="modalParams.title"
    :width="720"
    :open="modalParams.isOpen"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <Aform :model="form" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <ACol :span="12">
          <AformItem label="Name" name="name">
            <AInput v-model:value="form.name" placeholder="Please enter user name" />
          </AformItem>
        </ACol>
        <ACol :span="12">
          <AformItem label="Url" name="url">
            <AInput
              v-model:value="form.url"
              style="width: 100%"
              addon-before="http://"
              addon-after=".com"
              placeholder="please enter url"
            />
          </AformItem>
        </ACol>
      </a-row>
      <a-row :gutter="16">
        <ACol :span="12">
          <AformItem label="Owner" name="owner">
            <ASelect v-model:value="form.owner" placeholder="Please AS an owner">
              <ASelect-option value="xiao">Xiaoxiao Fu</ASelect-option>
              <ASelect-option value="mao">Maomao Zhou</ASelect-option>
            </ASelect>
          </AformItem>
        </ACol>
        <ACol :span="12">
          <AformItem label="Type" name="type">
            <ASelect v-model:value="form.type" placeholder="Please choose the type">
              <ASelect-option value="private">Private</ASelect-option>
              <ASelect-option value="public">Public</ASelect-option>
            </ASelect>
          </AformItem>
        </ACol>
      </a-row>
      <a-row :gutter="16">
        <ACol :span="12">
          <AformItem label="Approver" name="approver">
            <ASelect
              v-model:value="form.approver"
              placeholder="Please choose the approver"
            >
              <ASelect-option value="jack">Jack Ma</ASelect-option>
              <ASelect-option value="tom">Tom Liu</ASelect-option>
            </ASelect>
          </AformItem>
        </ACol>
        <ACol :span="12">
          <AformItem label="DateTime" name="dateTime">
            <a-date-picker
              v-model:value="form.dateTime"
              style="width: 100%"
              :get-popup-container="(trigger) => trigger.parentElement"
            />
          </AformItem>
        </ACol>
      </a-row>
      <a-row :gutter="16">
        <ACol :span="24">
          <AformItem label="Description" name="description">
            <a-textarea
              v-model:value="form.description"
              :rows="4"
              placeholder="please enter url description"
            />
          </AformItem>
        </ACol>
      </a-row>
    </Aform>
    <template #extra>
      <ASpace>
        <a-button @click="onClose">取消保存</a-button>
        <a-button type="primary" @click="onClose">提交数据</a-button>
      </ASpace>
    </template>
  </ADrawer>
</template>
