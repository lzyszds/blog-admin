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



