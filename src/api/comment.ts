import { Alova } from "@/alova/api.ts"; // 获取评论列表

// 获取评论列表
export const getCommentList = (params) => {
  if (isRef(params)) params = unref(params);
  return Alova.createGet("/comment/getAllComment", { params });
};

// // 修改评论
// export const editComment = (params) => {
//   return Alova.createGet("/comment/editComment", { params });
// };

// 删除评论
export const deleteComment = (params) => {
  if (isRef(params)) params = unref(params);
  return Alova.createPost("/comment/deleteComment", params);
};
