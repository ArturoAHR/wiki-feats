import { faker } from "@faker-js/faker";
import { Article, ArticleType } from "../types/article";
import { createBaseEntityMock } from "./base";

export const createArticleMock = (): Article => {
  return {
    ...createBaseEntityMock(),
    title: faker.lorem.sentence(),
    articleType: faker.helpers.arrayElement(Object.values(ArticleType)),
    articleUrl: faker.internet.url(),
    context: faker.lorem.paragraph(),
    extract: faker.lorem.paragraph(),
    extractHtml: faker.lorem.paragraph(),
    wikipediaPageId: faker.number.int(),
    thumbnail: {
      ...createBaseEntityMock(),
      url: faker.image.url(),
      width: faker.number.int(),
      height: faker.number.int(),
    },
  };
};
