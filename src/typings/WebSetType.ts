export interface WebDataType {
  weboke_page_title: string;
  weatherKey: string;
  githubKey: string;
  management_system_title: string;
  load_animation_gif: string;
}

export interface WebSystemType {
  configId: number;
  configKey: string;
  configValue: string;
  configDesc: string;
  configType: string;
}

export interface AiKeyType {
  createdAt?: string;
  id?: number;
  keyName: string;
  keySource: string;
  keySourceType: string;
  keyValue: string;
}

export interface FormDataType extends AiKeyType {
  isOpen: boolean;
  confirmLoading: boolean;
}
