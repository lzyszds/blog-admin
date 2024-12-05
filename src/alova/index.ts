//index.js
import { createAlova, Method } from "alova";

// v3.0
import adapterFetch from "alova/fetch";
import VueHook from "alova/vue";
import { message } from "ant-design-vue";

export const AlovaInstance = createAlova({
  baseURL: import.meta.env.VITE_BASE_URL+'/api',
  statesHook: VueHook,
  // 请求适配器，这里我们使用fetch请求适配器
  requestAdapter: adapterFetch(),

  // 设置全局的请求拦截器，与axios相似
  beforeRequest() {

  },
  responded: {
    // 请求成功的拦截器
    // 当使用GlobalFetch请求适配器时，第一个参数接收Response对象
    // 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
    onSuccess: async (response, _method: Method) => {
      if (response.status >= 400) {
        throw new Error(response.statusText);
      }
      const json = await response.json();
      if (json.code !== 200) {
        // 抛出错误或返回reject状态的Promise实例时，此请求将抛出错误
        throw new Error(json.message);
      }
      // 解析的响应数据将传给method实例的transformData钩子函数，这些函数将在后续讲解
      return json;
    },

    // 请求失败的拦截器
    // 请求错误时将会进入该拦截器。
    // 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
    onError: (error, _method: Method) => {
      message.error(
        error.message == "Failed to fetch" ? "网络错误" : error.message,
      );
    },

    // 请求完成的拦截器
    // 当你需要在请求不论是成功、失败、还是命中缓存都需要执行的逻辑时，可以在创建alova实例时指定全局的`onComplete`拦截器，例如关闭请求 loading 状态。
    // 接收当前请求的method实例
    onComplete: async (_method: Method) => {
      // 处理请求完成逻辑
    },
  },
});