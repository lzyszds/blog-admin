<script setup lang="ts">
import LzyIcon from "@/components/LzyIcon.vue";
import { getPictureBedImageList } from "@/api/toolkit.ts";
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
</script>

<template>
  <ACard class="resources">
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
      <a-image
        height="180px"
        v-for="item in imageList"
        :src="item.url"
        class="preview-item"
      />
    </div>
  </ACard>
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
  .preview {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 10px;
    margin-top: 40px;

    .preview-item {
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, .5);
      object-fit: cover;
      background: var(--themeColor);
    }

    .ant-image-mask {
      border-radius: 8px !important;
    }
  }
}
</style>
