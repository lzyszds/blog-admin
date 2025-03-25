<script setup lang="ts">
import { getBelongs, getPermissionAll } from "@/api/permission";

interface Tabledata {
  key: string;
  belong: string;
  title: string;
  method: string;
  description: string;
  createdAt: string;
  permissions: number;
}
const tableWrapperRef = ref<HTMLElement | null>(null);
const { height } = useElementSize(tableWrapperRef);

const current = ref("all");

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

const tableData = ref<Tabledata[]>([]); // 表格数据
const oldData = ref<Tabledata[]>([]); // 旧数据
const searchValue = ref(""); // 搜索值
const belongs = ref([
  { label: "全部接口", value: "all" },
  { label: "公开访问", value: "public" },
  { label: "普通用户和管理员", value: "userAdmin" },
  { label: "管理员", value: "admin" },
  { label: "特殊权限", value: "special" },
]);

const initData = async (force: boolean = false) => {
  const { data } = await getPermissionAll().send(force);
  const { data: belongsList } = await getBelongs().send(force);
  if (!data || !belongs) return;
  belongsList.forEach((item) => {
    belongs.value.push({
      label: item.ibLabel,
      value: item.ibValue,
    });
  });
  tableData.value = data.map((item) => {
    return {
      key: item.interfaceId,
      belong: item.interfaceBelong,
      title: item.interfaceName,
      method: item.interfaceMethod,
      description: item.interfaceDesc,
      createdAt: item.createdAt,
      permissions: item.interfacePermissions,
    };
  });
  oldData.value = [...toRaw(tableData.value)];
};

await initData();

watch(current, (value) => {
  if (value === "all") {
    tableData.value = [...toRaw(oldData.value)];
  } else if (value === "public") {
    tableData.value = oldData.value.filter((item) => item.permissions == 0);
  } else if (value === "userAdmin") {
    tableData.value = oldData.value.filter((item) => item.permissions == 1);
  } else if (value === "admin") {
    tableData.value = oldData.value.filter((item) => item.permissions == 2);
  } else if (value === "special") {
    tableData.value = oldData.value.filter((item) => item.permissions == 3);
  } else {
    tableData.value = oldData.value.filter((item) => item.belong == value);
  }
});
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
      title="接口权限列表"
      :bordered="false"
      :body-style="{ overflow: 'auto', padding: '10px 0', height: '90%' }"
      :style="{ height: height - 150, overflow: 'hidden' }"
      ref="tableWrapperRef"
    >
      <template #extra>
        <div style="display: flex; gap: 10px">
          <a-input
            v-model:value="searchValue"
            style="width: auto"
            placeholder="搜索接口名称或路径..."
          />
        </div>
      </template>
      <main class="contentCard">
        <a-list item-layout="horizontal" :data-source="tableData ?? []">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta>
                <template #description>
                  <a-tag color="default" style="user-select: all; cursor: pointer">
                    {{ item.title }}
                  </a-tag>
                </template>
                <template #title>
                  {{ item.description }}
                </template>
                <template #avatar>
                  <a-tag color="blue">{{ item.method }} </a-tag>
                  <p style="margin: 6px 5px; color: #999; font-size: 12px">
                    #{{ item.key }}
                  </p>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
        <section class="selectBelong">
          <button
            v-for="item in belongs"
            @click="current = item.value"
            :class="{ checked: current === item.value }"
          >
            {{ item.label }}
          </button>
        </section>
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
  position: relative;

  .selectBelong {
    padding: 5px;
    background-color: var(--color-card-bg);
    z-index: 99;
    width: 95%;
    border-radius: 10px;
    position: sticky;
    bottom: 0%;
    left: 2%;
    box-shadow: 0px 0px 2px 0px #0000001f;
    border: 1px solid #000000;
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
  :deep(h4) {
    margin: 0;
  }
  :deep(.ant-list-item-meta-avatar) {
    width: 40px;
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
}
</style>
