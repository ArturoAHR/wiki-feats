import { faker } from "@faker-js/faker/locale/af_ZA";
import {
  AvailableTranslation,
  GetAvailableLanguagesResponse,
} from "../modules/translate/types/libre-translate-api-response.types";

export const createGetAvailableLanguagesResponseMock =
  (): GetAvailableLanguagesResponse => {
    return Array.from({ length: 10 }, () => createAvailableTranslationMock());
  };

export const createAvailableTranslationMock = (): AvailableTranslation => ({
  code: faker.string.alpha({ length: 2 }),
  name: faker.lorem.word(),
  targets: Array.from({ length: 5 }, () => faker.string.alpha()),
});

export const createGetTranslatedTextResponseMock = () => ({
  translatedText: Array.from({ length: 5 }, () => faker.lorem.sentence()),
});
