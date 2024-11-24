<script setup lang="ts">
import {
  deleteTask,
  disableTask,
  enableTask,
  getAllTask,
  getTaskLog,
  runTask,
  updateTask,
} from "@/api/plantask.ts";
import LzyIcon from "@/components/LzyIcon.vue";
import { message, Modal } from "ant-design-vue";
import { MenuData, Task, TaskLog } from "@/typings/Plantask.ts";
import { useRefMoreUsage } from "@/hook/useRefMoreUsage.ts";
import TaskCard from "@/components/TaskCard.vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";
import { useDateFormat } from "@vueuse/shared";
import { Swiper, SwiperSlide } from "swiper/vue";

import { removeInlineStyles } from "@/utils/comment.ts";

const { width } = useWindowSize();
const taskData = ref<any>([]);

//获取任务列表
const getTaskDatat = async () => {
  const { data } = await getAllTask();
  taskData.value = [...data, {}];
};
getTaskDatat();

//所有指令栈
const stackInstruction = ref({});

//编辑任务抽屉
const editTaskDrawer = ref(false);

//查看日志
const logModal = ref({
  open: false,
  data: [] as TaskLog[],
  taskName: "",
  page: 1,
  title: "",
});

//当前编辑的任务
const { data: currentEditTask } = useRefMoreUsage<Ref<Task>>({
  id: "",
  name: "",
  type: "",
  cronExpression: "",
  paramsBody: "",
  createdAt: "",
  updatedAt: "",
  lastExecutedAt: "",
  isEnabled: 0,
});

//新增任务
// const addTask = () => {};

const menuData = (item: Task): MenuData[] => [
  {
    key: "1",
    name: item.isEnabled == 0 ? "启用任务" : "暂停任务",
    icon:
      item.isEnabled == 0
        ? "material-symbols:motion-play-outline"
        : "material-symbols:motion-photos-paused-outline",
    click: async () => {
      Modal.confirm({
        title: item.isEnabled == 0 ? "启用任务" : "暂停任务",
        icon: createVNode(ExclamationCircleOutlined),
        content:
          "你确定要" + (item.isEnabled == 0 ? "启用" : "暂停") + "该任务吗?",
        onOk: async () => {
          const result =
            item.isEnabled == 0
              ? await enableTask(item.id)
              : await disableTask(item.id);
          if (result.code === 200) {
            message.success("操作成功");
            //重新获取任务列表
            await getTaskDatat();
          }
        },
      });
    },
  },
  {
    key: "2",
    name: "立即执行",
    icon: "material-symbols:not-started-outline",
    click: async () => {
      const { id } = item;
      if (stackInstruction.value[id]) {
        message.warning("任务正在执行中，请稍后再试");
        return;
      }
      stackInstruction.value[id] = true;
      try {
        const result = await runTask(id);
        message.success(result.data);
      } catch (error) {}
      stackInstruction.value[id] = false;
    },
  },
  {
    key: "3",
    name: "编辑任务",
    icon: "material-symbols:edit-calendar",
    click: async () => {
      editTaskDrawer.value = true;
      try {
        item.paramsBody = JSON.parse(item.paramsBody!);
      } catch (e) {}
      currentEditTask.value = item;
    },
  },
  {
    key: "4",
    name: "删除任务",
    icon: "material-symbols:auto-delete-outline",
    click: async () => {
      Modal.confirm({
        title: "删除任务",
        icon: createVNode(ExclamationCircleOutlined),
        content: "你确定要删除该任务吗?",
        onOk: async () => {
          const result = await deleteTask(item.id);
          if (result.code === 200) {
            message.success("删除成功");
            //重新获取任务列表
            await getTaskDatat();
          }
        },
      });
    },
  },
  {
    key: "5",
    name: "查看日志",
    icon: "material-symbols:preview",
    click: async () => {
      let { data } = await getTaskLog(item.id);
      if (data.length === 0) {
        message.warning("暂无日志");
        return;
      }
      data.forEach((item) => {
        if (!item.content) item.content = "暂无日志";
        else item.content = removeInlineStyles(item.content);
      });
      logModal.value = {
        open: true,
        data: data,
        taskName: item.name,
        page: 1,
        title: item.name + "的历史日志" + "（共" + data.length + "条）",
      };
    },
  },
];

//保存编辑
const saveEdit = async () => {
  try {
    const taskData = { ...currentEditTask.value };
    taskData.paramsBody = JSON.stringify(taskData.paramsBody);
    const result = await updateTask(taskData);
    if (result.code === 200) {
      message.success("修改成功");
    }
    editTaskDrawer.value = false;
    //重新获取任务列表
    await getTaskDatat();
  } catch (error) {}
};

const onSwiper = (swiper) => {
  console.log(swiper);
};

const onSlideChange = (swiper: any) => {
  logModal.value.page = swiper.activeIndex + 1;
};
</script>

<template>
  <div>
    <a-list
      :grid="{ gutter: 10, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }"
      :data-source="taskData"
    >
      <template #renderItem="{ item }">
        <a-dropdown :trigger="['contextmenu']" v-if="item.id">
          <a-list-item>
            <a-spin :spinning="!!stackInstruction[item.id]">
              <TaskCard :item="item" :menuData="menuData" />
            </a-spin>
          </a-list-item>
          <template #overlay>
            <a-menu>
              <a-menu-item
                v-for="menu in menuData(item)"
                :key="menu.key"
                :disabled="stackInstruction[item.id]"
                @click="menu.click"
              >
                <LzyIcon :name="menu.icon" />
                <span>{{ menu.name }}</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-list-item v-else>
          <a-card class="add-new">
            <a-button type="dashed">
              <LzyIcon size="70" name="iconoir:plus" />
              <span>添加计划任务</span>
            </a-button>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
    <a-drawer
      v-model:open="editTaskDrawer"
      class="custom-class"
      root-class-name="root-class-name"
      title="编辑任务"
      placement="right"
      :width="width < 960 ? '100%' : '50%'"
    >
      <template #extra>
        <a-button type="primary" @click="saveEdit">保存修改</a-button>
      </template>
      <a-form
        ref="formRef"
        :model="currentEditTask"
        :wrapper-col="{ span: 20 }"
        :label-col="{ span: 6 }"
        style="width: 100%"
      >
        <a-form-item ref="name" label="任务名" name="name">
          <a-input v-model:value="currentEditTask.name" />
        </a-form-item>
        <a-form-item label="任务函数" name="type">
          <a-select v-model:value="currentEditTask.type">
            <a-select-option value="sendEmailLove">
              sendEmailLove
            </a-select-option>
            <a-select-option value="sendEmailWarn">
              sendEmailWarn
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="计划执行时间" required name="cronExpression">
          <a-input v-model:value="currentEditTask.cronExpression" />
        </a-form-item>

        <a-form-item
          v-for="(_item, key) in currentEditTask.paramsBody"
          :label="key"
          :name="key"
        >
          <AInput
            v-model:value="currentEditTask.paramsBody![key]"
            v-if="_item.length < 80"
          />
          <ATextarea
            v-model:value="currentEditTask.paramsBody![key]"
            v-else
            :auto-size="{ minRows: 2, maxRows: 5 }"
          />
        </a-form-item>
      </a-form>
    </a-drawer>

    <!-- 日志 -->
    <a-modal
      v-model:open="logModal.open"
      :title="logModal.title"
      class="logModal"
      width="90%"
      style="max-height: 90%"
    >
      <ACard
        style="height: 68vh"
        :body-style="{
          height: 'calc(100% - 50px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }"
        class="logCard"
      >
        <LzyIcon name="iconoir:nav-arrow-left" size="30" />
        <swiper
          class="mySwiper"
          style="flex: 1 1 0"
          @Swiper="onSwiper"
          @slideChange="onSlideChange"
          v-if="logModal.open"
        >
          <swiper-slide v-for="item in logModal.data">
            <main class="html-container">
              <section v-html="item.content"></section>
            </main>
          </swiper-slide>
        </swiper>
        <!--        v-html="logModal.data[logModal.page - 1]?.content" -->
        <LzyIcon name="iconoir:nav-arrow-right" size="30" />
      </ACard>
      <template #footer>
        <div style="display: flex; justify-content: space-between">
          <span> ID：{{ logModal.data[logModal.page - 1].id }} </span>
          <span>
            执行时间：
            {{
              useDateFormat(
                logModal.data[logModal.page - 1].executedAt,
                "YYYY-MM-DD HH:mm:ss",
              )
            }}
          </span>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<style scoped>
:deep(.ant-list-item-meta-title) {
  margin: 0;
}

:deep(.ant-list-item) {
  border-radius: 10px;
  padding: 5px;

  .ant-card-body {
    padding: 15px 20px;
    height: 258px;
  }

  h2 {
    margin-top: 0;
    font-family: "dindin";
    font-weight: 400;
    text-wrap: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    margin: 5px 0;

    & > span {
      color: #777;
    }
  }

  div.bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;

    section {
      display: flex;
      align-items: center;
    }
  }

  /*分割线*/

  .ant-divider-horizontal {
    margin: 5px 0 10px;
  }

  &:hover {
    cursor: pointer;
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.1));
    transition: 0.3s;
  }

  .add-new {
    button {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      font-size: 14px;
      color: #777;
      transition: 0.3s;
    }

    &:hover button {
      color: var(--themeColor);
    }
  }
}

:deep(.ant-dropdown-menu-item) {
  span {
    display: flex;
    align-items: center;
    gap: 8px;

    .LzyIcon {
      font-size: 18px;
    }
  }
}

.mySwiper {
  user-select: none;

  main.html-container {
    height: 60vh;
    overflow: auto;
    margin-top: 30px;

    section {
    }
  }
}

@media screen and (max-width: 768px) {
  .logCard {
    .LzyIcon {
      display: none;
    }
  }
  :deep(.ant-card-body){
    padding: 0;
  }
}
</style>
