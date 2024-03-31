import { createMock } from "@golevelup/ts-jest";
import { getRepositoryToken } from "@mikro-orm/nestjs";
import { EntityManager } from "@mikro-orm/postgresql";
import { Test, TestingModule } from "@nestjs/testing";
import { BaseRepository } from "../../common/database/base.repository";
import { expectCallsInMethods } from "../../common/helpers/expect.utils";
import { ArticleCollection } from "../../database/entities/article-collection.entity";
import { Article } from "../../database/entities/article.entity";
import { Language } from "../../database/entities/language.entity";
import { createArticleCollectionMock } from "../../mocks/article-collection.mocks";
import { createArticleMock } from "../../mocks/article.mocks";
import { createLanguageMock } from "../../mocks/language.mocks";
import { createPaginatedFindResultMock } from "../../mocks/pagination.mocks";
import { createWikipediaArticleMock } from "../../mocks/wikipedia-article";
import { TranslateService } from "../translate/translate.service";
import { WikipediaService } from "../wikipedia/wikipedia.service";
import { ArticleService } from "./article.service";
describe("ArticleService", () => {
  let service: ArticleService;
  let mockWikipediaService;
  let mockArticleRepository;
  let mockArticleCollectionRepository;
  let mockLanguageRepository;
  let mockTranslateService;
  let mockEntityManager;

  const defaultOptions = {
    date: "2021-09-01",
    languageCode: "en",
    page: 1,
    pageSize: 5,
  };

  const mockedArticles = Array.from({ length: 5 }, () => createArticleMock());
  const mockedPaginatedArticles = createPaginatedFindResultMock(mockedArticles);

  beforeEach(async () => {
    mockWikipediaService = createMock<WikipediaService>({
      fetchFeaturedContents: jest.fn(),
    });
    mockArticleRepository = createMock<BaseRepository<Article>>({
      create: jest.fn(),
      findPaginated: jest.fn(),
    });
    mockArticleCollectionRepository = createMock<
      BaseRepository<ArticleCollection>
    >({
      findOne: jest.fn(),
      create: jest.fn(),
    });
    mockLanguageRepository = createMock<BaseRepository<Language>>({
      findOneOrFail: jest.fn(),
    });
    mockTranslateService = createMock<TranslateService>({
      translateArticles: jest.fn(),
    });
    mockEntityManager = createMock<EntityManager>({
      flush: jest.fn(),
      fork: jest.fn(),
    });

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
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: WikipediaService,
          useValue: mockWikipediaService,
        },
        { provide: TranslateService, useValue: mockTranslateService },
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

    await service.importArticles(defaultOptions);

    expectCallsInMethods([
      mockWikipediaService.fetchFeaturedContents,
      mockArticleCollectionRepository.create,
      mockLanguageRepository.findOneOrFail,
      mockArticleRepository.create,
      mockEntityManager.flush,
    ]);
  });

  it("should get articles by date", async () => {
    const mockArticleCollection = createArticleCollectionMock();

    mockArticleCollectionRepository.findOne.mockResolvedValue(
      mockArticleCollection,
    );

    mockArticleRepository.findPaginated.mockResolvedValue(
      mockedPaginatedArticles,
    );

    const result = await service.getImportedArticlesByDate(defaultOptions);
    expect(result).toBe(mockedPaginatedArticles);

    expect(mockArticleRepository.findPaginated).toHaveBeenCalled();
  });

  it("should resolve to true if the article collection with the feature date provided exists", async () => {
    const mockArticleCollection = createArticleCollectionMock();
    mockArticleCollection.availableArticles = 100;

    mockArticleCollectionRepository.findOne.mockResolvedValue(
      mockArticleCollection,
    );

    const result = await service.checkIfArticlesAreImported(defaultOptions);

    expect(result).toBe(true);
    expect(mockArticleCollectionRepository.findOne).toHaveBeenCalled();
  });

  it("should resolve to false if the article collection with the feature date provided does not exist", async () => {
    mockArticleCollectionRepository.findOne.mockResolvedValue(undefined);

    const result = await service.checkIfArticlesAreImported(defaultOptions);

    expect(result).toBe(false);
    expect(mockArticleCollectionRepository.findOne).toHaveBeenCalled();
  });

  it("should resolve to true if the articles are translated", async () => {
    const mockArticleCollection = createArticleCollectionMock();
    mockArticleCollection.availableArticles = 100;

    mockArticleCollectionRepository.findOne.mockResolvedValue(
      mockArticleCollection,
    );

    mockArticleRepository.findPaginated.mockResolvedValue(
      mockedPaginatedArticles,
    );
    mockArticleRepository.find.mockResolvedValue(mockedArticles);

    const result = await service.checkIfArticlesAreTranslated({
      ...defaultOptions,
      languageCode: "es",
    });

    expect(result).toBe(true);
    expect(mockArticleCollectionRepository.findOne).toHaveBeenCalled();
  });

  it("should resolve to false if the articles are not translated", async () => {
    const mockArticleCollection = createArticleCollectionMock();
    mockArticleCollection.availableArticles = 100;

    mockArticleCollectionRepository.findOne.mockResolvedValue(
      mockArticleCollection,
    );

    mockArticleRepository.findPaginated.mockResolvedValue(
      mockedPaginatedArticles,
    );
    mockArticleRepository.find.mockResolvedValue([]);

    const result = await service.checkIfArticlesAreTranslated({
      ...defaultOptions,
      languageCode: "es",
    });

    expect(result).toBe(false);
    expect(mockArticleCollectionRepository.findOne).toHaveBeenCalled();
  });

  it("should resolve to true if the language code is english", async () => {
    const result = await service.checkIfArticlesAreTranslated({
      ...defaultOptions,
      languageCode: "en",
    });

    expect(result).toBe(true);
  });

  it("should resolve to false if article collection does not exist", async () => {
    mockArticleCollectionRepository.findOne.mockResolvedValue(undefined);

    const result = await service.checkIfArticlesAreTranslated({
      ...defaultOptions,
      languageCode: "es",
    });

    expect(result).toBe(false);
  });

  it("should translate articles", async () => {
    mockArticleCollectionRepository.findOne.mockResolvedValue(
      createArticleCollectionMock(),
    );
    mockArticleRepository.findPaginated.mockResolvedValue(
      mockedPaginatedArticles,
    );
    mockArticleRepository.find.mockResolvedValue(mockedArticles);
    mockTranslateService.translateArticles.mockResolvedValue(mockedArticles);

    await service.translateArticles(defaultOptions);

    expectCallsInMethods([
      mockArticleCollectionRepository.findOne,
      mockArticleRepository.findPaginated,
      mockArticleRepository.find,
      mockTranslateService.translateArticles,
    ]);
  });

  it("should get translated articles by date", async () => {
    mockArticleCollectionRepository.findOne.mockResolvedValue(
      createArticleCollectionMock(),
    );
    mockArticleRepository.findPaginated.mockResolvedValue(
      mockedPaginatedArticles,
    );

    const mockForkEntityManager = createMock<EntityManager>({
      getRepository: jest.fn(),
    });
    const mockForkedArticleRepository = createMock<BaseRepository<Article>>({
      find: jest.fn(),
    });

    mockEntityManager.fork.mockReturnValue(mockForkEntityManager);
    mockForkEntityManager.getRepository.mockReturnValue(
      mockForkedArticleRepository as any,
    );
    mockForkedArticleRepository.find.mockResolvedValue(mockedArticles);

    const result = await service.getTranslatedArticlesByDate(defaultOptions);
    expect(JSON.stringify(result)).toBe(
      JSON.stringify(mockedPaginatedArticles),
    );

    expect(mockArticleRepository.findPaginated).toHaveBeenCalled();
  });
});
