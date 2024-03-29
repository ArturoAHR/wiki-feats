import { faker } from "@faker-js/faker";
import { ArticleCollection } from "../database/entities/article-collection.entity";
import { createLanguageMock } from "./language.mocks";

export const createArticleCollectionMock = (): ArticleCollection => {
  return {
    id: faker.string.uuid(),
    availableArticles: faker.number.int({ min: 1, max: 1000 }),
    totalArticles: faker.number.int({ min: 1, max: 1000 }),
    featuredDate: faker.date.recent(),
    language: createLanguageMock(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    deletedAt: null,
    articles: [],
  };
};
