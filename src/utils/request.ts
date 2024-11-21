import { message } from "ant-design-vue";
import router from "@/router";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { merge } from "lodash";

interface AxiosConfig extends AxiosRequestConfig {
  baseURL?: string;
  timeout?: number;
  headers?: {
    [key: string]: string;
  };
}

// 更具体的请求方法和响应数据类型
export default function makeRequest<T = any>({
  method,
  url,
  params,
  data,
  headers,
}: AxiosConfig): Promise<T | any> {
  return new Promise(async (resolve, reject) => {
    /* 过滤参数 params 如果某个值为空则销毁这key */
    for (const key in params) {
      if (params[key] === "" || params[key] === null) {
        delete params[key];
      }
    }
    const defaultConfig: AxiosConfig = {
      baseURL: import.meta.env.VITE_BASE_URL + "/api",
      timeout: 30 * 1000,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("lzy_token") || "",
        "x-real-ip": import.meta.env.VITE_IP_ADDRESS,
      },
      withCredentials: true, // 重要：允许发送 cookies 和 HTTP 认证
    };
    // 使用深拷贝合并默认配置
    const config: AxiosConfig = merge({}, defaultConfig, { headers });

    // 创建 axios 实例
    const instance = axios.create(config);

    // 添加请求拦截器
    instance.interceptors.request.use((config) => {
      // 在请求发送之前做一些事情
      return config;
    });

    // 添加响应拦截器
    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 在响应返回之前做一些事情，例如处理错误
        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        return response.data;
      },
      (error) => {
        // 处理其他错误情况
        throw error;
      },
    );

    try {
      // 使用 async/await 简化异步代码
      const response: { code: number; msg: string; data: any } = await instance(
        {
          method,
          url,
          params,
          data,
          headers,
        },
      );

      // 根据具体的 API 结构，检查 `response.data` 和自定义的 `code`
      if (response && response.code === 200) {
        resolve(response); // 确保在这里 resolve 数据
      } else {
        const errorMsg = (response as any).msg || "请求失败";
        throw new Error(errorMsg); // 抛出错误，让 catch 块捕获
      }
    } catch (error: any) {
      const err = error as AxiosError;
      let msg = err.message;

      if (err.status === 401) {
        // 处理 token 失效的情况
        msg = "登录状态已过期，请重新登录";
        localStorage.removeItem("lzy_token");
        router.push("/login");
      } else {
        // 处理请求失败的情况
        console.error("Request failed:", error);
      }

      message.error(msg);
      reject(error); // 确保这里 reject 异常
    }
  });
}
