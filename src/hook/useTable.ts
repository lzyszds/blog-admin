export function useScrollY() {
  const { height } = useWindowSize();
  const scrollConfig = ref({
    x: 702,
    y: 400
  });

  const calculateScrollY = () => {
    nextTick(() => {
      setTimeout(() => {
        const main = document.querySelector('.ant-layout-content');
        const tool = document.querySelector('.ant-card');

        if (main && tool) {
          const toolHeight = tool.clientHeight;
          const mainHeight = main.clientHeight;
          scrollConfig.value.y = mainHeight - toolHeight - 240; // 调整这里的值以符合你的需求
        }
      }, 100);
    });
  };

  watch(
    () => height.value,
    () => {
      calculateScrollY();
    },
    { immediate: true }
  );

  return {
    scrollConfig,
    calculateScrollY,
  };
}
