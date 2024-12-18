export interface RequestResult<T = any> {
  code: number,
  data: T,
  msg: string,
  traceId: string,
}