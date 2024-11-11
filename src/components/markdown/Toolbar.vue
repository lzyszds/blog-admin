<template>
  <div class="toolbar">
    <template v-for="item in leftBtnConfig">
      <template v-if="item.tip && !item.menus">
        <ToolbarButton :title="item.tip" :icon-name="item.icon" @click="item.action" />
      </template>
      <template v-else-if="item.menus && item.name != 'rightFixed'">
        <a-popover trigger="click" overlayClassName="diySelect">
          <template #content>
            <template v-for="menu in item.menus">
              <p @click="uploadContent(menu)">
                <LzyIcon :size="menu.iconSize ?? 20" v-if="menu.icon" :name="menu.icon" />
                {{ menu.name }}
              </p>
            </template>
          </template>
          <ToolbarButton
            :icon-name="item.icon"
            :icon-size="item.iconSize"
            :title="item.tip"
            style="width: 50px; display: flex; align-items: center"
          >
            <LzyIcon size="20" name="lets-icons:arrow-drop-down" />
          </ToolbarButton>
        </a-popover>
      </template>
      <template v-else-if="item.name == 'hr'">
        <div class="divider"></div>
      </template>
    </template>

    <section class="rightTools">
      <!-- 右侧按钮 -->
      <template v-for="item in rightBtnConfig">
        <ToolbarButton
          :active="item.active"
          :title="item.tip"
          :icon-name="item.icon"
          @click="item.action"
        />
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import ToolbarButton from "./ToolbarButton.vue";
import useImplement from "./utils/implement";
const editor: any = inject("editor")!;

const { leftBtnConfig, rightBtnConfig } = useImplement(editor);

const emit = defineEmits(["updateImage"]);

const uploadContent = async (menu) => {
  if (menu.isUpload) {
    try {
      const { isSupported, file, open } = useFileSystemAccess();
      if (!isSupported) {
        alert("当前浏览器不支持此功能");
        return;
      }
      await open();
      emit("updateImage", menu.action, [file.value]);
    } catch {}
  } else {
    menu.action();
  }
};
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #ffffff;
  flex-wrap: wrap;
}

.divider {
  width: 1px;
  height: 1.1rem;
  border-right: 1px solid #aeaeae;
}

.diySelect {
  p {
    cursor: pointer;
    padding: 5px 12px;
    margin: 0;
    border-radius: 5px;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 5px;
    &:hover {
      background-color: #e2e8f0;
    }
    svg {
      display: flex;
      align-self: self-end;
    }
  }
}
.rightTools {
  display: flex;
  gap: 5px;
}
</style>
