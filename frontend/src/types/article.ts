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
  articleType: ArticleType;
  wikipediaPageId: number;
  thumbnail: Thumbnail;
};

export type Thumbnail = BaseEntity & {
  url: string;
  width: number;
  height: number;
};

export enum ArticleType {
  Featured = "featured",
  MostRead = "most-read",
  News = "news",
  OnThisDay = "on-this-day",
}

export type ArticleFeedParams = {
  date: string;
  languageCode: string;
};

export const articleTypeToTitle: { [key in ArticleType]: string } = {
  [ArticleType.Featured]: "Featured",
  [ArticleType.MostRead]: "Most Read",
  [ArticleType.News]: "News",
  [ArticleType.OnThisDay]: "On This Day...",
};
