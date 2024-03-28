import { createMock } from "@golevelup/ts-jest";
import { getRepositoryToken } from "@mikro-orm/nestjs";
import { Test, TestingModule } from "@nestjs/testing";
import { BaseRepository } from "../../common/database/base.repository";
import { Article } from "../../database/entities/article.entity";
import { createWikipediaArticleMock } from "../../mocks/wikipedia-article";
import { WikipediaService } from "../wikipedia/wikipedia.service";
import { ArticleService } from "./article.service";
describe("ArticleService", () => {
  let service: ArticleService;
  const mockWikipediaService = createMock<WikipediaService>({
    fetchFeaturedContents: jest.fn(),
  });
  const mockArticleRepository = createMock<BaseRepository<Article>>({
    create: jest.fn(),
    getEntityManager: jest.fn().mockReturnValue({ flush: jest.fn() }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockArticleRepository,
        },
        {
          provide: WikipediaService,
          useValue: mockWikipediaService,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should fetch articles and import them", async () => {
    const mockedArticles = Array.from({ length: 5 }, () =>
      createWikipediaArticleMock(),
    );

    mockWikipediaService.fetchFeaturedContents.mockResolvedValue(
      mockedArticles,
    );

    await service.importArticles("2021-09-01");

    expect(mockWikipediaService.fetchFeaturedContents).toHaveBeenCalled();
    expect(mockArticleRepository.create).toHaveBeenCalled();
    expect(mockArticleRepository.getEntityManager().flush).toHaveBeenCalled();
  });

  it("should get articles by date", async () => {
    await service.getArticlesByDate("2021-09-01");

    expect(mockArticleRepository.findPaginated).toHaveBeenCalled();
  });

  it("should resolve to true if articles from date provided exist", async () => {
    mockArticleRepository.count.mockResolvedValue(1);

    expect(service.areDateArticlesImported("2021-09-01")).resolves.toBe(true);

    expect(mockArticleRepository.count).toHaveBeenCalled();
  });

  it("should resolve to false if articles from date provided do not exist", async () => {
    mockArticleRepository.count.mockResolvedValue(0);

    expect(service.areDateArticlesImported("2021-09-01")).resolves.toBe(false);

    expect(mockArticleRepository.count).toHaveBeenCalled();
  });
});
