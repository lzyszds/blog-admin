import { User } from "./User"

export interface Article {
  aid: string
  author: string
  comments_count: string,
  content: string,
  coverContent: string,
  cover_img: string,
  create_date: string,
  main: string,
  modified_date: string,
  title: string,
}



export interface TagDataType {
  whether_use: string,
  name: string,
  tid: number
}


export interface Props {
  type: "modify" | "add",
  data?: ArticleMultipleDataType,
  tableheight: number,
}

export interface Storagetype {
  text: string,
  html: string,
}
export interface InformationTypes {
  storage: Storagetype,
  text: any,
  html: any,
  title: string,
  cover: string,
}

export interface ArticledataType {
  title: InformationTypes['title'],
  //文章开头第一段话
  partial_content: string,
  content: InformationTypes['storage']['text'],
  main: InformationTypes['storage']['html'],
  cover_img: string,
  modified: string,
  aid: string | null,
  tags: string[],
}

export interface ArticleMultipleDataType extends Article {
  tags: string[],
  head_img: User['headImg'],
  signature: User['signature'],
  uname: User['uname'],
}
