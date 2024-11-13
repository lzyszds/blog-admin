import { Avatar, Button, message, Popconfirm, TableProps, Tag } from "ant-design-vue";
import { Params } from "@/typings/Column";
import { setTimeAgoLocalMessages } from "@/utils/comment";
export const getUserColumns = (params: Params) => {

  console.log(params);


  let columns: TableProps['columns'] = [
    {
      title: "UID",
      dataIndex: "uid",
      key: "uid",
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
      title: "昵称",
      dataIndex: "uname",
      key: "uname",
      width: "120px",
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      width: "120px",
    },
    {
      title: "权限",
      dataIndex: "power",
      key: "power",
      width: "100px",
      filters: [
        {
          text: '普通用户',
          value: '1',
        },
        {
          text: '管理员',
          value: '0',
        },
      ],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.power.toString().startsWith(value),

      customRender: ({ text }) => {
        return h(
          Tag,
          {
            color: text !== 0 ? "var(--themeColor)" : "#f56565",
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              width: "65px",
            },
            html: "inline-block",
          },
          () => text !== 0 ? "普通用户" : "管理员" // 使用函数形式
        );
      },
    },
    {
      title: "状态",
      dataIndex: "whetherUse",
      key: "whetherUse",
      width: "100px",
      filters: [
        {
          text: '启用',
          value: '1',
        },
        {
          text: '禁用',
          value: '0',
        },
      ],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.whetherUse.toString().startsWith(value),

      customRender: ({ text }) => {
        return h(
          Tag,
          () => text == 1 ? "启用" : "禁用" // 使用函数形式
        );
      },
    },
    {
      title: "创建日期",
      dataIndex: "createDate",
      key: "createDate",
      customRender: ({ text }) => {
        return useDateFormat(text, "YYYY-MM-DD").value;
      },
      width: "120px",
    },
    {
      title: "登录日期",
      dataIndex: "lastLoginDate",
      key: "lastLoginDate",
      width: "100px",
      customRender: ({ text }) => {
        if (!text) return "暂无";
        return useTimeAgo(text, setTimeAgoLocalMessages).value;
      },
    },
    {
      title: "上次登录 IP",
      dataIndex: "lastLoginIp",
      key: "lastLoginIp",
      width: "120px",
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
  ]

  columns = columns.map((item) => {
    return { ...item, ellipsis: true, checked: true };
  });

  return columns;
};