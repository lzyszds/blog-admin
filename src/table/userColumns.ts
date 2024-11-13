import { Avatar, Button, message, Popconfirm, Tag } from "ant-design-vue";
import { Column, Params } from "@/typings/Column";
export const getUserColumns = (params: Params) => {
  let columns: Column[] = [
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

        return useTimeAgo(text, {
          messages: {
            justNow: '刚刚',
            past: n => (n.match(/\d/) ? `${n}前` : n),
            future: n => (n.match(/\d/) ? `在${n}` : n),
            month: (n, past) => (n === 1 ? (past ? '上个月' : '下个月') : `${n}月`),
            year: (n, past) => (n === 1 ? (past ? '去年' : '明年') : `${n}年`),
            day: (n, past) => (n === 1 ? (past ? '昨天' : '明天') : `${n}天`),
            week: (n, past) => (n === 1 ? (past ? '上周' : '下周') : `${n}周`),
            hour: n => `${n}小时`,
            minute: n => `${n}分钟`,
            second: n => `${n}秒`,
          },
          // 其他选项:
          showSecond: true,
        }).value;

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