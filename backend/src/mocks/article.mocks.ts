import { faker } from "@faker-js/faker";
import { ArticleType } from "../common/@types/enum/article-type.enum";
import { Article } from "../database/entities/article.entity";

export const createArticleMock = (): Article => ({
  id: faker.string.uuid(),
  title: faker.lorem.words(),
  extract: faker.lorem.paragraph(),
  articleUrl: faker.internet.url(),
  articleType: faker.helpers.arrayElement(Object.values(ArticleType)),
  wikipediaPageId: faker.number.int({ min: 1, max: 1000 }),
  featuredDate: faker.date.recent(),
  thumbnail: {
    id: faker.string.uuid(),
    url: faker.internet.url(),
    width: faker.number.int({ min: 1, max: 1000 }),
    height: faker.number.int({ min: 1, max: 1000 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    deletedAt: null,
  },
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  deletedAt: null,
});
