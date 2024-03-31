import { faker } from "@faker-js/faker";
import { createBaseEntityMock } from "./base";

export const createLanguageMock = () => {
  return {
    ...createBaseEntityMock(),
    code: faker.string.alpha(2),
    name: faker.lorem.word(),
  };
};
