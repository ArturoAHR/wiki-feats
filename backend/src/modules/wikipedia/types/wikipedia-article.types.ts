import { ArticleType } from "../../../common/@types/enum/article-type.enum";
import { WikipediaApiResponseArticle } from "./wikipedia-api-response.types";

export type WikipediaArticle = WikipediaApiResponseArticle & {
  text?: string;
  story?: string;
  articleType: ArticleType;
};
