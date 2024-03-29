import { createMock } from "@golevelup/ts-jest";
import { getRepositoryToken } from "@mikro-orm/nestjs";
import { EntityManager } from "@mikro-orm/postgresql";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { BaseRepository } from "../../common/database/base.repository";
import { Language } from "../../database/entities/language.entity";
import { createArticleMock } from "../../mocks/article.mocks";
import { createAxiosResponseMock } from "../../mocks/axios.mocks";
import { createLanguageMock } from "../../mocks/language.mocks";
import {
  createGetAvailableLanguagesResponseMock,
  createGetTranslatedTextResponseMock,
} from "../../mocks/libre-translate-api.mocks";
import { TranslateService } from "./translate.service";
import { GetTranslatedTextRequest } from "./types/libre-translate-api-response.types";

jest.mock("rxjs", () => ({
  firstValueFrom: jest.fn().mockImplementation((value) => {
    return value;
  }),
}));

describe("TranslateService", () => {
  let service: TranslateService;
  let mockHttpService;
  let mockLanguageRepository;
  let mockEntityManager;
  let mockConfigService;

  const mockUrl = "https://libre-translate.com";
  const mockGetAvailableLanguagesResponse =
    createGetAvailableLanguagesResponseMock();
  const mockGetTranslatedTextResponse = createGetTranslatedTextResponseMock();
  beforeEach(async () => {
    mockHttpService = createMock<HttpService>({
      get: jest.fn(),
    });
    mockLanguageRepository = createMock<BaseRepository<Language>>({
      findOneOrFail: jest.fn(),
    });
    mockEntityManager = createMock<EntityManager>({
      fork: jest.fn(),
    });
    mockConfigService = createMock<ConfigService>({
      get: jest.fn().mockReturnValue(mockUrl),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslateService,
        { provide: HttpService, useValue: mockHttpService },
        {
          provide: getRepositoryToken(Language),
          useValue: mockLanguageRepository,
        },
        { provide: EntityManager, useValue: mockEntityManager },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<TranslateService>(TranslateService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should fetch available translation languages", async () => {
    const response = createAxiosResponseMock(mockGetAvailableLanguagesResponse);

    mockHttpService.get.mockResolvedValue(response);

    const result = await service.fetchAvailableTranslationLanguages();

    expect(result).toEqual(mockGetAvailableLanguagesResponse);
    expect(mockHttpService.get).toHaveBeenCalledWith(`${mockUrl}/languages`);
  });

  it("should throw error when failed to fetch available translation languages", async () => {
    const response = createAxiosResponseMock(mockGetAvailableLanguagesResponse);

    response.status = 400;
    mockHttpService.get.mockResolvedValue(response);

    expect(service.fetchAvailableTranslationLanguages()).rejects.toThrow(
      "Failed to fetch available languages from LibreTranslate API",
    );
  });

  it("should import translation languages", async () => {
    const response = createAxiosResponseMock([
      { code: "en", name: "English", targets: ["fr", "cd", "dc"] },
      { code: "fr", name: "French", targets: ["ab", "cd", "dc"] },
      mockGetAvailableLanguagesResponse,
    ]);

    mockHttpService.get.mockResolvedValue(response);
    mockEntityManager.fork.mockReturnValue(mockEntityManager);
    mockEntityManager.getRepository.mockReturnValue(mockLanguageRepository);

    await service.importTranslationLanguages();

    expect(mockEntityManager.fork).toHaveBeenCalled();
    expect(mockLanguageRepository.create).toHaveBeenCalled();
    expect(mockEntityManager.flush).toHaveBeenCalled();
  });

  it("should translate text", async () => {
    const request: GetTranslatedTextRequest = {
      q: ["Hello, world!"],
      source: "en",
      target: "fr",
      format: "text",
    };

    const response = createAxiosResponseMock(mockGetTranslatedTextResponse);

    mockHttpService.post.mockResolvedValue(response);

    const result = await service.translate(request);

    expect(result).toEqual(mockGetTranslatedTextResponse.translatedText);
    expect(mockHttpService.post).toHaveBeenCalledWith(`${mockUrl}/translate`, {
      ...request,
    });
  });

  it("should throw error when failed to fetch translated text", async () => {
    const request: GetTranslatedTextRequest = {
      q: ["Hello, world!"],
      source: "en",
      target: "fr",
      format: "text",
    };

    const response = createAxiosResponseMock(mockGetTranslatedTextResponse);

    response.status = 400;
    mockHttpService.post.mockResolvedValue(response);

    expect(service.translate(request)).rejects.toThrow(
      "Failed to fetch available languages from LibreTranslate API",
    );
  });

  it("should translate articles", async () => {
    const mockArticles = Array.from({ length: 5 }, () => createArticleMock());
    const mockedTranslatedArticles = mockArticles.map((article) => ({
      articleType: article.articleType,
      articleUrl: article.articleUrl,
      wikipediaPageId: article.wikipediaPageId,
      thumbnail: article.thumbnail,
      title: article.title,
      extract: article.extract,
      extractHtml: article.extractHtml,
      context: article.context,
    }));

    mockHttpService.post.mockImplementation((_, params) => {
      return createAxiosResponseMock({ translatedText: params.q });
    });

    const result = await service.translateArticles({
      articles: mockArticles,
      targetLanguageCode: "fr",
    });

    expect(result).toEqual(mockedTranslatedArticles);
    expect(mockHttpService.post).toHaveBeenCalled();
  });

  it("should get the supported languages", async () => {
    const languages = Array.from({ length: 5 }, () => createLanguageMock());
    mockLanguageRepository.findAll.mockResolvedValue(languages);

    const result = await service.getSupportedLanguages();

    expect(result).toEqual(languages);
  });
});
