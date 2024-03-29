import { Pagination } from "../../../common/@types/types/pagination.types";

export type GetArticleOptions = Pagination & {
  date: string;
  languageCode: string;
};
