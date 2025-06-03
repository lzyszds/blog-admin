<script setup lang="ts">
import { getBelongs, getPermissionAll, getComponent, getByName } from "@/api/permission";
import { useScrollY } from "@/hook/useTableConfig";
import { getPermissionColumns } from "@/table/permissionColumns";


interface ApiData {
  key: string;
  belong: string;
  title: string;
  method: string;
  description: string;
  createdAt: string;
  permissions: number;
}

interface ComponentData {
  id: string;
  key: string;
  permissions: number;
  name: string;
  description: string;
  createdAt: string;
}


const {scrollConfig} = useScrollY();


const tableWrapperRef = ref<HTMLElement | null>(null);
const { height } = useElementSize(tableWrapperRef);

const showValue = ref("api"); // 当前显示的权限类型（接口/组件）
const current = ref("public"); // 当前选中的api权限类型

const powerList = ref([
  {
    title: "公开访问",
    icon: "hugeicons:view",
    description: "无需登录即可访问",
    sumValue: 0,
    roles: ["所有人"],
  },
  {
    title: "普通用户和管理员",
    icon: "hugeicons:user-id-verification",
    description: "需要登录权限即可访问",
    sumValue: 0,
    roles: ["普通用户", "管理员"],
  },
  {
    title: "管理员",
    icon: "hugeicons:ai-security-01",
    description: "仅管理员可访问",
    sumValue: 0,
    roles: ["管理员"],
  },
  {
    title: "特殊权限",
    icon: "hugeicons:complaint",
    description: "特殊权限",
    sumValue: 0,
    roles: ["特殊权限"],
  },
]);

const apiData = ref<ApiData[]>([]); // 接口权限数据
const oldApiData = ref<ApiData[]>([]); // 旧接口权限数据
const componentData = ref<ComponentData[]>([]); // 组件权限数据
const oldComponentData = ref<ComponentData[]>([]); // 旧组件权限数据

const searchValue = ref(""); // 搜索值

const belongs = ref([
  { label: "全部接口", value: "all" },
  { label: "公开访问", value: "public" },
  { label: "普通用户和管理员", value: "userAdmin" },
  { label: "管理员", value: "admin" },
  { label: "特殊权限", value: "special" },
]);

const permissionLevels = [
  { index: 0, permissions: [0], label: "所有人", color: "#eee" },
  { index: 1, permissions: [0, 1], label: "普通用户", color: "#55ACEE" },
  { index: 2, permissions: [0, 1, 2], label: "管理员", color: "#ff4d4f" },
  { index: 3, permissions: [3], label: "特殊权限", color: "#5860f6" },
];

// 处理接口权限数据
const processApiData = (apiList, isCache = true) => {
  apiData.value = apiList.map((item) => ({
    key: item.interfaceId,
    belong: item.interfaceBelong,
    title: item.interfaceName,
    method: item.interfaceMethod,
    description: item.interfaceDesc,
    createdAt: item.createdAt,
    permissions: item.interfacePermissions,
  }));
  if (!isCache) return;
  oldApiData.value = [...toRaw(apiData.value)];
};

// 处理组件权限数据
const processComponentData = (componentList) => {
  componentData.value = componentList.map((item) => ({
    id: item.componentId,
    key: item.componentKey,
    permissions: item.componentPermissions,
    name: item.componentName,
    description: item.description,
    createdAt: item.createdAt,
  }));
  oldComponentData.value = [...toRaw(componentData.value)];
};
// 初始化请求
const initData = async (force: boolean = false) => {
  const { data: apiList } = await getPermissionAll().send(force);
  const { data: componentList } = await getComponent().send(force);
  const { data: belongsList } = await getBelongs().send(force);
  if (!apiList || !belongs || !componentList) return;

  belongsList.forEach((item) => {
    belongs.value.push({ label: item.ibLabel, value: item.ibValue });
  });

  processApiData(apiList);
  processComponentData(componentList);

  // 计算权限数量
  const calculatePermissionCount = (permissions: number[]) => {
    return apiData.value.filter((item) => permissions.includes(item.permissions)).length;
  };
  permissionLevels.forEach(({ index, permissions }) => {
    powerList.value[index].sumValue = calculatePermissionCount(permissions);
  });
};

await initData();

// 权限过滤器
const permissionFilters: Record<string, (item: ApiData) => boolean> = {
  all: () => true,
  public: (item) => item.permissions === 0,
  userAdmin: (item) => item.permissions === 1,
  admin: (item) => item.permissions === 2,
  special: (item) => item.permissions === 3,
};

watch(
  current,
  (value) => {
    const filterFn = permissionFilters[value] || ((item) => item.belong === value);
    apiData.value = oldApiData.value.filter(filterFn);
  },
  {
    immediate: true,
  }
);

// 控制显示或隐藏
const filterHide = (arr: any[], value) => {
  if (value == 0 && arr[0] == 0) {
    return false;
  }
  return arr.includes(value);
};

// 搜索功能
const searchChange = async () => {
  const { data } = await getByName({
    name: searchValue.value,
  }).send(true);
  if (!data) apiData.value = oldApiData.value;
  processApiData(data, false);
};

const columns = getPermissionColumns(permissionLevels);
</script>

<template>
  <section style="display: flex; flex-direction: column; gap: 10px; height: 100%">
    <ACard :bordered="false">
      <template #title>
        权限级别说明
        <span style="margin: 0; color: #999; font-size: 13px; font-weight: 100">
          系统中使用的权限级别定义
        </span>
      </template>
      <main class="describe">
        <div class="viewPower" v-for="item in powerList" :key="item.title">
          <LzyIcon :name="item.icon" size="50" />
          <div class="viewPowerTitle">{{ item.title }}</div>
          <div class="viewPowerValue">
            数量: {{ item.sumValue ? item.sumValue : "暂无" }}
          </div>
          <div class="viewPowerDesc">{{ item.description }}</div>
        </div>
      </main>
    </ACard>
    <ACard
      title="接口权限、组件权限列表"
      :bordered="false"
      :body-style="{ padding: '10px 0', height: '90%',overflow: 'hidden', }"
      :style="{ height: height - 150, overflow: 'hidden', flex: 1 }"
      ref="tableWrapperRef"
    >
      <template #extra>
        <div style="display: flex; gap: 10px">
          <a-input
            v-model:value="searchValue"
            style="width: 240px"
            placeholder="搜索接口名称或路径..."
            @keydown.enter="searchChange"
          />
        </div>
      </template>
      <main class="contentCard">
        <!-- 切换权限组件（接口/组件） -->
        <a-radio-group v-model:value="showValue" button-style="solid">
          <a-radio-button value="api">接口权限管理</a-radio-button>
          <a-radio-button value="components">组件权限管理</a-radio-button>
        </a-radio-group>

        <!-- 接口权限管理 -->
        <template v-if="showValue == 'api'">
          <div class="selectBelong">
            <button
              v-for="item in belongs"
              @click="current = item.value"
              :class="{ checked: current === item.value }"
            >
              {{ item.label }}
            </button>
          </div>
          <section class="apiPermission">
            <ATable
              ref="tableWrapperRef"
              :columns="columns"
              :data-source="apiData ?? []"
              :scroll="{
                x: scrollConfig.x,
                y: scrollConfig.y - 120,
              }"
              size="small"
              row-key="uid"
            />
          </section>
        </template>

        <template v-else>
          <section class="componentPermission">
            <h3>组件权限管理</h3>
            <a-list item-layout="horizontal" :data-source="componentData ?? []">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta>
                    <template #description>
                      <a-tag color="default" style="user-select: all; cursor: pointer">
                        {{ item.description }}
                      </a-tag>
                      <!-- 权限允许人员标签 -->
                      <a-tag
                        v-for="level in permissionLevels"
                        v-show="filterHide(level.permissions, item.permissions)"
                        :color="level.color"
                      >
                        {{ level.label }}
                      </a-tag>
                    </template>
                    <template #title>
                      {{ item.name }}
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </section>
        </template>
      </main>
    </ACard>
  </section>
</template>

<style scoped>
.describe {
  display: grid;
  grid-template-columns: repeat(4, minmax(230px, 1fr));
  gap: 10px;
  height: 100%;
  .viewPower {
    display: grid;
    grid-template-columns: 50px 1fr;
    grid-template-areas:
      "icon title"
      "icon value"
      "icon desc";
    gap: 0 10px;
    padding: 10px;
    border-radius: 5px;
    align-items: center;

    .LzyIcon {
      grid-area: icon;
    }

    .viewPowerTitle {
      grid-area: title;
      font-size: 16px;
      font-weight: 500;
    }
    .viewPowerValue {
      grid-area: value;
      font-size: 14px;
      color: #999;
    }
    .viewPowerDesc {
      grid-area: desc;
      font-size: 14px;
      color: #999;
    }
  }
}

.contentCard {
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0 24px;
  height: 100%;
  gap: 13px;

  .ant-radio-group {
    border-radius: 5px;
    padding: 5px;
    background-color: var(--color-card-bg);
    display: flex;

    .ant-radio-button-wrapper {
      border-radius: 5px;
      border: none;
      flex: 1;
      text-align: center;
      background-color: #fff;
      color: #000;
    }

    :not(.ant-radio-button-wrapper-checked) {
      border: none;
      background-color: transparent;
      color: #999;
    }
    ::before {
      display: none;
    }
  }

  .selectBelong {
    padding: 5px;
    background-color: var(--color-card-bg);
    width: 100%;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 2px;

    button {
      padding: 5px 10px;
      margin-right: 5px;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s;
      color: var(--color-card-text);
      transition: none;
      background-color: transparent;
      border: none;
      &:hover {
        background-color: #e6f7ff;
      }
      &.checked {
        background-color: var(--themeColor);
        color: #fff;
      }
    }
  }

  .apiPermission,
  .componentPermission {
    height: 100%;
  }

  :deep(h4) {
    margin: 0;
  }
  :deep(.ant-tag) {
    margin-inline-end: 2px;
  }

  :deep(.ant-table-wrapper) .ant-table-pagination.ant-pagination {
    margin: 0;
    margin-top: 10px;
  }
}

@media screen and (max-width: 1280px) {
  .describe {
    grid-template-columns: repeat(2, minmax(230px, 1fr));
    justify-content: center;
  }
}

@media screen and (max-width: 576px) {
  .describe {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    justify-content: center;
    .viewPower {
      display: flex;
      flex-direction: column;

      .viewPowerTitle {
        font-size: 14px;
      }
      .viewPowerValue {
        font-size: 12px;
      }
      .viewPowerDesc {
        font-size: 12px;
      }
    }
  }
  .contentCard {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas: "selectBelong" "apiPermission" "componentPermission";
    height: auto;
    overflow: scroll;
  }
  :deep(.ant-card-body) {
    overflow-y: auto;
  }
}
</style>
