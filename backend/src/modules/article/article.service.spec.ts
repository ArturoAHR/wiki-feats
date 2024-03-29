import { createMock } from "@golevelup/ts-jest";
import { getRepositoryToken } from "@mikro-orm/nestjs";
import { Test, TestingModule } from "@nestjs/testing";
import { BaseRepository } from "../../common/database/base.repository";
import { ArticleCollection } from "../../database/entities/article-collection.entity";
import { Article } from "../../database/entities/article.entity";
import { Language } from "../../database/entities/language.entity";
import { createArticleCollectionMock } from "../../mocks/article-collection.mocks";
import { createLanguageMock } from "../../mocks/language.mocks";
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
  const mockArticleCollectionRepository = createMock<
    BaseRepository<ArticleCollection>
  >({
    findOne: jest.fn(),
    create: jest.fn(),
  });
  const mockLanguageRepository = createMock<BaseRepository<Language>>({
    findOneOrFail: jest.fn(),
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
          provide: getRepositoryToken(ArticleCollection),
          useValue: mockArticleCollectionRepository,
        },
        {
          provide: getRepositoryToken(Language),
          useValue: mockLanguageRepository,
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
    mockArticleCollectionRepository.create.mockReturnValue(
      createArticleCollectionMock(),
    );
    mockArticleCollectionRepository.findOne.mockResolvedValue(undefined);
    mockLanguageRepository.findOneOrFail.mockResolvedValue(
      createLanguageMock(),
    );

    await service.importArticles("2021-09-01");

    expect(mockWikipediaService.fetchFeaturedContents).toHaveBeenCalled();
    expect(mockArticleCollectionRepository.create).toHaveBeenCalled();
    expect(mockLanguageRepository.findOneOrFail).toHaveBeenCalled();
    expect(mockArticleRepository.create).toHaveBeenCalled();
    expect(mockArticleRepository.getEntityManager().flush).toHaveBeenCalled();
  });

  it("should get articles by date", async () => {
    const mockArticleCollection = createArticleCollectionMock();

    mockArticleCollectionRepository.findOne.mockResolvedValue(
      mockArticleCollection,
    );

    await service.getArticlesByDate("2021-09-01");

    expect(mockArticleRepository.findPaginated).toHaveBeenCalled();
  });

  it("should resolve to true if the article collection with the feature date provided exists", async () => {
    const mockArticleCollection = createArticleCollectionMock();
    mockArticleCollection.availableArticles = 100;

    mockArticleCollectionRepository.findOne.mockResolvedValue(
      mockArticleCollection,
    );

    const result = await service.getArticleCollectionStatus("2021-09-01");

    expect(result).toBe(true);
    expect(mockArticleCollectionRepository.findOne).toHaveBeenCalled();
  });

  it("should resolve to false if the article collection with the feature date provided does not have available articles", async () => {
    const mockArticleCollection = createArticleCollectionMock();
    mockArticleCollection.availableArticles = 0;

    mockArticleCollectionRepository.findOne.mockResolvedValue(
      mockArticleCollection,
    );

    const result = await service.getArticleCollectionStatus("2021-09-01");

    expect(result).toBe(false);
    expect(mockArticleCollectionRepository.findOne).toHaveBeenCalled();
  });

  it("should resolve to false if the article collection with the feature date provided does not exist", async () => {
    mockArticleCollectionRepository.findOne.mockResolvedValue(undefined);

    const result = await service.getArticleCollectionStatus("2021-09-01");

    expect(result).toBe(false);
    expect(mockArticleCollectionRepository.findOne).toHaveBeenCalled();
  });
});
