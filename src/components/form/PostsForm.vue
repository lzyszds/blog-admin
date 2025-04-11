<script lang="ts" setup>
import {addArticleCategory, getArticleCategory} from '@/api/posts';
import {ArticleDataType, TagDataType} from '@/typings/Posts';
import {isEqual, toProxys} from '@/utils';
import {message, Modal} from 'ant-design-vue';
import LzyIcon from '../LzyIcon.vue';
import {createVNode} from 'vue';
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import {uploadImageToPictureBed} from '@/api/toolkit.ts';
import Editor from '@/components/ckeditor/CkEditor.vue';
import Resources from '@/views/root/Resources.vue';

type ModalParamsType = {
  modalParams: {
    isOpen: boolean;
    title: string;
    params: ArticleDataType;
    headimgs: string[];
    sureCallback: {
      uploadHeadImg: Function;
      callback: Function;
      refreshData: Function;
    };
  };
};

/* 模态框参数 */
const {modalParams} = defineProps<ModalParamsType>();

//资源管理弹窗控制
const resourceModal = ref(false);
//当前选中的图片
const selectImage = ref('');

/* 表单缓存数据 */
const formState = useStorage('formState', {});

//当前表单数据
const currentFormData = formState.value[modalParams.params.aid || 'add'];


/* 文章数据 */
const information = ref<ArticleDataType>({...modalParams.params});


/*  文章编辑器原始数据 */
const protoInformation = toProxys({...modalParams.params});

//当前选中的标签数据
const tagData: any = ref(information.value?.tags || modalParams.params?.tags || []);

/* 全局配置缓存 */
// const globlConfig = useStorage("globlConfig", {
//   previewPosition: "flex",
// });

//临时存储数据
const tagDataTem: any = ref(tagData.value);
//标签列表
const tagList = ref<TagDataType[]>();

// 获取标签列表
try {
  getArticleCategory().then((result) => {
    tagList.value = result.data.data.map((res) => {
      return {value: res.name};
    });
  });
} catch (e) {
  console.log(e);
}

//退出
const exitForm = () => {
  modalParams.isOpen = false;
};

// 保存编辑器内容
const saveForm = (content?: string) => {
  const params = modalParams.params;
  let isNext = false;
  formState.value[params.aid || 'add'] = {
    title: information.value.title,
    content: content ?? information.value.content,
    main: document.querySelector('.ck-editor__main>div')?.innerHTML,
    coverImg: information.value.coverImg,
    tags: tagData.value,
    partialContent: information.value.partialContent,
  };
  console.log(formState.value[params.aid || 'add']);
  const values: any = Object.values(
      isEqual(formState.value[params.aid || 'add'], params)
  );
  for (let item of values) {
    if (item.length != 0) {
      isNext = true;
      break;
    }
  }

  if (!isNext) delete formState.value[params.aid || 'add'];
};

// 确认提交
const submitForm = async () => {
  const data = await setData();
  // 检查内容是否相同
  modalParams.sureCallback.callback(data).then((res) => {
    console.log('提交数据', res);
    if (res.code !== 200) return
    message.success('保存成功！');
    /* 推出模态框 */
    modalParams.isOpen = false;
    /* 刷新数据 */
    modalParams.sureCallback.refreshData(true);
    // const save = document.querySelector(".v-md-icon-save") as HTMLLIElement;
    // save.click();

    /* 删除缓存 */
    delete formState.value[modalParams.params.aid || 'add'];
  });
};

/* 文章内部图片上传事件 */
const handleUploadImage = async ([insertImage, files]) => {

  try {
    const res = await uploadImageToPictureBed(files[0]);

    if (res.code === 200) {
      insertImage({
        url: res.data.filename,
        desc: '点击放大',
      });
    }
  } catch (e) {
    console.error('图片上传或插入过程中出现错误:', e);
    // 可以在这里添加错误处理逻辑，例如重试上传或通知用户
  }
};

//取出当前选中的图片
const getSelectImage = () => {
  information.value.coverImg = selectImage.value + '';
  resourceModal.value = false;

  console.log(information.value.coverImg);
};

/**
 * 设置数据
 * @returns {ArticleDataType} 文章数据
 */
async function setData(): Promise<ArticleDataType> {
  const {aid, title, content, coverImg} = information.value;
  console.log(content);
  
  const first = document.querySelector('.ck-editor__main>div')?.children;
  let firstText = '';
  //遍历所有子元素 如果tagname 标题h1 h2 h3 h4 h5 h6 则跳过
  for (const firstKey in first) {
    if (!['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(first[firstKey].tagName)) {
      firstText = first[firstKey].innerText;
      break;
    }
  }

  const md = (await import('@/utils/markdownInit.ts')).default;

  const main = md.render(content || '');
  console.log(main);
  
  // 初始化文章数据
  const data = {
    title, // 文章标题
    partial_content: information.value.partialContent ?? firstText, // 文章开头第一段话
    content, // 文章内容
    main: main, // 文章主体内容
    cover_img: coverImg, // 文章封面图片
    aid, // 文章ID（修改时为当前文章ID，创建时为null）
    tags: tagData.value, // 文章标签
  };
  // 判断数据是否与原始数据相同
  return isEqual(data, protoInformation, 'aid');
}

// 修改标签值事件
const selectTag = (tags) => {
  if (tags.length >= 4) {
    tagData.value.pop();
    return message.warning('最多只能选择4个标签');
  }
};

// 输入类型
const typeInput = ref('');
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
      return message.warning('该标签已存在');
    }
    return tagDataTem.value.push(typeInput.value);
  }
  await addArticleCategory({name: typeInput.value});
  const {data: tagData} = await getArticleCategory();
  message.success('添加成功');
  // tipNotify("添加成功");
  tagList.value = tagData.data.map((res) => ({value: res.name}));
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

onMounted(() => {
  setTimeout(() => {
    // setPlace(globlConfig.value.previewPosition);
  }, 50);

  if (!currentFormData) return;
  Modal.confirm({
    content: '检测到上一次保存的数据，是否继续编辑？',
    icon: createVNode(ExclamationCircleOutlined),
    onOk() {
      information.value = {...currentFormData};
    },
    cancelText: '清除上一次记录',
    okText: '继续编辑',
    onCancel() {
      Modal.destroyAll();
      delete formState.value[modalParams.params.aid || 'add'];
    },
  });
});
provide('infoCard', infoCard);
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
          <div class="ant-upload" @click="resourceModal = true">
            <img
                v-if="information.coverImg"
                :src="information.coverImg"
                alt="coverImg"
                style="width: 100%; height: 100%; object-fit: cover"
                onerror="this.src='error.png';"
            />

            <template v-else>
              <LzyIcon
                  size="25"
                  name="hugeicons:image-01"
                  style="vertical-align: middle"
              />
              <div>上传图片</div>
            </template>
          </div>
          <a-divider>文章标题</a-divider>
          <AInput v-model:value="information.title" placeholder="必填 | 请输入文章标题"/>
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
              <v-nodes :vnodes="menu"/>
              <a-divider style="margin: 4px 0"/>
              <a-space style="padding: 4px 8px">
                <a-input ref="inputRef" v-model:value="typeInput"/>
                <a-button type="text" @click="addArticleType">
                  <template #icon>
                    <LzyIcon size="17" name="iconoir:plus"/>
                  </template>
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
          <!--          <MarkdownEditor-->
          <!--            v-model="information.content"-->
          <!--            :saveForm="saveForm"-->
          <!--            @update-image="handleUploadImage"-->
          <!--          ></MarkdownEditor>-->

          <Editor
              v-model="information.content"
              :saveForm="saveForm"
              @update-image="handleUploadImage"
          ></Editor>
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
          <LzyIcon size="18" name="mdi:content-save"/>
          <span class="intact">保存草稿</span>
        </a-button>
        <a-button type="primary" @click="submitForm">
          <LzyIcon size="18" name="mdi:publish"/>
          <span class="intact">发布文章</span>
        </a-button>
      </div>
    </template>
  </ADrawer>
  <AModal v-model:open="resourceModal" width="100%" wrap-class-name="resource-modal">
    <Resources type="blog" :is-selector="true" @select="(val) => (selectImage = val)"/>
    <template #footer>
      <div class="resource-footer">
        <a-button @click="resourceModal = false">取消</a-button>
        <a-button type="primary" @click="getSelectImage">确定</a-button>
      </div>
    </template>
  </AModal>
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
  min-width: 350px;
  flex: 3;
  background-color: var(--color-bg);
  border-radius: 12px;
  overflow-y: auto;

  .ant-upload {
    width: 100% !important;
    height: 150px !important;
    overflow: hidden;
    transition: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: var(--color-bg-light);
    border-radius: 8px;
    border: 1px dashed #d9d9d9;

    &:hover {
      cursor: pointer;
      background-color: var(--color-bg-light-hover);
      border-color: var(--themeColor);
    }
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
