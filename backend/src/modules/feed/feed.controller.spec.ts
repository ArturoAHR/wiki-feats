import { createMock } from "@golevelup/ts-jest";
import { Test, TestingModule } from "@nestjs/testing";
import { startOfToday } from "date-fns";
import { getIsoDate } from "../../common/helpers/iso-date.utils";
import { createArticleMock } from "../../mocks/article.mocks";
import { createPaginatedFindResultMock } from "../../mocks/pagination.mocks";
import { FeedController } from "./feed.controller";
import { FeedService } from "./feed.service";

describe("FeedController", () => {
  let controller: FeedController;
  const mockFeedService = createMock<FeedService>({
    getFeedArticles: jest.fn(),
  });

  const articles = Array.from({ length: 12 }, () => createArticleMock());
  const paginatedArticles = createPaginatedFindResultMock(articles);

  const defaultOptions = { page: undefined, pageSize: undefined };

  beforeEach(async () => {
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
    const today = getIsoDate(startOfToday());
    mockFeedService.getFeedArticles.mockResolvedValue(paginatedArticles);

    const result = await controller.getCurrentFeed({});
    expect(result).toEqual(paginatedArticles);

    expect(mockFeedService.getFeedArticles).toHaveBeenCalledWith(
      today,
      defaultOptions,
    );
  });

  it("should get feed articles by date", async () => {
    const date = "2021-09-01";
    mockFeedService.getFeedArticles.mockResolvedValue(paginatedArticles);

    const result = await controller.getFeedByDate({ date }, {});
    expect(result).toEqual(paginatedArticles);

    expect(mockFeedService.getFeedArticles).toHaveBeenCalledWith(
      date,
      defaultOptions,
    );
  });

  it("should get feed articles by date with pagination options", async () => {
    const date = "2021-09-01";
    const options = { page: 1, pageSize: 10 };

    mockFeedService.getFeedArticles.mockResolvedValue(paginatedArticles);

    const result = await controller.getFeedByDate({ date }, options);
    expect(result).toEqual(paginatedArticles);

    expect(mockFeedService.getFeedArticles).toHaveBeenCalledWith(date, options);
  });
});
