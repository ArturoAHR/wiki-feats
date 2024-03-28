import {
  PaginatedFindResult,
  Pagination,
} from "../common/@types/types/pagination.types";

export const createPaginatedFindResultMock = <T>(
  data: T[],
  pagination?: Partial<Pagination>,
): PaginatedFindResult<T> => {
  const page = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? 5;

  const pageData = data.slice((page - 1) * pageSize, page * pageSize);

  return {
    items: pageData,
    meta: {
      page,
      pageSize,
      total: data.length,
      totalPages: Math.ceil(data.length / pageSize),
    },
  };
};
