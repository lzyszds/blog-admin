// 获取系统配置
import { Alova } from "@/alova/api.ts";

export const getSystemConfig = () => {
  return Alova.createGet("/system/getSystemConfig?type=admin");
};

//新增系统配置
export const addSystemConfig = (data: object) => {
  return Alova.createPost("/system/addSystemConfig", data);
};

// 更新系统配置
export const updateSystemConfig = (data: object) => {
  return Alova.createPost("/system/updateSystemConfig", data);
};

// 获取系统图片懒加载的图片
export const getSystemLoadImages = () => {
  return Alova.createGet("/system/getSystemLoadImages");
};

// 获取底部信息
export const getFooterInfo = () => {
  return Alova.createGet("/system/getFooterInfo");
};

// 新增底部信息
export const addFooterInfo = (data: object) => {
  return Alova.createPost("/system/addFooterInfo", data);
};

// 新增二级底部信息
export const addFooterLink = (data: object) => {
  return Alova.createPost("/system/addFooterLink", data);
};

// 更新底部信息
export const updateFooterInfo = (data: object) => {
  return Alova.createPost("/system/updateFooterInfo", data);
};

//更新页脚一级分类信息
export const updateFooterCategory = (data: object) => {
  return Alova.createPost("/system/updateFooterCategory", data);
};

//更新页脚二级分类信息
export const updateFooterLink = (data: object) => {
  return Alova.createPost("/system/updateFooterLink", data);
};
