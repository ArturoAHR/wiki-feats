import { faker } from "@faker-js/faker";
import { ArticleType } from "../common/@types/enum/article-type.enum";
import { WikipediaArticle } from "../modules/wikipedia/types/wikipedia-article.types";
import { createWikipediaApiResponseArticleMock } from "./wikipedia-api.mocks";

export const createWikipediaArticleMock = (): WikipediaArticle => ({
  ...createWikipediaApiResponseArticleMock(),
  articleType: faker.helpers.arrayElement(Object.values(ArticleType)),
  text: faker.lorem.paragraph(),
});
