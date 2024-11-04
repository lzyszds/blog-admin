export interface Column {
  title: string;
  dataIndex: string;
  key: string;
  width?: string;
  ellipsis?: boolean;
  checked?: boolean;
  customRender?: (params: any) => any;
}

export interface Params {
  getData: any;
  delData: any;
  openModal: any;
  columns: any;
}
