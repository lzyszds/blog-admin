<script lang="ts" setup>
import type {FormInstance, Rule} from "ant-design-vue/es/form";
import {UserAdmin} from "@/typings/User";
import LzyIcon from "../LzyIcon.vue";
import {message} from "ant-design-vue";
import {optimizeImage, randomPassword} from "@/utils";
import Resources from "@/views/root/Resources.vue";

type ModalParamsType = {
  modalParams: {
    isOpen: boolean;
    title: string;
    params: UserAdmin;
    headimgs: any[];
    sureCallback: {
      uploadHeadImg: Function;
      callback: Function;
      refreshData: Function;
    };
  };
};

const {modalParams} = defineProps<ModalParamsType>();

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};
// 表单Ref dom
const formRef = ref<FormInstance>();
// 表单数据
const formState = ref<UserAdmin>({...modalParams.params});

//资源管理弹窗控制
const resourceModal = ref(false);

formState.value.whetherUse = !formState.value.whetherUse;

//是否为修改表单
const isEdit = !!formState.value.uid;

onMounted(() => {
  // 表单初始化设置
  if (!Object.keys(modalParams.params).length) {
    resetForm();
  } else {
    formState.value.password = "";
    // 如果头像不是推荐的头像，则将头像设置为+号里的背景
    console.log(modalParams.headimgs);

    if (!modalParams.headimgs.find((item) => item.url === formState.value.headImg)) {
      console.log(formState.value.headImg);

      if (formState.value.headImg)
        modalParams.headimgs.push({url: formState.value.headImg});
    }
  }
});

// 表单验证规则
const rules: Record<string, Rule[]> = {
  uname: [
    {required: true, message: "请输入用户昵称", trigger: "blur"},
    {min: 3, max: 16, message: "长度在 3 到 16 个字符", trigger: "blur"},
  ],
  username: [
    {required: true, message: "请输入账号", trigger: "blur"},
    {min: 3, max: 16, message: "长度在 3 到 16 个字符", trigger: "blur"},
  ],
  password: [
    {required: !isEdit, message: "请输入密码", trigger: "blur"},
    {min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur"},
  ],
};

/* 关闭 modal */
const onClose = () => {
  modalParams.isOpen = false;
};

/* 重置表单 */
function resetForm() {
  formState.value = {
    uname: "",
    username: "",
    password: randomPassword(14),
    power: 1,
    headImg: [] as any,
    whetherUse: 0,
    signature: "",
  };
  file.value = undefined;
  //@ts-ignore 删除背景图片样式
  document.querySelector(".upload-headimg .ant-radio-button").style.backgroundImage =
      "none";
}

/* 生成随机密码触发事件 */
const setRomdomPwd = () => {
  /* 生成12-16随机的数字 */
  const difficulty = Math.floor(Math.random() * (16 - 12 + 1)) + 12;
  formState.value.password = randomPassword(difficulty);
};

/* 获取文件系统访问权限 */
const {file} = useFileSystemAccess();

/* 上传头像触发事件 */
const selectImage = (value) => {
  resourceModal.value = false;
  const newUploadHeadImg = document.querySelector("#newUploadHeadImg") as any;
  console.dir(newUploadHeadImg);

  newUploadHeadImg.parentNode.style.backgroundImage = `url(${value})`;
  formState.value.headImg = value;
};

// 提交表单
const onSubmit = async () => {
  /* 先验证表单 */
  await formRef.value!.validateFields();

  const {uploadHeadImg, callback, refreshData} = modalParams.sureCallback;
  /* 提交保存用户信息 并触发以下事件 */
  const nextCallback = () => {
    //处理禁用开关的值 0为禁用 1为启用
    formState.value.whetherUse = formState.value.whetherUse ? 0 : 1;
    console.log(formState.value.createDate);

    if (formState.value.createDate) {
      //处理创建时间，从后端传来的时间，没办法直接传回去
      const date = new Date(formState.value.createDate!);
      formState.value.createDate = date.toISOString().slice(0, 19).replace("T", " ");
    }
    if (formState.value.lastLoginDate) {
      const date = new Date(formState.value.lastLoginDate!);
      formState.value.lastLoginDate = date.toISOString().slice(0, 19).replace("T", " ");
    }
    callback(formState).then(() => {
      message.success("用户信息保存成功！");
      refreshData(true); // 刷新数据
      resetForm(); // 重置表单
      onClose(); //关闭modal
    });
  };

  //@ts-ignore
  if (formState.value.headImg === "none") {
    if (!file.value) return message.error("请选择图片或自行上传头像");
    // 如果文件大小小于300kb，不进行压缩，按比例压缩
    const scale = file.value.size < 300 * 1024 ? 1 : 0.5;
    /* 压缩图片 */
    const {fileCompress} = await optimizeImage(file.value, scale);
    
    /* 将头像上传 */
    uploadHeadImg(fileCompress).then((res) => {
      message.success("头像上传成功 即将保存用户信息！");
      formState.value.headImg = "/static/img/uploadHead/" + res.filename;
      setTimeout(() => {
        // 延时一秒，让背景图片显示
        nextCallback();
      }, 1000);
    });
  } else {
    nextCallback();
  }
};
</script>

<template>
  <ADrawer
      :title="modalParams.title"
      :width="720"
      :open="modalParams.isOpen"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
      destroyOnClose
  >
    <a-form
        ref="formRef"
        :model="formState"
        name="validate_other"
        v-bind="formItemLayout"
    >
      <a-form-item label="选择头像">
        <a-radio-group
            id="headimgRadio"
            v-model:value="formState.headImg"
            button-style="solid"
        >
          <a-radio-button
              v-for="item in modalParams.headimgs"
              :value="item.url"
              :style="{ backgroundImage: `url(${item.url})` }"
          >
            <Transition name="fade">
              <LzyIcon
                  size="18"
                  name="iconoir:check"
                  v-if="item.url === formState.headImg"
                  style="
                  color: #fff;
                  background: var(--themeGreen);
                  border-radius: 10%;
                  padding: 5px;
                "
              />
            </Transition>
          </a-radio-button>
          <a-radio-button
              value="none"
              @click="resourceModal = true"
              class="upload-headimg ant-radio-button-wrapper-checked"
              id="newUploadHeadImg"
          >
            <LzyIcon size="20" name="iconoir:plus"/>
            <p>上传头像</p>
          </a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item name="uname" label="昵称" has-feedback :rules="rules.uname">
        <a-input v-model:value="formState.uname"/>
      </a-form-item>

      <a-form-item name="username" label="账号" has-feedback :rules="rules.username">
        <a-input v-model:value="formState.username"/>
      </a-form-item>

      <a-form-item name="password" label="密码" has-feedback :rules="rules.password">
        <a-input v-model:value="formState.password">
          <template #addonAfter>
            <ATooltip placement="right">
              <template #title>生成随机密码</template>
              <span @click="setRomdomPwd"><LzyIcon name="iconoir:refresh-circle"/></span>
            </ATooltip>
          </template>
        </a-input>
      </a-form-item>

      <a-form-item name="power" label="权限">
        <a-radio-group v-model:value="formState.power" button-style="solid">
          <a-radio-button :value="1">普通用户</a-radio-button>
          <a-radio-button :value="0">管理员</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item name="whetherUse" label="禁用">
        <a-switch v-model:checked="formState.whetherUse"/>
      </a-form-item>

      <a-form-item name="signature" label="签名">
        <a-textarea
            v-model:value="formState.signature"
            max-length="5"
            allow-clear
            :autoSize="{ minRows: 2, maxRows: 6 }"
        />
      </a-form-item>
    </a-form>

    <template #extra>
      <ASpace>
        <a-button @click="onClose">取消保存</a-button>
        <a-button @click="resetForm">重置数据</a-button>
        <a-button type="primary" @click="onSubmit">提交数据</a-button>
      </ASpace>
    </template>
  </ADrawer>

  <AModal v-model:open="resourceModal" width="100%">
    <Resources type="head" :is-selector="true" @select="selectImage" :preview-style="{ maxHeight: '300px' }"/>
  </AModal>
</template>

<style scoped>
#headimgRadio {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  label {
    height: 90px;
    width: 90px;
    border-radius: 10px;
    padding: 0;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border: 1px solid #aaa;
    display: flex;
    align-items: end;
    justify-content: right;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px 0 rgba(0, 0, 0, 0.05);

    & > :deep(span) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      font-family: "dindin";
      color: #888;

      p {
        margin: 0;
      }
    }

    &.ant-radio-button-wrapper-checked {
      background-color: #fafafa;
      border-color: var(--themeColor);
    }

    &:hover {
      border-color: var(--themeColor);

      &.upload-headimg.ant-radio-button-wrapper-checked {
        border-color: var(--themeColor);
      }
    }

    &.upload-headimg.ant-radio-button-wrapper-checked {
      border-color: #aaa;
      align-items: center;
      justify-content: center;
      border-style: dashed;
    }

    &.upload-headimg :hover {
      border-color: #aaa;
    }
  }
}

:deep(.pushImage) {
  .ant-tooltip {
    display: none;
  }
}

:deep(.ant-input-group-addon) {
  padding: 0;
  width: 35px;

  svg {
    cursor: pointer;
    outline: none !important;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.23s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
