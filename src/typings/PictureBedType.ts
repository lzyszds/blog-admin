// 用于插入数据时的类型，不需要传递 id 和 created_at
export interface PictureBedCreate {
  url: string;                  // 图片URL地址
  name: string;                 // 图片分类名称
  other_sizes?: string;        // 图片的其他尺寸列表，默认为 '0,640,641,1000'
  derive_from?: string;        // 图片来源，默认为 '未知'
  derive_from_id?: number;     // 图片来源的ID，关联到其他表
  created_at?: string;          // 记录创建时间，由数据库自动生成
}

// 用于获取数据或更新数据时的类型，包含 id 和 created_at
export interface PictureBedType extends PictureBedCreate {
  id: number;                  // 图片分类ID，主键，自动递增（由数据库自动处理）
}
