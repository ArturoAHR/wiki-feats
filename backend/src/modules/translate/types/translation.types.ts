import { Article } from "../../../database/entities/article.entity";

export type TranslateArticleOptions = {
  articles: Article[];
  targetLanguageCode: string;
};
