import { Avatar, Button, message, Popconfirm, TableProps, Tag } from "ant-design-vue";
import { Column, Params } from "@/typings/Column";
export const getcommentColumns = (params: Params) => {
  let columns: TableProps['columns'] = [
    {
      title: "ID",
      dataIndex: "commentId",
      key: "commentId",
      width: "80px",
    },
    {
      title: "头像",
      dataIndex: "headImg",
      key: "headImg",
      width: "80px",
      // 可用于显示图片或设置渲染方法
      customRender: ({ text }) => {
        return h(Avatar, { src: import.meta.env.VITE_BASE_URL + text, shape: "square" });
      },
    },
    {
      title: "评论文章ID",
      dataIndex: "articleId",
      key: "articleId",
      width: "100px",

    },
    {
      title: "评论楼层ID",
      dataIndex: "groundId",
      key: "groundId",
      width: "100px",
    },
    {
      title: "回复评论ID",
      dataIndex: "replyId",
      key: "replyId",
      width: "100px",
    },
    {
      title: "昵称",
      dataIndex: "userName",
      key: "userName",
      width: "100px",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
      width: "150px",
    },
    {
      title: "评论内容",
      dataIndex: "content",
      key: "content",
      width: "200px",
    },
    {
      title: "评论日期",
      dataIndex: "createDate",
      key: "createDate",
      customRender: ({ text }) => {
        return useDateFormat(text * 1000, "YYYY-MM-DD").value;
      },
      width: "100px",
    },
    {
      title: "设备系统",
      dataIndex: "deviceSystem",
      key: "deviceSystem",
      width: "100px",
    },
    {
      title: "客户端",
      dataIndex: "browserSystem",
      key: "browserSystem",
      width: "140px",
    },
    {
      title: "用户IP",
      dataIndex: "userIp",
      key: "userIp",
      width: "100px",

    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      width: "80px",
      customRender: ({ record }) => {
        return [
          h(
            Popconfirm,
            {
              title: "确定删除该用户吗？",
              cancelText: "取消",
              okText: "确定",
              onConfirm: async () => {
                const result: any = await params.delData(record);
                if (result.data) {
                  message.success(result.data);
                  params.getData();
                }
              },
            },
            {
              default: () =>
                h(
                  Button,
                  {
                    type: "primary",
                    size: "small",
                    danger: true,
                    style: { fontSize: "12px", },
                  },
                  { default: () => "删除" } // 插槽内容
                ),
            }
          ),
        ];
      },
    },
  ]

  columns = columns.map((item) => {
    return { ...item, ellipsis: true, checked: true };
  });

  return columns;
};