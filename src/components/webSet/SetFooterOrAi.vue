<script setup lang="ts">
import { getFooterInfo, updateFooterLink } from "@/api/system";
import { WbFooterResult } from "@/typings/FooterType.ts";
import LzyIcon from "@/components/LzyIcon.vue";
import { message } from "ant-design-vue"; //底部信息

//底部信息
const { data } = await getFooterInfo();
//树状图数据
const footerInfo = ref<WbFooterResult[]>([...data]);

//当前开启的数据
const isEnableChecked = ref<string[]>([]);

//当前在修改状态的数据
const isEditChecked = ref<string[]>([]);

//当前是否处在插入数据的状态
const isInsertChecked = ref<any>({
  status: false,
  currentIndex: "",
});

//初始化选中的数据
footerInfo.value.forEach((item) => {
  if (item.status && item.children) {
    item.children.forEach((child) => {
      if (child.status) {
        isEnableChecked.value.push(child.sortOrder);
      }
    });
  }
});

//右键菜单点击事件
function onMenuClick(treeKey: string, dataRef: WbFooterResult, key: string) {
  const handleArr = [
    () => {
      //修改当前
      isEditChecked.value.push(treeKey);
    },
    () => {
      //删除当前
      for (const info of footerInfo.value) {
        if (treeKey.indexOf("-") == -1) {
          //当前是一级菜单
          footerInfo.value = footerInfo.value.filter(
            (item) => item.sortOrder !== treeKey,
          );
          //并且将当前开启的值全部删除
          isEnableChecked.value = isEnableChecked.value.filter(
            (item) => !item.match(new RegExp(`^${treeKey}-*`)),
          );
        } else {
          //当前是二级菜单
          info.children = info.children.filter(
            (item) => item.sortOrder !== treeKey,
          );
          //并且将当前开启的值删除
          isEnableChecked.value = isEnableChecked.value.filter(
            (item) => item !== treeKey,
          );
        }
      }
    },
    () => {
      if (isInsertChecked.value.status) {
        message.error("请先完成之前的插入数据操作");
        return;
      }
      // 获取当前的排序
      const [sortOrder, index] = treeKey.split("-");
      const currentCategoryIndex = footerInfo.value.findIndex(
        (item) => item.sortOrder == sortOrder,
      );
      const info = footerInfo.value[currentCategoryIndex];
      console.log(info.id);
      //插入数据
      info.children.splice(Number(index), 0, {
        name: "",
        url: "",
        sortOrder: `${sortOrder}-${index + 1}`,
        status: 1,
      } as any);
      //编辑内容
      isEditChecked.value.push(`${sortOrder}-${index + 1}`);
      //设置插入状态
      isInsertChecked.value = {
        status: true,
        currentIndex: `${sortOrder}-${index + 1}`,
      };
      // addFooterLink({
      //   category_id: "",
      //   name: "",
      //   url: "",
      //   sort_order: "",
      //   status: "",
      // });
    },
    () => {
      //启用 或 禁用当前
      const isEnable = !dataRef.status;
      dataRef.status = isEnable ? 1 : 0;
      //发送修改给后端
      updateFooterLink({
        ...dataRef,
        status: isEnable ? 1 : 0,
        sort_order: treeKey.split("-")[1],
      }).then((res) => {
        message.success(res.data);
      });
    },
  ];
  handleArr[Number(key) - 1]();
}

const save = (key) => {
  let currentData = {};
  for (const item of footerInfo.value) {
    if (key.indexOf(item.sortOrder + "-") == 0) {
      for (const child of item.children) {
        if (child.sortOrder == key) {
          currentData = child;
          break;
        }
      }
    }
  }
  //发送修改给后端
  updateFooterLink({
    ...currentData,
    sort_order: key.split("-")[1],
  }).then((res) => {
    message.success(res.data);
  });
  cancelEdit(key);
};

//取消修改
function cancelEdit(key) {
  isEditChecked.value = isEditChecked.value.filter((item) => item !== key);

  if (key == isInsertChecked.value.currentIndex) {
    //如果当前是插入新数据的状态，就取消插入状态
    isInsertChecked.value = {
      status: false,
      currentIndex: "",
    };
    // 删除当前插入的数据
    footerInfo.value.forEach((item) => {
      item.children = item.children.filter((child) => child.sortOrder !== key);
    });
  }
}
</script>

<template>
  <div style="overflow-x: auto; padding: 20px">
    <a-tree
      :showLine="true"
      :tree-data="footerInfo"
      :defaultExpandAll="true"
      blockNode
      :draggable="isEditChecked.length == 0"
      :fieldNames="{ title: 'name', key: 'sortOrder' }"
    >
      <template #title="{ dataRef, sortOrder: treeKey }">
        <a-dropdown :trigger="['contextmenu']">
          <div
            class="treeSpanInput"
            :disabled="!dataRef.status"
            :title="!dataRef.status ? '已禁用' : ''"
          >
            <template v-if="!isEditChecked.includes(treeKey)">
              <span>{{ dataRef.name }}</span>
              <span>{{ dataRef.url }}</span>
            </template>
            <template v-else>
              <AInputGroup compact>
                <AInput
                  size="small"
                  v-model:value="dataRef.name"
                  style="width: 15%"
                />
                <AInput
                  size="small"
                  v-model:value="dataRef.url"
                  style="width: 80%"
                />
                <ATooltip title="保存">
                  <AButton size="small" @click="save(treeKey)">
                    <template #icon>
                      <LzyIcon size="15" name="jam:save" />
                    </template>
                  </AButton>
                </ATooltip>
                <ATooltip title="取消">
                  <AButton size="small" @click="cancelEdit(treeKey)">
                    <template #icon>
                      <LzyIcon size="15" name="jam:close" />
                    </template>
                  </AButton>
                </ATooltip>
              </AInputGroup>
            </template>
          </div>
          <template #overlay v-if="!dataRef.children">
            <a-menu @click="({ key }) => onMenuClick(treeKey, dataRef, key)">
              <a-menu-item key="1">修改当前</a-menu-item>
              <a-menu-item key="2">删除当前</a-menu-item>
              <a-menu-item key="3">插入数据</a-menu-item>
              <a-menu-item key="4"
                >{{ !dataRef.status ? "启用当前" : "禁用当前" }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-tree>
  </div>
</template>

<style scoped>
.treeSpanInput {
  display: flex;
  gap: 20px;
  align-items: center;
  border-radius: 5px;
  padding-left: 10px;

  &[disabled="true"] {
    /*background: rgba(241, 241, 241, 0.59);*/
    /*禁用特效*/
    color: #888;
    background: #f7f7f7;
  }

  span {
    text-wrap: nowrap;
  }
}

:deep(.ant-tree-checkbox) {
  margin-block-start: 0;
}

:deep(.ant-tree) {
  .ant-tree-checkbox + span.ant-tree-node-selected {
    background-color: transparent;
  }

  .ant-tree-checkbox + span:hover {
    background-color: transparent;
  }
}
</style>
