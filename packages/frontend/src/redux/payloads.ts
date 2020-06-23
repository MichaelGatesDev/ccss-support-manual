export interface SuccessPayload<T> {
  type: string;
  data: T;
}
export interface FailurePayload {
  type: string;
  error: string;
}
