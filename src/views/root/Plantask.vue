<script setup lang="ts">
import {
  createTask,
  deleteTask,
  disableTask,
  enableTask,
  getAllTask,
  getTaskLog,
  getTaskParams,
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

import { convertCronToArray, convertToCronString, removeInlineStyles } from "@/utils";

const { width } = useWindowSize();
const taskData = ref<any>([]);

const { data: params } = await getTaskParams();

//执行时间
const execute_time = ref({
  frequency: "day",
  dayValue: 1,
  hour: 0,
  minute: 0,
});

//获取任务列表
const getTaskData = async (isRefresh: boolean = true) => {
  const { data } = await getAllTask().send(isRefresh);
  taskData.value = [...data, {}];
};
getTaskData(false);

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
        content: "你确定要" + (item.isEnabled == 0 ? "启用" : "暂停") + "该任务吗?",
        onOk: async () => {
          const result =
            item.isEnabled == 0 ? await enableTask(item.id) : await disableTask(item.id);
          if (result.code === 200) {
            message.success("操作成功");
            //重新获取任务列表
            await getTaskData();
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
        if (!result.length) throw new Error("执行失败");
        message.success(result.data);
        await getTaskData();
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
        if (typeof item.paramsBody === "string") {
          item.paramsBody = JSON.parse(item.paramsBody);
        }
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
            await getTaskData();
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
    taskData.cronExpression = convertToCronString(execute_time.value);
    const result = await updateTask(taskData);
    if (result.code === 200) {
      message.success("修改成功");
    }
    editTaskDrawer.value = false;
    //重新获取任务列表
    await getTaskData();
  } catch (error) {}
};

//保存添加
const saveAdd = async () => {
  try {
    const taskData = { ...currentEditTask.value };
    taskData.paramsBody = JSON.stringify(taskData.paramsBody);
    taskData.cronExpression = convertToCronString(execute_time.value);
    const result = await createTask(taskData);
    if (result.code === 200) {
      message.success("添加成功");
    }
    editTaskDrawer.value = false;
    //重新获取任务列表
    await getTaskData();
  } catch (error) {}
};

const onSwiper = (swiper) => {
  console.log(swiper);
};

const onSlideChange = (swiper: any) => {
  logModal.value.page = swiper.activeIndex + 1;
};

//添加计划任务
const addTaskPlan = async () => {
  currentEditTask.value = {
    id: "",
    name: "",
    type: "",
    cronExpression: "",
    paramsBody: "",
    isEnabled: 0,
  };

  editTaskDrawer.value = true;
};

watchEffect(() => {
  // 如果当前编辑任务的类型为空且id不为空，则返回
  if (!currentEditTask.value.type || currentEditTask.value.id) return;
  // 将当前编辑任务的类型对应的参数转换为对象，并赋值给当前编辑任务的paramsBody
  currentEditTask.value.paramsBody = Object.fromEntries(
    params[currentEditTask.value.type].map((item) => [item, ""])
  );
});

watch(editTaskDrawer, (val) => {
  console.log(val, currentEditTask.value.id);
  if (val) {
    if (currentEditTask.value.id) {
      execute_time.value = convertCronToArray(currentEditTask.value.cronExpression);
      console.log(execute_time.value);
    }
  }
});
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
            <a-button type="dashed" @click="addTaskPlan">
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
        <a-button v-if="!!currentEditTask.id" type="primary" @click="saveEdit">
          保存修改
        </a-button>
        <a-button v-else type="primary" @click="saveAdd">保存任务</a-button>
      </template>
      <AForm
        ref="formRef"
        :model="currentEditTask"
        :wrapper-col="{ span: 20 }"
        :label-col="{ span: 6 }"
        style="width: 100%"
      >
        <AFormItem ref="name" label="任务名" name="name">
          <a-input v-model:value="currentEditTask.name" />
        </AFormItem>
        <AFormItem label="任务函数" name="type">
          <a-select v-model:value="currentEditTask.type" :disabled="!!currentEditTask.id">
            <a-select-option v-for="(_item, index) in params" :key="index" :value="index">
              {{ index }}
            </a-select-option>
          </a-select>
        </AFormItem>
        <AFormItem label="计划执行时间" required name="cronExpression">
          <div class="execute_cycle">
            <ASelect
              v-model:value="execute_time.frequency"
              :options="[
                { label: '每天', value: 'day' },
                { label: '每周', value: 'week' },
                { label: '每月', value: 'month' },
              ]"
            >
            </ASelect>
            <AFormItemRest>
              <AInput
                type="number"
                max="7"
                min="1"
                v-model:value="execute_time.dayValue"
                v-if="execute_time.frequency == 'week'"
              >
                <template #suffix>星期</template>
              </AInput>
            </AFormItemRest>
            <AFormItemRest>
              <AInput
                type="number"
                max="31"
                min="1"
                v-model:value="execute_time.dayValue"
                v-if="execute_time.frequency == 'month'"
              >
                <template #suffix>日</template>
              </AInput>
            </AFormItemRest>

            <AFormItemRest>
              <AInput type="number" v-model:value="execute_time.hour" max="24" min="0">
                <template #suffix>小时</template>
              </AInput>
            </AFormItemRest>
            <AFormItemRest>
              <AInput type="number" v-model:value="execute_time.minute" max="60" min="0">
                <template #suffix>分钟</template>
              </AInput>
            </AFormItemRest>
          </div>

          <!--          <a-input v-model:value="currentEditTask.cronExpression" />-->
        </AFormItem>

        <AFormItem
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
        </AFormItem>
      </AForm>
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
      >
        <!--        <LzyIcon name="iconoir:nav-arrow-left" size="30" />-->
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
        <!--        <LzyIcon name="iconoir:nav-arrow-right" size="30" />-->
      </ACard>
      <template #footer>
        <div style="display: flex; justify-content: space-between">
          <span> ID：{{ logModal.data[logModal.page - 1].id }} </span>
          <span>
            执行时间：
            {{
              useDateFormat(
                logModal.data[logModal.page - 1].executedAt,
                "YYYY-MM-DD HH:mm:ss"
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
  }
}

.execute_cycle {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 10px;
}

@media screen and (max-width: 960px) {
  :deep(.ant-card-body) {
    padding: 0;
  }
}
</style>
