import { Task } from "@/typings/Plantask.ts";
import { convertKeysToSnakeCase } from "@/utils/comment.ts";
import { Alova } from "@/alova/api.ts"; // 获取邮箱任务配置

// 获取邮箱任务配置
export const getEmailTaskConfig = () => {
  return Alova.createGet("/plantask/getEmailTaskConfig");
};

//更新邮箱任务配置
export const updateEmailTaskConfig = (data: object) => {
  return Alova.createPost("/plantask/updateEmailTaskConfig", data);
};

//获取所有任务
export const getAllTask = () => {
  return Alova.createGet("/plantask/tasks");
};

//更新任务
export const updateTask = (data: Task) => {
  data = convertKeysToSnakeCase(data);
  return Alova.createPost("/plantask/updateTask", data);
};

//立即执行任务
export const runTask = (taskId: string) => {
  return Alova.createPost(`/plantask/tasks/${taskId}/execute`);
};

//禁用任务
export const disableTask = (taskId: string) => {
  return Alova.createPost(`/plantask/tasks/${taskId}/disable`);
};

//启用任务
export const enableTask = (taskId: string) => {
  return Alova.createPost(`/plantask/tasks/${taskId}/enable`);
};

//删除任务
export const deleteTask = (taskId: string) => {
  return Alova.createPost(`/plantask/tasks/${taskId}/delete`);
};

//根据任务id获取任务日志
export const getTaskLog = (taskId: string) => {
  return Alova.createGet(`/plantask/tasks/${taskId}/logs`);
};
