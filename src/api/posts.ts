// 获取文章列表
import { Alova } from "@/alova/api.ts";
import { convertKeysToSnakeCase } from "@/utils";

export const articleList = (params) => {
  if (isRef(params)) params = unref(params);
  params.pages = params.pages;
  return Alova.createGet("/article/getArticleList", {params});
};

//获取文章详情页
export const articleDetail = (params) => {
  if (isRef(params)) params = unref(params);
  params.pages = params.pages;
  return Alova.createGet("/article/getArticleDetail", {params});
};

// 发表文章
export const articleAdd = (params) => {
  if (isRef(params)) params = unref(params);
  // 将参数转换为 snake_case 下划线形式
  params = convertKeysToSnakeCase(params);
  return Alova.createPost("/article/addArticle", params);
};

// 修改文章
export const articleEditor = (params) => {
  if (isRef(params)) params = unref(params);
  // 将参数转换为 snake_case 下划线形式
  params = convertKeysToSnakeCase(params);
  return Alova.createPost("/article/updateArticle", params);
};

// 删除文章
export const articleDelete = (params) => {
  return Alova.createPost("/article/deleteArticle", params);
};

//获取所有文章分类
export const getArticleCategory = () => {
  return Alova.createGet("/article/getArticleTypeList");
};

//添加文章分类
export const addArticleCategory = (params) => {
  return Alova.createPost("/article/addArticleType", params);
};

//删除文章分类
export const deleteArticleCategory = (params) => {
  return Alova.createPost("/article/deleteArticleType", params);
};

//禁用文章
export const disableArticle = (params) => {
  return Alova.createPost("/article/disableArticle", params);
};
