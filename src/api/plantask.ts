import request from "@/utils/request";
import { Task } from "@/typings/Plantask.ts";
import { convertKeysToSnakeCase } from "@/utils/comment.ts"; // 获取邮箱任务配置

// 获取邮箱任务配置
export const getEmailTaskConfig = () => {
  return request({
    url: "/plantask/getEmailTaskConfig",
    method: "get",
  });
};

//更新邮箱任务配置
export const updateEmailTaskConfig = (data: object) => {
  return request({
    url: "/plantask/updateEmailTaskConfig",
    method: "post",
    data,
  });
};

//获取所有任务
export const getAllTask = () => {
  return request({
    url: "/plantask/tasks",
    method: "get",
  });
};

//更新任务
export const updateTask = (data: Task) => {
  data = convertKeysToSnakeCase(data);
  return request({
    url: "/plantask/updateTask",
    method: "post",
    data,
  });
};

//立即执行任务
export const runTask = (taskId: string) => {
  return request({
    url: `/plantask/tasks/${taskId}/execute`,
    method: "post",
  });
};

//禁用任务
export const disableTask = (taskId: string) => {
  return request({
    url: `/plantask/tasks/${taskId}/disable`,
    method: "post",
  });
};

//启用任务
export const enableTask = (taskId: string) => {
  return request({
    url: `/plantask/tasks/${taskId}/enable`,
    method: "post",
  });
};

//删除任务
export const deleteTask = (taskId: string) => {
  return request({
    url: `/plantask/tasks/${taskId}/delete`,
    method: "post",
  });
};

//根据任务id获取任务日志
export const getTaskLog = (taskId: string) => {
  return request({
    url: `/plantask/tasks/${taskId}/logs`,
    method: "get",
  });
};
