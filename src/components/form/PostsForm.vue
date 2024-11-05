<script lang="ts" setup>
import { getArticleCategory, uploadArticleImg } from "@/api/posts";
import { ArticledataType, TagDataType } from "@/typings/Posts";
import { isEqual, optimizeImage, toProxys } from "@/utils/comment";
import { message } from "ant-design-vue";

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

/* 文章数据 */
const information = ref<ArticledataType>({ ...modalParams.params });
/*  文章编辑器原始数据 */
const protoInformation = toProxys({ ...modalParams.params });

console.log(modalParams, "modalParams");

/* 封面文件上传dom */
const coverFile = templateRef<HTMLInputElement>("coverFile");

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
//标签弹窗控制flag
const visible = ref<boolean>(false);
//全部标签数据
const tagData: any = ref(modalParams.params?.tags || []);
//当前文章的标签数据 当前文章的标签数据 是否已经有标签
// tagData.value = props.data?.w ? props.data?.wtype.split(",") : [];
//临时存储数据
const tagDataTem: any = ref(tagData.value);
//标签列表
const tagList = ref<TagDataType[]>();

// 获取标签列表
try {
  const result = await getArticleCategory();
  tagList.value = result.data.data;
} catch (e) {
  console.log(e);
}

// 确认提交
const submitForm = async () => {
  const data = setData();
  // 检查内容是否相同
  modalParams.sureCallback.callback(data).then((res) => {
    message.success("保存成功！");
    const save = document.querySelector(".v-md-icon-save") as HTMLLIElement;
    save.click();
  });
};

//暂存按钮
const resetForm = () => {
  const save = document.querySelector(".v-md-icon-save") as HTMLLIElement;
  save.click();
  // articledata.value = setData();
};
const handleUploadImage = async (event, insertImage, files) => {
  // 如果文件大小小于300kb，不进行压缩，按比例压缩
  const scale = files[0].size < 300 * 1024 ? 1 : 0.5;

  try {
    // 对图片进行压 缩
    const { fileCompress } = await optimizeImage(files[0], scale);

    // 上传图片
    const res = await uploadArticleImg(fileCompress);
    console.log(`lzy  res:`, res);

    if (res.code === 200) {
      insertImage({
        url: "/adminPublic" + res.data,
        desc: "点击放大",
      });
    }
  } catch (e) {
    console.error("图片上传或插入过程中出现错误:", e);
    // 可以在这里添加错误处理逻辑，例如重试上传或通知用户
  }
};

const saveToInformationStorage = (text, html) => {
  // 确保information对象和storage属性已经定义
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
  const { aid, title, content, coverImg } = information.value;
  // 初始化文章数据
  const data = {
    title, // 文章标题
    partial_content: document.querySelector(".vuepress-markdown-body")?.firstElementChild!
      .innerHTML!, // 文章开头第一段话
    content, // 文章内容
    main: document.querySelector(".vuepress-markdown-body")?.innerHTML!, // 文章主体内容
    cover_img: coverImg, // 文章封面图片
    aid, // 文章ID（修改时为当前文章ID，创建时为null）
    tags: tagDataTem.value, // 文章标签
  };
  // 判断数据是否与原始数据相同
  return isEqual(data, protoInformation, "aid");
}

// 标签激活函数
const tagActive = (tag) => {
  if (tagDataTem.value.includes(tag)) {
    // 如果存在则删除
    tagDataTem.value.splice(tagDataTem.value.indexOf(tag), 1);
  } else {
    if (tagDataTem.value.length >= 4) {
      message.warning("最多只能选择4个标签");
      return;
    }
    tagDataTem.value.push(tag);
  }
};

// 标签激活类名
const tagActiveClass = (tag) => {
  return tagDataTem.value.includes(tag) ? "tag-active" : "";
};

// 添加标签
const addTag = (flag: boolean) => {
  if (flag) {
    tagData.value = tagDataTem.value;
  } else {
    tagDataTem.value = tagData.value;
  }
  visible.value = false;
};

// 输入类型
const typeInput = ref("");
//添加文章分类小标题
const addArticleType = async () => {
  //非空判断
  if (!typeInput.value) return;

  //获取当前所有的文章分类
  const data = tagList.value!.map((res) => {
    return res.name;
  });
  //判断当前输入的类型是否已经存在 如果不存在 则添加
  if (data?.includes(typeInput.value as any)) {
    if (tagDataTem.value.includes(typeInput.value as any)) {
      return message.warning("该标签已存在");
    }
    return tagDataTem.value.push(typeInput.value);
  }
  // await addArticleCategory({ name: typeInput.value });
  // const { data: tagData } = await getArticleCategory<Response<TagDataType>>();
  message.success("添加成功");
  // tipNotify("添加成功");
  tagList.value = tagData.data;
};
</script>

<template>
  <ADrawer
    :title="modalParams.title"
    :width="'100%'"
    :open="modalParams.isOpen"
    :body-style="{ paddingBottom: '80px' }"
    @close="modalParams.isOpen = false"
    destroyOnClose
  >
    <template #default>
      <main class="edit-container">
        <ACard class="edit-infomation" :bordered="false">
          <a-form-item label="文章封面">
            <a-upload list-type="picture-card" :show-upload-list="false">
              <LzyIcon
                size="18"
                name="hugeicons:image-01"
                style="vertical-align: middle"
              />
              <div>上传图片</div>
            </a-upload>
          </a-form-item>
          <a-form-item label="文章标题">
            <AInput />
          </a-form-item>
          <a-form-item label="文章分类">
            <a-select
              v-model:value="tagData"
              placeholder="选择文章分类"
              :options="tagList"
            >
              <template #dropdownRender="{ menuNode: menu }">
                <v-nodes :vnodes="menu" />
                <a-divider style="margin: 4px 0" />
                <a-space style="padding: 4px 8px">
                  <a-input ref="inputRef" v-model:value="typeInput" />
                  <a-button type="text" @click="addArticleType">
                    <template #icon>
                      <LzyIcon size="17" name="iconoir:plus" />
                    </template>
                    <span style="font-size: 12px"> 添加分类</span>
                  </a-button>
                </a-space>
              </template>
            </a-select>
          </a-form-item>
        </ACard>
        <ACard
          class="edit-content"
          id="markdownMain"
          :bordered="false"
          :body-style="{ padding: '0' }"
        >
          <v-md-editor v-model="information.content" />
        </ACard>
      </main>
    </template>

    <template #extra>
      <ASpace>
        <a-button @click="modalParams.isOpen = false">取消保存</a-button>
        <a-button type="primary" @click="">提交数据</a-button>
      </ASpace>
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
  flex: 3;
  background-color: var(--color-bg);
  border-radius: 12px;

  :deep(.ant-upload) {
    width: 100% !important;
  }
}
.edit-content {
  flex: 7;
  height: 100%;
}

:deep(.v-md-editor) {
  height: calc(100vh - 65px - 96px);
  border-radius: 12px;
  box-shadow: none;
}
</style>
