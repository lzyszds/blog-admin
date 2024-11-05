import { User } from "./User"

export interface Article {
  aid: string
  author: string
  commentsCount: string,
  content: string,
  coverContent: string,
  coverImg: string,
  createDate: string,
  main: string,
  modifiedDate: string,
  title: string,
}



export interface TagDataType {
  whetherUse: string,
  name: string,
  typeId: number
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
  partialContent: string,
  content: InformationTypes['storage']['text'],
  main: InformationTypes['storage']['html'],
  coverImg: string,
  modified: string,
  aid: string | null,
  tags: string[],
}

export interface ArticleMultipleDataType extends Article {
  tags: string[],
  headImg: User['headImg'],
  signature: User['signature'],
  uname: User['uname'],
}
