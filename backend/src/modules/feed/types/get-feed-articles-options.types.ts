import { Pagination } from "../../../common/@types/types/pagination.types";

export type GetFeedArticleOptions = Partial<Pagination> & {
  date?: string;
  languageCode?: string;
};
