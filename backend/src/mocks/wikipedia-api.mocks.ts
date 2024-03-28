import { faker } from "@faker-js/faker";
import {
  WikipediaApiResponse,
  WikipediaApiResponseArticle,
  WikipediaApiResponseFeaturedImage,
} from "../modules/wikipedia/types/wikipedia-api-response.types";

export const createWikipediaApiResponseArticleMock =
  (): WikipediaApiResponseArticle => {
    return {
      type: "standard",
      titles: {
        canonical: faker.string.alphanumeric({ length: { min: 10, max: 100 } }),
        normalized: faker.string.alphanumeric({
          length: { min: 10, max: 100 },
        }),
        display: faker.string.alphanumeric({ length: { min: 10, max: 100 } }),
      },
      namespace: {
        id: 0,
        text: "",
      },
      wikibase_item: faker.string.alphanumeric({
        length: { min: 10, max: 20 },
      }),
      pageid: faker.number.int({ min: 1, max: 1000 }),
      thumbnail: {
        source: faker.internet.url(),
        width: faker.number.int({ min: 100, max: 1000 }),
        height: faker.number.int({ min: 100, max: 1000 }),
      },
      originalimage: {
        source: faker.internet.url(),
        width: faker.number.int({ min: 100, max: 1000 }),
        height: faker.number.int({ min: 100, max: 1000 }),
      },
      lang: "en",
      dir: faker.helpers.arrayElement(["ltr", "rtl"]),
      revision: faker.lorem.word(),
      tid: faker.string.uuid(),
      timestamp: faker.date.recent().toISOString(),
      description: faker.lorem.sentence(),
      description_source: "local",
      extract: faker.lorem.paragraph(),
      extract_html: faker.lorem.paragraph(),
      content_urls: {
        desktop: {
          page: faker.internet.url(),
        },
        mobile: {
          page: faker.internet.url(),
        },
      },
    };
  };

export const createWikipediaApiResponseMock = (): WikipediaApiResponse => {
  return {
    tfa: createWikipediaApiResponseArticleMock(),
    mostread: {
      date: faker.date.recent().toISOString(),
      articles: [createWikipediaApiResponseArticleMock()],
    },
    image: {} as WikipediaApiResponseFeaturedImage,
    news: [
      {
        story: faker.lorem.sentence(),
        links: [createWikipediaApiResponseArticleMock()],
      },
    ],
    onthisday: [
      {
        text: faker.lorem.sentence(),
        pages: [createWikipediaApiResponseArticleMock()],
        year: faker.date.past().getFullYear(),
      },
    ],
  };
};
