export type Pagination = {
  page: number;
  pageSize: number;
};

export type PaginationMetadata = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  meta: PaginationMetadata;
};
