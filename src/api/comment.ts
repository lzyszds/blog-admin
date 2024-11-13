import request from "@/utils/request";


// 获取评论列表
export const getCommentList = (params) => {
  if (isRef(params)) params = unref(params);
  return request({
    url: "/comment/getAllComment",
    method: "get",
    data: params,
  });
}



// 修改评论
export const editComment = (params) => {
  return request({
    url: "/comment/editComment",
    method: "post",
    data: params,
  });
}

// 删除评论
export const deleteComment = (id) => {
  return request({
    url: "/comment/deleteComment",
    method: "post",
    data: {
      ids: id,
    },
  });
}


