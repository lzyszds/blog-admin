<script lang="ts" setup>
import { addArticleCategory, getArticleCategory, uploadArticleImg } from "@/api/posts";
import { ArticledataType, TagDataType } from "@/typings/Posts";
import { isEqual, optimizeImage, toProxys } from "@/utils/comment";
import { message, Modal } from "ant-design-vue";
import MarkdownEditor from "../markdown/MarkdownEditor.vue";
import LzyIcon from "../LzyIcon.vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";
import _ from "lodash";

type ModalParamsType = {
  modalParams: {
    isOpen: boolean;
    title: string;
    params: ArticledataType;
    headimgs: string[];
    sureCallback: {
      uploadHeadImg: Function;
      callback: Function;
      refreshData: Function;
    };
  };
};

/* 模态框参数 */
const { modalParams } = defineProps<ModalParamsType>();

/* 表单缓存数据 */
const formState = useStorage("formState", {});

const currentFormData = formState.value[modalParams.params.aid || "add"];

/* 文章数据 */
const information = ref<ArticledataType>({ ...modalParams.params });
/*  文章编辑器原始数据 */
const protoInformation = toProxys({ ...modalParams.params });

console.log(modalParams, "modalParams");

/* 封面文件上传状态 */
const coverUpLoad = ref(false);

//当前选中的标签数据
const tagData: any = ref(information.value?.tags || modalParams.params?.tags || []);

/* 全局配置缓存 */
const globlConfig = useStorage("globlConfig", {
  previewPosition: "flex",
});

//临时存储数据
const tagDataTem: any = ref(tagData.value);
//标签列表
const tagList = ref<TagDataType[]>();

// 获取标签列表
try {
  const result = await getArticleCategory();
  tagList.value = result.data.data.map((res) => {
    return { value: res.name };
  });
} catch (e) {
  console.log(e);
}

//退出
const exitForm = () => {
  modalParams.isOpen = false;
};

// 保存编辑器内容
const saveForm = () => {
  const params = modalParams.params;
  let isNext = false;
  formState.value[params.aid || "add"] = {
    title: information.value.title,
    content: information.value.content,
    coverImg: information.value.coverImg,
    tags: tagData.value,
    partialContent: information.value.partialContent,
  };

  const values: any = Object.values(
    isEqual(formState.value[params.aid || "add"], params)
  );
  for (let item of values) {
    if (item.length != 0) {
      isNext = true;
      break;
    }
  }

  if (!isNext) delete formState.value[params.aid || "add"];
};

// 确认提交
const submitForm = async () => {
  const data = setData();
  // 检查内容是否相同
  modalParams.sureCallback.callback(data).then((res) => {
    console.log("提交数据", res);
    message.success("保存成功！");
    /* 推出模态框 */
    modalParams.isOpen = false;
    /* 刷新数据 */
    modalParams.sureCallback.refreshData();
    // const save = document.querySelector(".v-md-icon-save") as HTMLLIElement;
    // save.click();

    /* 删除缓存 */
    delete formState.value[modalParams.params.aid || "add"];
  });
};

//暂存按钮
const resetForm = () => {
  const save = document.querySelector(".v-md-icon-save") as HTMLLIElement;
  save.click();
  // articledata.value = setData();
};

//图片上传方法
const coverUpdate = async (file) => {
  // 如果文件大小小于300kb，不进行压缩，按比例压缩
  const scale = file.size < 300 * 1024 ? 1 : 0.5;

  /* 压缩图片 */
  const { fileCompress } = await optimizeImage(file, scale);
  return await uploadArticleImg(fileCompress);
};

/* 上传封面重置请求 */
const customRequest = ({ file }) => {
  coverUpLoad.value = true;
  return new Promise(async (resolve) => {
    coverUpdate(file).then((res) => {
      setTimeout(() => {
        information.value.coverImg = res.data.filename;
        resolve(res);
        message.info("封面上传成功！");
        coverUpLoad.value = false;
      }, 1000);
    });
  });
};

/* 文章内部图片上传事件 */
const handleUploadImage = async (event, insertImage, files) => {
  try {
    const res = await coverUpdate(files[0]);
    if (res.code === 200) {
      insertImage({
        url: "/hono" + res.data.filename,
        desc: "点击放大",
      });
    }
  } catch (e) {
    console.error("图片上传或插入过程中出现错误:", e);
    // 可以在这里添加错误处理逻辑，例如重试上传或通知用户
  }
};

const saveToInformationStorage = (text, html) => {
  // 确保information对象和storage属性已经定义;
  // if (!information || !information.storage) {
  //   throw new Error("information.storage未定义");
  // }
  // information.storage = { text, html };
};

/**
 * 设置数据
 * @returns {ArticledataType} 文章数据
 */
function setData(): ArticledataType {
  console.log(information.value);

  const { aid, title, content, coverImg } = information.value;
  // 初始化文章数据
  const data = {
    title, // 文章标题
    partial_content: document.querySelector(".preview-pane")?.firstElementChild!
      .innerHTML!, // 文章开头第一段话
    content, // 文章内容
    main: document.querySelector(".preview-pane")?.innerHTML!, // 文章主体内容
    cover_img: coverImg, // 文章封面图片
    aid, // 文章ID（修改时为当前文章ID，创建时为null）
    tags: tagData.value, // 文章标签
  };
  // 判断数据是否与原始数据相同
  return isEqual(data, protoInformation, "aid");
}

// 修改标签值事件
const selectTag = (tags) => {
  if (tags.length >= 4) {
    tagData.value.pop();
    return message.warning("最多只能选择4个标签");
  }
};

// 输入类型
const typeInput = ref("");
//添加文章分类小标题
const addArticleType = async () => {
  //非空判断
  if (!typeInput.value) return;

  //获取当前所有的文章分类
  const data = tagList.value!.map((res) => {
    //@ts-ignore
    return res.value;
  });
  //判断当前输入的类型是否已经存在 如果不存在 则添加
  if (data?.includes(typeInput.value as any)) {
    if (tagDataTem.value.includes(typeInput.value as any)) {
      return message.warning("该标签已存在");
    }
    return tagDataTem.value.push(typeInput.value);
  }
  await addArticleCategory({ name: typeInput.value });
  const { data: tagData } = await getArticleCategory();
  message.success("添加成功");
  // tipNotify("添加成功");
  tagList.value = tagData.data.map((res) => ({ value: res.name }));
};

/* 分类标签下拉框渲染 组件 */
const VNodes = defineComponent({
  props: {
    vnodes: {
      type: Object,
      required: true,
    },
  },
  render() {
    return this.vnodes;
  },
});

const infoCard = shallowRef();
const { width: infoCard_w, height: infoCard_h } = useElementSize(infoCard);

const changePlaces = (val) => {
  globlConfig.value.previewPosition = val;
  // setPlace(val);
};

function setPlace(val) {
  const preview = document.querySelector(".v-md-editor__preview-wrapper") as HTMLElement;
  const container = document.querySelector(".edit-container") as HTMLElement;
  container.style.flexDirection = "row";
  /* 设置位置 如果val为flex 则设置为相对定位 */
  if (val !== "flex") {
    preview.style.position = "fixed";
    preview.style.height = infoCard_h.value + "px";
    preview.style.width = infoCard_w.value + "px";
    preview.style.top = "90px";
    if (val == "right") {
      preview.style.right = "24px";
      preview.style.left = "inherit";
      container.style.flexDirection = "row-reverse";
    } else {
      preview.style.left = "24px";
      preview.style.right = "inherit";
    }
  } else {
    preview.style.position = "relative";
    preview.style.height = "auto";
    preview.style.width = "auto";
    preview.style.top = "0";
    preview.style.left = "0";
  }
}

onMounted(() => {
  setTimeout(() => {
    // setPlace(globlConfig.value.previewPosition);
  }, 50);

  if (!currentFormData) return;
  Modal.confirm({
    content: "检测到上一次保存的数据，是否继续编辑？",
    icon: createVNode(ExclamationCircleOutlined),
    onOk() {
      information.value = { ...currentFormData };
    },
    cancelText: "清除上一次记录",
    okText: "继续编辑",
    onCancel() {
      Modal.destroyAll();
      delete formState.value[modalParams.params.aid || "add"];
    },
  });
});
</script>

<template>
  <ADrawer
    :title="modalParams.title"
    :width="'100%'"
    :open="modalParams.isOpen"
    :body-style="{ padding: '10px !important' }"
    @close="modalParams.isOpen = false"
    destroyOnClose
    :keyboard="false"
  >
    <template #default>
      <main class="edit-container">
        <ACard ref="infoCard" class="edit-infomation" :bordered="false">
          <a-divider>文章封面</a-divider>
          <!--  :before-upload="coverUpdate" -->
          <a-upload
            list-type="picture-card"
            name="upload-image"
            :show-upload-list="false"
            :customRequest="customRequest"
            body-style="display: block;"
          >
            <img
              v-if="information.coverImg"
              :src="'/hono' + information.coverImg"
              alt="coverImg"
              style="width: 100%; height: 100%; object-fit: cover"
            />

            <template v-else>
              <template v-if="!coverUpLoad">
                <LzyIcon
                  size="18"
                  name="hugeicons:image-01"
                  style="vertical-align: middle"
                />
                <div>上传图片</div>
              </template>
              <template v-else>
                <LzyIcon
                  size="18"
                  name="line-md:uploading-loop"
                  style="vertical-align: middle"
                />
                <span>上传中...</span>
              </template>
            </template>
          </a-upload>
          <a-divider>文章标题</a-divider>
          <AInput v-model:value="information.title" placeholder="必填 | 请输入文章标题" />
          <a-divider>文章分类</a-divider>
          <a-select
            ref="selectRef"
            v-model:value="tagData"
            placeholder="必填 | 选择文章分类"
            style="width: 100%"
            v-if="tagList"
            :options="tagList"
            mode="tags"
            @change="selectTag"
          >
            <template #dropdownRender="{ menuNode: menu }">
              <v-nodes :vnodes="menu" />
              <a-divider style="margin: 4px 0" />
              <a-space style="padding: 4px 8px">
                <a-input ref="inputRef" v-model:value="typeInput" />
                <a-button type="text" @click="addArticleType">
                  <template #icon><LzyIcon size="17" name="iconoir:plus" /></template>
                  添加分类
                </a-button>
              </a-space>
            </template>
          </a-select>
          <a-divider>文章介绍</a-divider>
          <ATextarea
            v-model:value="information.partialContent"
            placeholder="选填 | 为空则将自动设置为文章开头第一段"
            :auto-size="{ minRows: 10, maxRows: 10 }"
          />
        </ACard>
        <ACard
          class="edit-content"
          id="markdownMain"
          :bordered="false"
          :body-style="{ padding: '0', height: '100%' }"
        >
          <MarkdownEditor
            v-model="information.content"
            :saveForm="saveForm"
          ></MarkdownEditor>
        </ACard>
      </main>
    </template>

    <template #extra>
      <div class="drawer-extra">
        <!-- <a-select
          v-model:value="globlConfig.previewPosition"
          style="width: 100px"
          :options="[
            { value: 'flex', label: '预览位置' },
            { value: 'left', label: '预览居左' },
            { value: 'right', label: '预览居右' },
          ]"
          @change="changePlaces"
        >
          <template #suffixIcon>
            <LzyIcon style="color: var(--color-text)" size="16" name="iconoir:pin" />
          </template>
        </a-select> -->
        <a-button @click="exitForm">
          <LzyIcon size="18" name="mdi:exit-to-app"></LzyIcon>
          <span class="intact">退出操作</span>
        </a-button>
        <a-button @click="saveForm">
          <LzyIcon size="18" name="mdi:content-save" />
          <span class="intact">保存草稿</span>
        </a-button>
        <a-button type="primary" @click="submitForm">
          <LzyIcon size="18" name="mdi:publish" />
          <span class="intact">发布文章</span>
        </a-button>
      </div>
    </template>
  </ADrawer>
</template>

<style>
.ant-drawer-body {
  background-color: var(--color-bg-light);
  padding-bottom: 0 !important;
}
</style>
<style scoped>
.edit-container {
  display: flex;
  gap: 10px;
}

.edit-infomation {
  height: calc(100vh - 65px - 48px);
  flex: 3;
  background-color: var(--color-bg);
  border-radius: 12px;
  overflow-y: auto;

  :deep(.ant-upload) {
    width: 100% !important;
    height: 150px !important;
    overflow: hidden;
  }
}
.edit-content {
  flex: 7;
}

:deep(.markdown-editor) {
  border-radius: 12px;
  box-shadow: none;
  .v-md-editor-preview {
    padding: 20px 20px 30px;
  }

  .preview-pane {
    font-size: 14px;

    h3 {
      font-size: 16px !important;
    }
    h2 {
      font-size: 18px !important;
    }
  }

  .v-md-editor__preview-wrapper {
    width: 0;
    height: 0;
    height: calc(100vh - 65px - 48px);
    background-color: #fff;
    border-radius: 12px;
  }
}
.drawer-extra {
  display: flex;
  gap: 10px;
  :deep(span) {
    margin-left: 5px;
  }
}

@media screen and (max-width: 768px) {
  .edit-container {
    flex-direction: column;
  }
  .drawer-extra {
    :deep(span) {
      display: none;
    }
  }
}

@media screen and (max-width: 378px) {
  .edit-container {
    flex-direction: column;
  }
  .drawer-extra {
    :deep(span) {
      display: none;
    }
  }
}
</style>
