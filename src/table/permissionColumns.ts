import { Avatar, Button, message, Popconfirm, TableProps, Tag, } from 'ant-design-vue';


// 控制显示或隐藏
const filterHide = (arr: any[], value) => {
  if (value == 0 && arr[0] == 0) {
    return false;
  }
  return arr.includes(value);
};

export const getPermissionColumns = (permissionLevels) => {
  let columns: TableProps['columns'] = [
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      width: '80px',
      customRender: ({ text }) => {
        return h(Tag,
          { color: text == 'get' ? '#55acee' : '#ff4d4f', style: { cursor: 'pointer', border: 'none', } },
          () => text
        );
      },
    },
    {
      title: '接口路径',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '访问权限',
      dataIndex: 'permissions',
      key: 'permissions',
      width: '160px',
      customRender: ({ text }) => {


        const tags = permissionLevels.filter((level) => {

          if (filterHide(level.permissions, text)) {
            return level.permissions.includes(text)
          }
        })
        if (tags.length == 0) {
          return h(Tag,
            { color: '#5161ce', style: { cursor: 'pointer', border: 'none', } },
            () => '所有人'
          );
        }


        return tags.map(level => {

          return h(Tag,
            {
              color: level.color,
              style: { cursor: 'pointer', border: 'none', marginRight: '5px' }
            },
            () => level.label
          )
        })
      }
    },
  ];

  return columns;
};
