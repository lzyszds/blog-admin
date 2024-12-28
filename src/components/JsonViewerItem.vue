<script setup lang="ts">
import { computed, defineProps, ref } from "vue";
import LzyIcon from "@/components/LzyIcon.vue";

interface Props {
  keyName?: string;
  value: any;
  indent: number;
}

// 判断数据是否为对象
const isObject = (data: any) => {
  return typeof data === "object" && data !== null; // 更严谨的对象判断，排除 null
};

const props = defineProps<Props>();

const isExpanded = ref(false);

const isExpandable = computed(
  () => isObject(props.value) || Array.isArray(props.value),
);

const toggleExpand = () => {
  if (isExpandable.value) {
    isExpanded.value = !isExpanded.value;
  }
};

const formatValue = (val: any) => {
  if (typeof val === "string") {
    return `"${val}"`;
  }
  return String(val);
};

// //省略显示部分值
// const omitValue = (val: any) => {
//   try {
//     return Object.keys(val).length > 0 ? "{...}" : "{}";
//   } catch (error) {
//     return val;
//   }
// };
</script>
<template>
  <div
    class="json-viewer-item"
    :style="{ 'padding-left': 5 + 'px' }"
    @click="toggleExpand"
  >
    <span v-if="keyName" class="key">
      <span class="expand-icon" v-if="isExpandable">
        <span :class="{isExpanded}"><LzyIcon name="jam:chevron-right" /></span>
      </span>
      {{ keyName }}:
    </span>
    <template v-if="isObject(value)">
      <span class="type">{</span>
      <div v-show="isExpanded" class="children">
        <JsonViewerItem
          v-for="(item, key) in value"
          :key="key"
          :key-name="String(key)"
          :value="item"
          :indent="indent + 1"
        />
      </div>
      <span class="type"><span v-show="!isExpanded">...</span>}</span>
    </template>
    <template v-else-if="Array.isArray(value)">
      <span class="type">[</span>
      <div v-show="isExpanded" class="children">
        <JsonViewerItem
          v-for="(item, index) in value"
          :key="index"
          :value="item"
          :indent="indent + 1"
        />
      </div>
      <span class="type">]</span>
    </template>
    <template v-else>
      <span class="value">{{ formatValue(value) }}</span>
    </template>
  </div>
</template>
<style scoped>
.json-viewer-item {
  line-height: 1.5;
  padding-left: 20px;
  position: relative;
}

.key {
  cursor: pointer;
}

.expand-icon {
  color:  #e94a4a;
  position: absolute;
  left: -10px;
  svg{
    transition: .12s;
    transform: rotate(0deg);
  }

  .isExpanded {
    svg{
      transform: rotate(90deg);
    }
  }
}

.type {
  color: #e94a4a;
}

.value {
  color: #e94a4a;
}

.children {
  margin-left: 10px;
  border-left: 1px dotted #ccc;
  padding-left: 10px;
}
</style>
