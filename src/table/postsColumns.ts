import {
  Avatar,
  Button,
  message,
  Popconfirm,
  TableProps,
  Tag,
} from "ant-design-vue";
import { Params } from "@/typings/Column";
import { setTimeAgoLocalMessages } from "@/utils/comment";

export const getArticleColumns = (params: Params) => {
  let columns: TableProps["columns"] = [
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
        return h(Avatar, { src: text, shape: "square" });
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
      dataIndex: "commentCount",
      key: "commentCount",
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
        return useTimeAgo(text, setTimeAgoLocalMessages).value;
      },
    },
    {
      title: "状态",
      dataIndex: "whetherUse",
      key: "whetherUse",
      width: "70px",
      filters: [
        {
          text: "启用",
          value: "1",
        },
        {
          text: "禁用",
          value: "0",
        },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) =>
        record.whetherUse.toString().startsWith(value),

      customRender: ({ text }) => {
        return h(
          Tag,
          () => (text == 1 ? "启用" : "禁用"), // 使用函数形式
        );
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
            { default: () => "编辑" }, // 插槽内容
          ),
          h(
            Popconfirm,
            {
              title: "确定删除此文章吗？",
              cancelText: "取消",
              okText: "确定",
              onConfirm: async () => {
                const result: any = await params.delData(record);
                if (result.data) {
                  message.success(result.data);
                  params.refreshData(true);
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
                  { default: () => "删除" }, // 插槽内容
                ),
            },
          ),
        ];
      },
    },
  ];

  columns = columns.map((item) => {
    return { ...item, ellipsis: true, checked: true };
  });

  return columns;
};
