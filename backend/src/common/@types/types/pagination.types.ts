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

export type PaginatedFindResult<T> = {
  items: T[];
  meta: PaginationMetadata;
};
