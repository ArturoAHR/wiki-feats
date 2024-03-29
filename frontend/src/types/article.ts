import { BaseEntity } from "./entity";
import { PaginatedResponse, Pagination } from "./pagination";

export type GetFeedArticlesParams = Partial<Pagination> & {
  date: string;
  languageCode?: string;
};

export type GetFeedArticlesResponse = PaginatedResponse<Article>;

export type Article = BaseEntity & {
  title: string;
  extract: string;
  extractHtml: string;
  context?: string;
  articleUrl: string;
  articleType: string;
  wikipediaPageId: number;
  thumbnail: Thumbnail;
};

export type Thumbnail = BaseEntity & {
  url: string;
  width: number;
  height: number;
};
