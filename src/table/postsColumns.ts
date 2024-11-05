import { Avatar, Button, message, Popconfirm } from "ant-design-vue";
import { Column, Params } from "@/typings/Column";

export const getArticleColumns = (params: Params) => {
  const columns = ref<Column[]>([
    {
      title: "ID",
      dataIndex: "aid",
      key: "aid",
      width: "80px",
    },
    {
      title: "封面",
      dataIndex: "coverImg",
      key: "coverImg",
      width: "80px",
      // 可用于显示图片或设置渲染方法
      customRender: ({ text }) => {
        return h(Avatar, { src: "/hono/static" + text, shape: "square" });
      },
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      width: "200px",
    },
    {
      title: "浏览量",
      dataIndex: "accessCount",
      key: "accessCount",
      width: "80px",
    },
    {
      title: "评论量",
      dataIndex: "commentsCount",
      key: "commentsCount",
      width: "80px",
    },

    {
      title: "发布日期",
      dataIndex: "createDate",
      key: "createDate",
      customRender: ({ text }) => {
        return useDateFormat(text, "YYYY-MM-DD").value;
      },
      width: "120px",
    },
    {
      title: "修改日期",
      dataIndex: "modifiedDate",
      key: "modifiedDate",
      width: "100px",
      customRender: ({ text }) => {
        if (!text) return "暂无";
        return useTimeAgo(text).value;
        // return useDateFormat(text, 'YYYY-MM-DD').value
      },
    },

    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      width: "120px",
      customRender: ({ record }) => {
        return [
          h(
            Button,
            {
              type: "primary",
              size: "small",
              style: { fontSize: "12px" },
              onClick: () => params.openModal(record),
            },
            { default: () => "编辑" } // 插槽内容
          ),
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
                    style: { fontSize: "12px", marginLeft: "10px" },
                  },
                  { default: () => "删除" } // 插槽内容
                ),
            }
          ),
        ];
      },
    },
  ]);

  columns.value = columns.value.map((item) => {
    return { ...item, ellipsis: true, checked: true };
  });

  return columns;
};