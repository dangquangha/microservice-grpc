export interface IResponse<T> {
  data: T;
}
export interface IRPCResponse<T> {
  success: boolean,
  data?: T,
  message?: string
}