import { Alova } from "@/alova/api.ts";

// 获取所有接口列表
export const getPermissionAll = () => {
  return Alova.createGet("/permission/getAll");
};

// 修改接口权限
export const updatePermission = (data) => {
  return Alova.createPost("/permission/update", data);
};

// 获取接口所属信息
export const getBelongs = () => {
  return Alova.createGet("/permission/getBelongs");
};