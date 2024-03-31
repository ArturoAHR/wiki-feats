import { createMock } from "@golevelup/ts-jest";
import { Test, TestingModule } from "@nestjs/testing";
import { createArticleMock } from "../../mocks/article.mocks";
import { createLanguageMock } from "../../mocks/language.mocks";
import { createPaginatedFindResultMock } from "../../mocks/pagination.mocks";
import { FeedController } from "./feed.controller";
import { FeedService } from "./feed.service";

describe("FeedController", () => {
  let controller: FeedController;
  let mockFeedService;

  const articles = Array.from({ length: 12 }, () => createArticleMock());
  const paginatedArticles = createPaginatedFindResultMock(articles);

  const languages = Array.from({ length: 3 }, () => createLanguageMock());

  beforeEach(async () => {
    mockFeedService = createMock<FeedService>({
      getFeedArticles: jest.fn(),
      getSupportedFeedLanguages: jest.fn(),
    });

    mockFeedService.getFeedArticles.mockResolvedValue(paginatedArticles);
    mockFeedService.getSupportedFeedLanguages.mockResolvedValue(languages);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedController],
      providers: [{ provide: FeedService, useValue: mockFeedService }],
    }).compile();

    controller = module.get<FeedController>(FeedController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should get today's feed articles", async () => {
    const query = {};

    const result = await controller.getCurrentFeed(query);
    expect(result).toEqual(paginatedArticles);

    expect(mockFeedService.getFeedArticles).toHaveBeenCalledWith({ ...query });
  });

  it("should get today's feed articles with pagination options", async () => {
    const query = { page: 1, pageSize: 10 };

    const result = await controller.getCurrentFeed(query);
    expect(result).toEqual(paginatedArticles);

    expect(mockFeedService.getFeedArticles).toHaveBeenCalledWith({ ...query });
  });

  it("should get feed articles by date", async () => {
    const params = { date: "2021-09-01" };
    const query = {};

    const result = await controller.getFeedByDate(params, query);
    expect(result).toEqual(paginatedArticles);

    expect(mockFeedService.getFeedArticles).toHaveBeenCalledWith({
      ...params,
      ...query,
    });
  });

  it("should get feed articles by date with pagination options", async () => {
    const params = { date: "2021-09-01" };
    const query = { page: 1, pageSize: 10 };

    const result = await controller.getFeedByDate(params, query);
    expect(result).toEqual(paginatedArticles);

    expect(mockFeedService.getFeedArticles).toHaveBeenCalledWith({
      ...params,
      ...query,
    });
  });

  it("should get today's feed articles in the given language", async () => {
    const params = { languageCode: "es" };
    const query = {};

    const result = await controller.getTranslatedFeed(params, query);
    expect(result).toEqual(paginatedArticles);

    expect(mockFeedService.getFeedArticles).toHaveBeenCalledWith({
      ...params,
      ...query,
    });
  });

  it("should get today's feed articles with pagination options in the given language", async () => {
    const params = { languageCode: "es" };
    const query = { page: 1, pageSize: 10 };

    const result = await controller.getTranslatedFeed(params, query);
    expect(result).toEqual(paginatedArticles);

    expect(mockFeedService.getFeedArticles).toHaveBeenCalledWith({
      ...params,
      ...query,
    });
  });

  it("should get feed articles by date", async () => {
    const params = { languageCode: "es", date: "2021-09-01" };
    const query = {};

    const result = await controller.getTranslatedFeedByDate(params, query);
    expect(result).toEqual(paginatedArticles);

    expect(mockFeedService.getFeedArticles).toHaveBeenCalledWith({
      ...params,
      ...query,
    });
  });

  it("should get feed articles by date with pagination options", async () => {
    const params = { languageCode: "es", date: "2021-09-01" };
    const query = { page: 1, pageSize: 10 };

    const result = await controller.getTranslatedFeedByDate(params, query);
    expect(result).toEqual(paginatedArticles);

    expect(mockFeedService.getFeedArticles).toHaveBeenCalledWith({
      ...params,
      ...query,
    });
  });

  it("should get supported feed languages", async () => {
    const result = await controller.getSupportedFeedLanguages();
    expect(result).toEqual(languages);

    expect(mockFeedService.getSupportedFeedLanguages).toHaveBeenCalled();
  });
});
