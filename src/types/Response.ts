export type Response<T> = {
  status: 'Success';
  message: string;
  data: T;
};

export type PaginatedResponse<T> = {
  page: number;
  perPage: number;
  total: number;
  totalElements: number;
  data: T;
};
