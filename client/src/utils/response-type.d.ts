export type TResponseType<T> = {
  data: T;
  status?: number;
};
type TExpressError = {
  message: string;
};
export type NetworkAPIError = { message: string };
