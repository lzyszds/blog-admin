<script setup lang="ts">
import LzyIcon from "@/components/LzyIcon.vue";
import {
  deletePictureBedImage,
  getPictureBedImageList,
} from "@/api/toolkit.ts";
import { message, UploadChangeParam } from "ant-design-vue";
import { PictureBedType } from "@/typings/PictureBedType.ts";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// 是否正在上传
const uploading = ref(false);

// 拖拽上传
const handleDrop = () => {};

const handleChange = (info: UploadChangeParam) => {
  // 是否正在上传
  uploading.value = info.file.status === "uploading";
  if (info.file.status === "done") {
    message.success(`${info.file.name} 文件上传成功`);
    getImageList();
  } else if (info.file.status === "error") {
    message.error(`${info.file.name} 文件上传失败。`);
  }
};

// 要展示的图片列表
const imageList = ref<PictureBedType[]>([]);

const getImageList = async () => {
  const { data } = await getPictureBedImageList();
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
  reserveSeat.value.url = item.url;
  reserveSeat.value.visible = true;
};

// 右键菜单点击事件
const onClick = async (item: PictureBedType, { key, domEvent }) => {
  console.log(key, domEvent);
  if (key == 1) {
    openImage(item);
  } else if (key == 2) {
    await deletePictureBedImage({ id: item.id });
    await getImageList();
  } else if (key == 3) {
    const text = window.location.origin + item.url;
    //将文本通过 clipboard 传入剪切板
    navigator.clipboard.writeText(text).then(
      () => {
        if (!text) return message.error("复制失败，图片地址为空");
        message.success("图片地址已复制到剪切板");
      },
      function (res) {
        console.log("lzy ~ res", res);
      },
    );
  }else if (key == 4) {
    const a = document.createElement("a");
    a.href = item.url;
    a.download = item.url;
    a.click();
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
        gridTemplateRows: '0 0 auto 1fr 0',
        gap: '10px',
      }"
    >
      <a-image
        :style="{ display: 'none' }"
        :preview="{
          visible: reserveSeat.visible,
          onVisibleChange: setVisible,
        }"
        :src="reserveSeat.url"
      />
      <a-upload-dragger
        :action="BASE_URL + '/api/toolkit/uploadImageToPictureBed'"
        name="upload-image"
        withCredentials
        :showUploadList="false"
        :multiple="true"
        @change="handleChange"
        @drop="handleDrop"
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
        <p class="ant-upload-hint">
          支持单次或批量上传。严禁上传 公司数据或其他频段文件
        </p>
      </a-upload-dragger>

      <div class="preview">
        <a-dropdown :trigger="['contextmenu']" v-for="item in imageList">
          <img
            height="180px"
            :src="item.url"
            class="preview-item"
            onerror="this.src='error.png'"
            @click="openImage(item)"
            alt="右键操作图片"
          />
          <template #overlay>
            <a-menu @click="(arg) => onClick(item, arg)">
              <a-menu-item key="1">打开预览</a-menu-item>
              <a-menu-item key="2">删除图片</a-menu-item>
              <a-menu-item key="3">复制图片地址</a-menu-item>
              <a-menu-item key="4">下载图片</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </ACard>
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
</style>
<style>
.resources {
  height: 100%;

  .preview {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 10px;
    height: 100%;
    padding-top: 3px;
    padding-right: 3px;
    overflow-y: auto;
    border-radius: 10px;

    .preview-item {
      border-radius: 8px;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
      object-fit: cover;
      background: var(--themeColor);
      width: 100%;
      cursor: pointer;
      transition: 0.3s;

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
</style>
