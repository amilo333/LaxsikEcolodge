export type TPagination = {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
};

export type TPaginationResponse<TData> = {
  message: string;
  success: boolean;
  pagination: TPagination;
  data: TData;
};
