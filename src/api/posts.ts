import { convertKeysToSnakeCase } from "@/utils/comment";
import request from "@/utils/request";


// 获取文章列表
export const articleList = (params) => {
  if (isRef(params)) params = unref(params);
  params.pages = params.pages
  return request({
    url: "/article/getArticleList",
    method: "get",
    params
  });
}

//获取文章详情页
export const articleDetail = (params) => {
  if (isRef(params)) params = unref(params);
  params.pages = params.pages
  return request({
    url: "/article/getArticleDetail",
    method: "get",
    params
  });
}

// 发表文章
export const articleAdd = (params) => {
  if (isRef(params)) params = unref(params);
  // 将参数转换为 snake_case 下划线形式
  params = convertKeysToSnakeCase(params)
  return request({
    url: "/article/addArticle",
    method: "post",
    data: params,
  });
}

// 修改文章
export const articleEditor = (params) => {
  if (isRef(params)) params = unref(params);
  // 将参数转换为 snake_case 下划线形式
  params = convertKeysToSnakeCase(params)
  return request({
    url: "/article/updateArticle",
    method: "post",
    data: params,
  });
}

// 删除文章
export const articleDelete = (params) => {
  return request({
    url: "/article/deleteArticle",
    method: "post",
    data: params,
  });
}


//获取所有文章分类
export const getArticleCategory = () => {
  return request({
    url: "/article/getArticleTypeList",
    method: "get",
  });
}

//添加文章分类
export const addArticleCategory = (params) => {
  return request({
    url: "/article/addArticleType",
    method: "post",
    data: params,
  });
}

//删除文章分类
export const deleteArticleCategory = (params) => {
  return request({
    url: "/article/deleteArticleType",
    method: "post",
    data: params,
  });
}
