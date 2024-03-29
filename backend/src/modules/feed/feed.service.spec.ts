import { createMock } from "@golevelup/ts-jest";
import { Test, TestingModule } from "@nestjs/testing";
import { createArticleMock } from "../../mocks/article.mocks";
import { createPaginatedFindResultMock } from "../../mocks/pagination.mocks";
import { ArticleService } from "../article/article.service";
import { FeedService } from "./feed.service";

describe("FeedService", () => {
  let service: FeedService;
  const mockArticleService = createMock<ArticleService>({
    getArticleCollectionStatus: jest.fn(),
    getArticlesByDate: jest.fn(),
    importArticles: jest.fn(),
  });

  const articles = Array.from({ length: 12 }, () => createArticleMock());
  const paginatedArticles = createPaginatedFindResultMock(articles);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        { provide: ArticleService, useValue: mockArticleService },
      ],
    }).compile();

    service = module.get<FeedService>(FeedService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should get feed articles if they are already imported", async () => {
    mockArticleService.getArticleCollectionStatus.mockResolvedValue(true);
    mockArticleService.getArticlesByDate.mockResolvedValue(paginatedArticles);

    const result = await service.getFeedArticles("2021-09-01");

    expect(result).toEqual(paginatedArticles);

    expect(mockArticleService.getArticleCollectionStatus).toHaveBeenCalled();
    expect(mockArticleService.getArticlesByDate).toHaveBeenCalled();
  });

  it("should import articles if they are not imported", async () => {
    mockArticleService.getArticleCollectionStatus.mockResolvedValue(false);
    mockArticleService.getArticlesByDate.mockResolvedValue(paginatedArticles);

    const result = await service.getFeedArticles("2021-09-01");

    expect(result).toEqual(paginatedArticles);

    expect(mockArticleService.getArticleCollectionStatus).toHaveBeenCalled();
    expect(mockArticleService.importArticles).toHaveBeenCalled();
    expect(mockArticleService.getArticlesByDate).toHaveBeenCalled();
  });
});
