<script setup lang="ts">
import LzyIcon from "@/components/LzyIcon.vue";
import { deletePictureBedImage, getPictureBedImageList } from "@/api/toolkit.ts";
import { message, Modal, UploadChangeParam } from "ant-design-vue";
import { PictureBedType } from "@/typings/PictureBedType.ts";
import { createVNode } from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { getBase64, formatBytes, randomPassword } from "@/utils";
import { getFileChunks, uploadFileChunks } from "@/utils/fileChunksUpload";
import { updateSystemConfig } from "@/api/system";
import { useUserInfoState } from "@/store/useUserInfoStore";
interface Props {
  type?: string;
  isSelector?: boolean;
  previewStyle?: any;
}

const userStore = useUserInfoState();

const props = withDefaults(defineProps<Props>(), {
  type: "all",
  isSelector: false,
  previewStyle: {},
});

const emit = defineEmits(["select"]);

const selectImageResult = ref<string>("");

// 是否正在上传
const uploading = ref(false);

// 选择类型弹窗的显示状态
const selectType = ref({
  visible: false,
  val: undefined as any,
  fileBase64: "" as string,
  fileInfo: {} as File,
  compress: true as boolean, // 是否是compress文件
});

// 重新获取的token模态框参数
const token = ref({
  visible: false,
  val: "",
});

// 图片列表筛选
const filterValue = ref(props.type);

// 拖拽上传
const handleDrop = () => {};

// 图片上传前的钩子，让用户选择的当前图片的类别
const beforeUpload = async (file: File) => {

  //从其他组件进入
  if (props.type !== "all") {
    selectType.value.val = props.type;
    selectType.value.fileInfo = file;
    formalUpload();
  } else {
    // 这里可以让用户选择当前图片的类别
    selectType.value.visible = true;
    // 重置选择类型的状态
    selectType.value.val = undefined;
    // 获取图片的 base64 编码
    const fileBase64 = await getBase64(file);
    selectType.value.fileBase64 = String(fileBase64);
    selectType.value.fileInfo = file;
  }

  // 取消上传 走手动上传
  return false;
};

// 要展示的图片列表
const imageList = ref<PictureBedType[]>([]);

// 加载图片列表
const getImageList = async () => {
  const { data } = await getPictureBedImageList({
    type: filterValue.value,
  }).send(true);
  imageList.value = data;
};
getImageList();

// 预览图片
const reserveSeat = ref({
  visible: false,
  url: "",
});

// 设置预览图片的显示状态
const setVisible = (value): void => {
  reserveSeat.value.visible = value;
};

// 打开图片
const openImage = (item: PictureBedType) => {
  if (!props.isSelector) {
    reserveSeat.value.url = item.url;
    reserveSeat.value.visible = true;
  } else {
    selectImageResult.value = item.url;
    emit("select", item.url);
  }
};

// 右键菜单点击事件
const onClick = async (item: PictureBedType, { key }) => {
  if (key == 1) {
    // 打开预览
    openImage(item);
  } else if (key == 2) {
    // 删除图片
    Modal.confirm({
      title: "你确定要删除这张图片吗？",
      icon: createVNode(ExclamationCircleOutlined),
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        return new Promise(async (resolve, _reject) => {
          const result = await deletePictureBedImage({ id: item.id }).send();

          if (!result || result.code !== 200) {
            message.error("删除失败");
            return resolve(true);
          }

          await getImageList();
          message.success(result.data);
          resolve(true);
        }).catch(() => console.log("Oops errors!"));
      },

      onCancel() {},
    });
  } else if (key == 3) {
    // 复制图片地址
    const text = window.location.origin + item.url;
    //将文本通过 clipboard 传入剪切板
    navigator.clipboard.writeText(text).then(
      () => {
        if (!text) return message.error("复制失败，图片地址为空");
        message.success("图片地址已复制到剪切板");
      },
      function (res) {
        console.log("lzy ~ res", res);
      }
    );
  } else if (key == 4) {
    // 下载图片
    const a = document.createElement("a");
    a.href = item.url;
    a.download = item.url;
    a.click();
  } else if (key == 5) {
    //选中当前图片
    emit("select", item.url);
  }
};

// 将图片类型提交至图片中一并提交
const formalUpload = async () => {
  // 是否正在上传
  uploading.value = true;

  selectType.value.visible = false;
  const formData = new FormData();
  formData.append("upload-image", selectType.value.fileInfo);
  formData.append("type", selectType.value.val);
  formData.append("compress", String(selectType.value.compress));
  formData.append("taskId", userStore.userInfo.uid + randomPassword(16));

  const chunks = getFileChunks(formData, "upload-image", 1);

  const res = await uploadFileChunks(chunks, formData, "upload-image");
  if (res === "success") {
    message.success(`${res} 文件上传成功`);
    getImageList();
  } else if (res.includes("token失效")) {
    token.value.visible = true;
  } else {
    message.error(`${res} 文件上传失败。`);
  }
  uploading.value = false;
};

// 图片分类列表
const pictureTypeList = [
  { label: "文章", value: "blog" },
  { label: "头像", value: "head" },
  { label: "懒加载图片", value: "loading" },
  { label: "背景", value: "background" },
  { label: "其他", value: "other" },
];

// 跳转至图床登录页
const getTokenHref = () => {
  //复制代码
  navigator.clipboard
    .writeText(
      `
      async function setupTokenCopyButton(buttonSelector, statusSelector) {
        const copyButton = document.querySelector(buttonSelector);
        const statusElement = document.querySelector(statusSelector);

        // 如果找不到按钮或状态显示元素，则退出
        if (!copyButton) {
          return;
        }

        // 确保状态显示元素存在，如果不存在则创建一个临时的
        let tempStatusElement = null;
        if (!statusElement) {
          tempStatusElement = document.createElement("p");
          tempStatusElement.style.marginLeft = "10px"; // 简单样式
          tempStatusElement.style.display = "inline-block";
          copyButton.parentNode.insertBefore(tempStatusElement, copyButton.nextSibling);
        }
        const displayElement = statusElement || tempStatusElement;

        // 为按钮添加点击事件监听器
        copyButton.addEventListener("click", async () => {
          // 清除之前的状态
          if (displayElement) displayElement.textContent = "正在获取 Token...";

          try {
            // 1. 从 cookieStore 获取 token
            const data = await cookieStore.get("omaccesstoken");

            if (data && data.value) {
              const tokenValue = data.value;

              // 2. 尝试复制到剪贴板
              try {
                await navigator.clipboard.writeText(tokenValue);
                if (displayElement) displayElement.textContent = "✅ Token 已复制！";
                // 可以在这里设置一个定时器，让提示消息自动消失
                setTimeout(() => {
                  if (displayElement) displayElement.textContent = "";
                }, 3000); // 3秒后清除
              } catch (err) {
                console.error("Failed to copy token:", err);
                if (displayElement) displayElement.textContent = "❌ 复制失败！请手动复制。";
                // Fallback 尝试：
                // fallbackCopyTextToClipboard(tokenValue);
                // 如果需要 fallback, 请在此处调用 fallbackCopyTextToClipboard 函数
                console.log("%c请手动复制 Token: + tokenValue", "color: orange;");
              }
            } else {
              // 未找到 token
              if (displayElement) displayElement.textContent = "⚠️ 未找到 Token！";
            }
          } catch (error) {
            // 捕获 cookieStore 或其他操作可能抛出的错误
            console.error("An error occurred:", error);
            if (displayElement) displayElement.textContent = "❌ 操作出错！";
          }
        });
      }

      document.addEventListener("DOMContentLoaded", () => {
        setupTokenCopyButton("#myCopyTokenBtn", "#copyStatus");
      });

      // --- 如果你没有现成的按钮，可以动态创建一个 ---
      function createAndSetupCopyButton() {
        const container = document.body; // 或者选择一个你想要的容器

        const button = document.createElement("button");
        button.id = "generatedCopyTokenButton"; // 给它一个 ID
        button.textContent = "复制 Token";
        button.style.margin = "10px"; // 简单样式
        button.style.fontSize = "50px"; // 简单样式

        button.style.position = "fixed";
        button.style.top = "50%";
        button.style.left = "50%";
        button.style.transform = "translate(-50%, -50%)";

        const statusMsg = document.createElement("p");
        statusMsg.id = "generatedCopyStatus";
        statusMsg.style.marginLeft = "10px";
        statusMsg.style.display = "inline-block";
        statusMsg.style.color = "#666";
        statusMsg.style.position = "fixed";
        statusMsg.style.top = "55%";
        statusMsg.style.left = "50%";
        statusMsg.style.transform = "translate(-50%, -50%)";
        statusMsg.style.background = "#eee"


        container.appendChild(button);
        container.appendChild(statusMsg);

        // 然后设置复制功能
        setupTokenCopyButton("#generatedCopyTokenButton", "#generatedCopyStatus");
      }

      // 如果你想动态创建一个按钮，可以调用这个函数
      createAndSetupCopyButton();
    `
    )
    .then(() => {
      window.open("https://om.qq.com/userAuth/index", "_blank");
    });
};

// 提交新token
const submitToken = async () => {
  const res = await updateSystemConfig({
    config_id: 6,
    config_key: "picture_bed_token",
    config_type: "string",
    config_value: token.value.val,
  });
  message.success(res.data);
  if (res.code === 200) {
    // 刷新页面
    window.location.reload();
  }
};
</script>

<template>
  <div style="height: 100%">
    <ACard
      class="resources"
      :body-style="{
        height: '100%',
        display: 'grid',
        gridTemplateRows: '0 0 auto 30px 1fr 0',
        gap: '10px',
        paddingTop: '0px',
      }"
    >
      <!--   放大预览占位元素   -->
      <a-image
        :style="{ display: 'none' }"
        :preview="{
          visible: reserveSeat.visible,
          onVisibleChange: setVisible,
        }"
        :src="reserveSeat.url"
      />

      <!--   图片上传功能元素   -->
      <a-upload-dragger
        withCredentials
        :showUploadList="false"
        :multiple="true"
        :beforeUpload="beforeUpload"
        :disabled="uploading"
      >
        <p class="ant-upload-drag-icon">
          <LzyIcon v-if="!uploading" size="50" name="hugeicons:image-01" />
          <template v-else>
            <LzyIcon size="50" name="line-md:uploading-loop" />
            <span>上传中...</span>
          </template>
        </p>
        <p class="ant-upload-text">单击或拖动文件到此区域进行上传</p>
        <p class="ant-upload-hint">支持单次或批量上传。严禁上传 公司数据或其他频段文件</p>
      </a-upload-dragger>
      <!--   图片列表筛选   -->
      <ASpace :size="20">
        <a-select
          v-model:value="filterValue"
          style="width: 120px"
          :options="[
            {
              label: '全部',
              value: 'all',
            },
            ...pictureTypeList,
          ]"
          @change="getImageList"
        >
          <template #suffixIcon>
            <LzyIcon size="20" name="iconoir:filter-alt" />
          </template>
        </a-select>
        <span>{{ imageList.length }}张图片</span>
      </ASpace>
      <!--   图片列表   -->
      <div class="preview" :style="previewStyle">
        <a-dropdown :trigger="['contextmenu']" v-for="item in imageList">
          <div
            :class="{ active: item.url === selectImageResult }"
            @click="openImage(item)"
          >
            <img
              height="140px"
              class="preview-item"
              :src="item.url"
              onerror="this.src='error.png'"
              alt="右键操作图片"
              :data-title="item.id"
            />
          </div>
          <template #overlay>
            <a-menu @click="(arg) => onClick(item, arg)">
              <a-menu-item key="1">打开预览</a-menu-item>
              <a-menu-item key="2">删除图片</a-menu-item>
              <a-menu-item key="3">复制图片地址</a-menu-item>
              <a-menu-item key="4">下载图片</a-menu-item>
              <a-menu-item key="5" v-if="props.isSelector">使用图片</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </ACard>

    <a-modal v-model:open="selectType.visible" :closable="false" :footer="null">
      <div class="select-type">
        <!-- 图片分类选择器 -->
        <h2 style="margin: 0; text-align: center">确认图片信息</h2>
        <div class="info">
          <img :src="selectType.fileBase64" alt="" />
          <p>
            图片大小： <span> {{ formatBytes(selectType.fileInfo.size) }} </span>
          </p>
          <p>
            图片类型： <span> {{ selectType.fileInfo.type }} </span>
          </p>
          <p>
            图片名称： <span> {{ selectType.fileInfo.name }} </span>
          </p>
        </div>
        选择图片要存放类型：
        <ASelect
          v-model:value="selectType.val"
          style="width: 100%"
          placeholder="选择图片要存放类型"
        >
          <ASelectOption
            v-for="item in pictureTypeList"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </ASelectOption>
        </ASelect>

        <a-switch
          v-model:checked="selectType.compress"
          checked-children="压缩图片：开"
          un-checked-children="压缩图片：关"
          style="margin-top: 10px"
        />

        <AButton
          type="primary"
          :loading="uploading"
          :disabled="!selectType.val"
          @click="formalUpload"
        >
          确定
        </AButton>
      </div>
    </a-modal>

    <!-- token失效 获取token 模态框 -->
    <a-modal v-model:open="token.visible" :closable="false" :footer="null">
      <div class="select-type">
        <h2>提示</h2>

        <p style="margin-bottom: 10px">
          Token失效，请前往腾讯图床进行登录并获取新的Token 是否立即前往获取？
          <span style="color: #999"
            >（复制代码前往，登陆之后打开开发者工具F12 粘贴代码 即可获取Token）</span
          >
        </p>

        <AInput v-model:value="token.val" placeholder="输入获取回来的Token"></AInput>

        <div class="tools">
          <AButton
            type="primary"
            :loading="uploading"
            :disabled="!selectType.val"
            @click="token.visible = false"
          >
            取消
          </AButton>
          <AButton type="primary" @click="getTokenHref"> 前往获取 </AButton>

          <AButton
            type="primary"
            :loading="uploading"
            :disabled="!selectType.val"
            @click="submitToken"
          >
            提交Token
          </AButton>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.resources {
  .ant-upload-drag-icon {
    filter: drop-shadow(1px 2px 1px var(--themeColor));
    display: grid;
    justify-content: center;

    svg {
      filter: drop-shadow(2px 2px 1px #fff);
    }
  }

  .ant-upload-hint {
    color: var(--color-text-secondary) !important;
  }
}

@media screen and (max-width: 768px) {
  :deep(.ant-upload-btn) {
    .ant-upload-text,
    .ant-upload-hint {
      display: none !important;
    }
  }
}
</style>
<style>
.resources {
  height: 100%;

  .preview {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    grid-template-rows: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
    height: 100%;
    padding: 3px;

    overflow-y: auto;
    border-radius: 10px;

    .active {
      position: relative;
      height: 140px;

      &::before {
        content: "√";
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #00ff77;
        font-size: 40px;
        font-family: cursive;
        inset: 0;
        border-radius: 8px;
        z-index: 1;
        box-shadow: inset 1px 0px 38px 10px #31ff91;
      }
    }

    .preview-item {
      border-radius: 8px;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
      object-fit: cover;
      background: var(--themeColor);
      cursor: pointer;
      transition: 0.3s;
      width: 100%;

      &:hover {
        filter: brightness(0.8);
      }
    }

    &:hover {
      &::-webkit-scrollbar-thumb {
        background: var(--themeColor) !important;
      }
    }

    &::-webkit-scrollbar-thumb {
      background: transparent !important;
    }
  }
}

.select-type {
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;

  img {
    height: 100%;
    max-height: 200px;
    width: 100%;
    object-fit: contain;
    background-color: #999;
  }
  p {
    margin: 0;
    span {
      text-decoration: solid underline;
      user-select: all;
    }
    &:nth-child(2) {
      margin-top: 10px;
    }
    &:last-child {
      margin-bottom: 10px;
    }
  }

  .tools {
    margin-top: 10px;
    display: flex;
    gap: 20px;
    justify-content: end;
  }
}
</style>
