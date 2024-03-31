import { faker } from "@faker-js/faker";
import { BaseEntity } from "../types/entity";

export const createBaseEntityMock = (): BaseEntity => ({
  id: faker.string.uuid(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
});
