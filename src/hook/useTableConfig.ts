import { ref, watch, nextTick, onMounted } from 'vue'

export function useScrollY() {
  const { width, height } = useWindowSize()
  const scrollConfig = ref({
    x: 702,
    y: 400
  })

  const calculateScrollY = () => {
    nextTick(() => {
      const main = document.querySelector('.ant-layout-content')
      const tool = document.querySelector('.ant-card')

      if (main && tool) {
        const toolHeight = tool.clientHeight
        const mainHeight = main.clientHeight
        scrollConfig.value.y = mainHeight - toolHeight - 190 // 调整这里的值以符合你的需求
      }
    })
  }
  /* 监听窗口大小变化 */
  watch([width, height], () => { setTimeout(calculateScrollY, 50) }, { immediate: true })

  onMounted(() => {
    // 初始计算可能需要一些时间，所以我们在组件挂载后延迟执行
    setTimeout(calculateScrollY, 50)
  })

  return {
    scrollConfig,
    calculateScrollY,
  }
}