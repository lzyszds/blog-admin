// 获取后台首页数据
import { Alova } from "@/alova/api.ts";

//获取后台首页数据
export const getAdminHomeData = () => {
  return Alova.createGet("/toolkit/getAdminHomeData");
};

//获取天气api
export const getWeather = () => {
  return Alova.createGet("/toolkit/getWeather");
};

//获取已存进图库中的图片
export const getPictureBedImageList = () => {
  return Alova.createGet("/toolkit/getPictureBedImageList");
};

//将图片上传至图库
export const uploadImageToPictureBed = (data: any) => {
  return Alova.createPost("/toolkit/uploadImageToPictureBed", data);
};

//删除图库中的图片以及数据库存储中的记录
export const deletePictureBedImage = (data: any) => {
  return Alova.createPost("/toolkit/deletePictureBedImage", data);
};
