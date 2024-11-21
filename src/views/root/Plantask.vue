<script setup lang="ts">
import { getAllTask, runTask, updateTask } from "@/api/plantask.ts";
import { useDateFormat } from "@vueuse/shared";
import LzyIcon from "@/components/LzyIcon.vue";

const taskData = await getAllTask();

updateTask({
  taskId: "b4698f2e-464d-48da-bb6e-86de8660867c",
  name: "每日爱心邮件",
  type: "sendEmailLove",
  cron_expression: "0 58 0 * * *",
  params_body: JSON.stringify({
    planTime: "0 59 23 * * *",
    subject: "爱你哦宝贝，快来看看今天的内容",
    toEmail: "lzyszds@qq.com",
    content:
      "请帮我写一封情书，使用 HTML 格式，内容以古代情诗为主题，收信人是静怡妹妹，发信人是爱你的 lzy。请只输出完整的情书 HTML 结构，不需要任何解释或附加说明。",
    aiKey: "sk-ybmwpaxbqfwvgaynwwsbyiohifxrtbqkottuwzdrnztrvgcq",
    openAiBaseUrl: "https://api.siliconflow.cn/v1",
    model: "Qwen/Qwen2-7B-Instruct",
    describe: `为什么要在每天的晚上23点59分钟发送情书呢？因为我第二天你第一个想到的永远是我! <p style="text-align:right">-----爱你的lzy</p>`,
  }),
});

//立即执行
const immediateExecution = (id: number) => {
  runTask(id);
};

//启动任务
const startTask = (id: number) => {};

//停止任务
const stopTask = (id: number) => {};

//新增任务
const addTask = () => {};
//删除任务
const deleteTask = (id: number) => {};

// 编辑任务
const editTask = (id: number) => {};

//查看日志
const viewLog = (id: number) => {};

//右键菜单点击事件
const onMenuClick = (key: string, item: any) => {
  switch (key) {
    case "1":
      startTask(item.id);
      break;
    case "2":
      immediateExecution(item.id);
      break;
    case "3":
      editTask(item.id);
      break;
    case "4":
      deleteTask(item.id);
      break;
    case "5":
      viewLog(item.id);
  }
};
</script>

<template>
  <a-list
    :grid="{ gutter: 10, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }"
    :data-source="[...taskData.data, {}]"
  >
    <template #renderItem="{ item }">
      <a-dropdown :trigger="['contextmenu']" v-if="item.id">
        <a-list-item>
          <a-card>
            <h2>{{ item.name }}</h2>
            <p><span>执行服务：</span>{{ item.type }}()</p>
            <p><span>计划执行：</span>{{ item.cronExpression }}</p>
            <p>
              <span> 上次执行：</span>
              {{
                item.lastExecutedAt
                  ? useDateFormat(item.lastExecutedAt, "YYYY-MM-DD HH:mm:ss")
                  : "暂无"
              }}
            </p>
            <p>
              <span> 创建时间：</span>
              {{ useDateFormat(item.createdAt, "YYYY-MM-DD HH:mm:ss") }}
            </p>
            <p>
              <span> 更新时间：</span>
              {{ useDateFormat(item.updatedAt, "YYYY-MM-DD HH:mm:ss") }}
            </p>
            <a-divider />

            <div class="bottom">
              <section>
                <ATag color="#dc143c" style="color: #fff">已暂停</ATag>
                <a-divider type="vertical" />
                <LzyIcon
                  size="20"
                  name="solar:stopwatch-play-broken"
                  style="color: #dc143c"
                />
              </section>
              <section>
                <AButton type="text">
                  <LzyIcon name="material-symbols:edit-calendar" size="20" />
                </AButton>
                <AButton type="text">
                  <LzyIcon name="material-symbols:auto-delete-outline" size="20" />
                </AButton>
              </section>
            </div>
          </a-card>
        </a-list-item>
        <template #overlay>
          <a-menu @click="({ key }) => onMenuClick(key, item)">
            <a-menu-item key="1">
              <LzyIcon
                :name="
                  item.isEnabled != 0
                    ? 'material-symbols:motion-photos-paused-outline'
                    : 'material-symbols:motion-play-outline'
                "
              />
              {{ item.isEnabled == 0 ? "启用任务" : "暂停任务" }}
            </a-menu-item>
            <a-menu-item key="2">
              <LzyIcon name="material-symbols:not-started-outline" />
              立即执行
            </a-menu-item>
            <a-menu-item key="3">
              <LzyIcon name="material-symbols:edit-calendar" />
              编辑任务
            </a-menu-item>
            <a-menu-item key="4">
              <LzyIcon name="material-symbols:auto-delete-outline" />
              删除任务
            </a-menu-item>
            <a-menu-item key="5">
              <LzyIcon name="material-symbols:preview" />
              查看日志
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
</style>
