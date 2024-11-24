import request from "@/utils/request";


// 获取后台首页数据
export const getAdminHomeData = ()=> {
  return request({
    url: "/toolkit/getAdminHomeData",
    method: "get",
  });
}

//获取天气api
export const getWeather = ()=> {
  return request({
    url: "/toolkit/getWeather",
    method: "get",
  });
}

//获取已存进图库中的图片
export const getPictureBedImageList = ()=> {
  return request({
    url: "/toolkit/getPictureBedImageList",
    method: "get",
  });
}

//将图片上传至图库
export const uploadImageToPictureBed = (data: any)=> {
  return request({
    url: "/toolkit/uploadImageToPictureBed",
    method: "post",
    data
  });
}

//删除图库中的图片以及数据库存储中的记录
export const deletePictureBedImage = (data: any)=> {
  return request({
    url: "/toolkit/deletePictureBedImage",
    method: "post",
    data
  });
}



