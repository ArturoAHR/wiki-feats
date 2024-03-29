import { faker } from "@faker-js/faker";
import { Language } from "../database/entities/language.entity";

export const createLanguageMock = (): Language => {
  return {
    id: faker.string.uuid(),
    name: faker.string.alphanumeric({ length: { min: 5, max: 25 } }),
    code: faker.string.alpha({ length: 2 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    deletedAt: null,
    articleCollections: [],
  };
};
