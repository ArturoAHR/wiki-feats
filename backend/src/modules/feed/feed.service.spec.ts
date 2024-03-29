import { createMock } from "@golevelup/ts-jest";
import { Test, TestingModule } from "@nestjs/testing";
import {
  expectCallsInMethods,
  expectNoCallsInMethods,
} from "../../common/helpers/expect.utils";
import { createArticleMock } from "../../mocks/article.mocks";
import { createLanguageMock } from "../../mocks/language.mocks";
import { createPaginatedFindResultMock } from "../../mocks/pagination.mocks";
import { ArticleService } from "../article/article.service";
import { TranslateService } from "../translate/translate.service";
import { FeedService } from "./feed.service";

describe("FeedService", () => {
  let service: FeedService;
  let mockArticleService;
  let mockTranslateService;

  const articles = Array.from({ length: 12 }, () => createArticleMock());
  const paginatedArticles = createPaginatedFindResultMock(articles);

  const setResolvedValues = ({
    isTranslated,
    isImported,
    isLanguageSupported,
    translatedArticlesSearchResult,
    importedArticlesSearchResult,
  }: Partial<{
    [key: string]: any;
  }>) => {
    mockTranslateService.checkIfTranslationLanguageIsSupported.mockResolvedValue(
      isLanguageSupported,
    );
    mockArticleService.checkIfArticlesAreImported.mockResolvedValue(isImported);
    mockArticleService.checkIfArticlesAreTranslated.mockResolvedValue(
      isTranslated,
    );
    mockArticleService.getImportedArticlesByDate.mockResolvedValue(
      importedArticlesSearchResult,
    );
    mockArticleService.getTranslatedArticlesByDate.mockResolvedValue(
      translatedArticlesSearchResult,
    );
  };

  beforeEach(async () => {
    mockArticleService = createMock<ArticleService>({
      checkIfArticlesAreImported: jest.fn(),
      translateArticles: jest.fn(),
      getImportedArticlesByDate: jest.fn(),
      getTranslatedArticlesByDate: jest.fn(),
      importArticles: jest.fn(),
    });

    mockTranslateService = createMock({
      checkIfTranslationLanguageIsSupported: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        { provide: ArticleService, useValue: mockArticleService },
        { provide: TranslateService, useValue: mockTranslateService },
      ],
    }).compile();

    service = module.get<FeedService>(FeedService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should get feed articles if they are already imported", async () => {
    setResolvedValues({
      isTranslated: true,
      isImported: true,
      isLanguageSupported: true,
      importedArticlesSearchResult: paginatedArticles,
    });

    const result = await service.getFeedArticles({});

    expect(result).toEqual(paginatedArticles);

    expectCallsInMethods([
      mockTranslateService.checkIfTranslationLanguageIsSupported,
      mockArticleService.checkIfArticlesAreImported,
      mockArticleService.checkIfArticlesAreTranslated,
      mockArticleService.getImportedArticlesByDate,
    ]);

    expectNoCallsInMethods([
      mockArticleService.importArticles,
      mockArticleService.translateArticles,
      mockArticleService.getTranslatedArticlesByDate,
    ]);
  });

  it("should import articles if they are not imported", async () => {
    setResolvedValues({
      isTranslated: true,
      isImported: false,
      isLanguageSupported: true,
      importedArticlesSearchResult: paginatedArticles,
    });

    const result = await service.getFeedArticles({});

    expect(result).toEqual(paginatedArticles);

    expectCallsInMethods([
      mockTranslateService.checkIfTranslationLanguageIsSupported,
      mockArticleService.checkIfArticlesAreImported,
      mockArticleService.checkIfArticlesAreTranslated,
      mockArticleService.importArticles,
      mockArticleService.getImportedArticlesByDate,
    ]);

    expectNoCallsInMethods([
      mockArticleService.translateArticles,
      mockArticleService.getTranslatedArticlesByDate,
    ]);
  });

  it("should translate articles if they are not translated", async () => {
    setResolvedValues({
      isTranslated: false,
      isImported: true,
      isLanguageSupported: true,
      translatedArticlesSearchResult: paginatedArticles,
    });

    const result = await service.getFeedArticles({ languageCode: "es" });

    expect(result).toEqual(paginatedArticles);

    expectCallsInMethods([
      mockTranslateService.checkIfTranslationLanguageIsSupported,
      mockArticleService.checkIfArticlesAreImported,
      mockArticleService.checkIfArticlesAreTranslated,
      mockArticleService.translateArticles,
      mockArticleService.getTranslatedArticlesByDate,
    ]);

    expectNoCallsInMethods([
      mockArticleService.importArticles,
      mockArticleService.getImportedArticlesByDate,
    ]);
  });

  it("should import and translate articles if they are neither translated nor imported ", async () => {
    setResolvedValues({
      isTranslated: false,
      isImported: false,
      isLanguageSupported: true,
      translatedArticlesSearchResult: paginatedArticles,
    });

    const result = await service.getFeedArticles({ languageCode: "es" });

    expect(result).toEqual(paginatedArticles);

    expectCallsInMethods([
      mockTranslateService.checkIfTranslationLanguageIsSupported,
      mockArticleService.checkIfArticlesAreImported,
      mockArticleService.checkIfArticlesAreTranslated,
      mockArticleService.importArticles,
      mockArticleService.translateArticles,
      mockArticleService.getTranslatedArticlesByDate,
    ]);

    expectNoCallsInMethods([mockArticleService.getImportedArticlesByDate]);
  });

  it("should throw an error if the language is not supported", async () => {
    setResolvedValues({
      isTranslated: false,
      isImported: false,
      isLanguageSupported: false,
    });

    await expect(
      service.getFeedArticles({ languageCode: "es" }),
    ).rejects.toThrow("The requested language is not supported");

    expectCallsInMethods([
      mockTranslateService.checkIfTranslationLanguageIsSupported,
    ]);
  });

  it("should get supported feed languages", async () => {
    const languages = Array.from({ length: 5 }, () => createLanguageMock());
    mockTranslateService.getSupportedLanguages.mockResolvedValue(languages);

    const result = await service.getSupportedFeedLanguages();

    expect(result).toEqual(languages);

    expectCallsInMethods([mockTranslateService.getSupportedLanguages]);
  });
});
