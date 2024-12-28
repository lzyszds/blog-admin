<template>
  <div
    class="tooltip-container"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
    tabindex="0"
    @focus="showTooltip"
    @blur="hideTooltip"
  >
    <slot />
    <div
      v-if="isVisible"
      class="tooltip-box"
      :style="tooltipStyle"
      role="tooltip"
      :id="tooltipId"
    >
      {{ content }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  placement: {
    type: String,
    default: "top", // 可以是 top, bottom, left, right 等
  },
  offset: {
    type: Number,
    default: 10, // 提示框与触发器的偏移量
  },
});

const isVisible = ref(false);
const tooltipId = `tooltip-${Math.random().toString(36).substring(2, 15)}`; // 生成唯一的 ID
const tooltipRef = ref(null);
const containerRef = ref(null);

const showTooltip = () => {
  isVisible.value = true;
};

const hideTooltip = () => {
  isVisible.value = false;
};

const tooltipStyle = computed(() => {
  // 这里可以根据 placement 计算 tooltip 的位置
  const style = {};
  if (props.placement === "top") {
    style.bottom = "100%";
    style.left = "50%";
    style.transform = "translateX(-50%)";
    style.marginBottom = `${props.offset}px`;
  } else if (props.placement === "bottom") {
    style.top = "100%";
    style.left = "50%";
    style.transform = "translateX(-50%)";
    style.marginTop = `${props.offset}px`;
  } else if (props.placement === "left") {
    style.right = "100%";
    style.top = "50%";
    style.transform = "translateY(-50%)";
    style.marginRight = `${props.offset}px`;
  } else if (props.placement === "right") {
    style.left = "100%";
    style.top = "50%";
    style.transform = "translateY(-50%)";
    style.marginLeft = `${props.offset}px`;
  }
  return style;
});

onMounted(() => {
  // 将 tooltip 的 id 设置到触发器的 aria-describedby 属性，以增强可访问性
  const triggerElement = containerRef.value
    ? containerRef.value.querySelector("*")
    : null;
  if (triggerElement) {
    triggerElement.setAttribute("aria-describedby", tooltipId);
  }
});
</script>

<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block; /* 或者你需要的其他 display 类型 */
}

/* 确保触发器可以接收焦点，以便键盘用户也能访问 tooltip */
.tooltip-container:focus {
  outline: none; /* 可以根据需要自定义焦点样式 */
}

.tooltip-box {
  position: absolute;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  text-align: left;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  width: 100%;
  transition: .3s;
}


.tooltip-box[style*="bottom"]::after {
  top: -5px;
  left: 50%;
  margin-left: -5px;
  border-bottom-color: rgba(0, 0, 0, 0.8);
  border-width: 5px;
}

.tooltip-box[style*="top"]::after {
  bottom: -5px;
  left: 50%;
  margin-left: -5px;
  border-top-color: rgba(0, 0, 0, 0.8);
  border-width: 5px;
}

.tooltip-box[style*="left"]::after {
  top: 50%;
  right: -5px;
  margin-top: -5px;
  border-left-color: rgba(0, 0, 0, 0.8);
  border-width: 5px;
}

.tooltip-box[style*="right"]::after {
  top: 50%;
  left: -5px;
  margin-top: -5px;
  border-right-color: rgba(0, 0, 0, 0.8);
  border-width: 5px;
}
</style>
