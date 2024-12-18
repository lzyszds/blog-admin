<script setup lang="ts">
import LzyIcon from "@/components/LzyIcon.vue";
import { deletePictureBedImage, getPictureBedImageList } from "@/api/toolkit.ts";
import { message, Modal, UploadChangeParam } from "ant-design-vue";
import { PictureBedType } from "@/typings/PictureBedType.ts";
import { createVNode } from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";

interface Props {
  type?: string;
  isSelector?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  type: "all",
  isSelector: false,
});

const emit = defineEmits(["select"]);

const BASE_URL = import.meta.env.VITE_BASE_URL;

const selectImageResult = ref<string>("");

// 是否正在上传
const uploading = ref(false);

// 选择类型弹窗的显示状态
const selectType = ref({
  visible: false,
  val: undefined as any,
  isOk: false,
});

// 图片列表筛选
const filterValue = ref(props.type);

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

// 图片上传前的钩子，让用户选择的当前图片的类别
const beforeUpload = () => {
  // 这里可以让用户选择当前图片的类别
  selectType.value.visible = true;
  // 重置选择类型的状态
  selectType.value.val = undefined;
  selectType.value.isOk = false;

  //任务延时，直到用户选择了图片的类型
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (selectType.value.isOk && selectType.value.val) {
        clearInterval(timer);
        resolve(true);
      }
    }, 100);
  });
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
    // emit("select", item.url);
    selectImageResult.value = item.url;
  }
};

// 右键菜单点击事件
const onClick = async (item: PictureBedType, { key, domEvent }) => {
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
          await deletePictureBedImage({ id: item.id });
          await getImageList();
          resolve(true);
          message.success("删除成功");
        }).catch(() => console.log("Oops errors!"));
      },

      onCancel() {
        console.log("Cancel");
      },
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
const onOk = () => {
  selectType.value.visible = false;
  selectType.value.isOk = true;
};

// 图片分类列表
const pictureTypeList = [
  { label: "文章", value: "blog" },
  { label: "头像", value: "head" },
  { label: "懒加载图片", value: "loading" },
  { label: "背景", value: "background" },
  { label: "其他", value: "other" },
];
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
        :action="BASE_URL + '/api/toolkit/uploadImageToPictureBed'"
        name="upload-image"
        withCredentials
        :showUploadList="false"
        :multiple="true"
        :data="{ type: selectType.val }"
        :beforeUpload="beforeUpload"
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
      <div class="preview">
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
      <div style="display: flex; gap: 5px">
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
        <AButton
          type="primary"
          :loading="uploading"
          :disabled="!selectType.val"
          @click="onOk"
        >
          确定
        </AButton>
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
</style>
