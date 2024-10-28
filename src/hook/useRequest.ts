
/**
 * 请求封装，返回 loading、error、data 等状态
 * @param apiFunction 请求函数
*/
export function useRequest(apiFunction: (...args: any[]) => Promise<any>, throttleDelay = 1000) {
  const loading = ref<boolean>(false); // 用于跟踪加载状态
  const error = ref(null);    // 跟踪错误信息
  const data = ref<any>(null);     // 请求结果数据

  const nextRequest = async (...args) => {
    loading.value = true;      // 开始请求时设置 loading 状态
    error.value = null;
    console.log(123);

    try {
      data.value = await apiFunction(...args);
    } catch (err: any) {
      error.value = err;       // 捕获错误
      if (error) {
        console.error(JSON.stringify(apiFunction));
      }
    } finally {
      loading.value = false;   // 请求完成后取消 loading 状态
    }
  };

  // 使用 useThrottleFn 包装 request 函数，实现节流
  const throttledRequest = '' //useThrottleFn(nextRequest, throttleDelay)

  return { data, loading, error, nextRequest, throttledRequest };
}