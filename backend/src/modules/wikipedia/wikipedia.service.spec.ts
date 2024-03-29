import { createMock } from "@golevelup/ts-jest";
import { HttpService } from "@nestjs/axios";
import { Test, TestingModule } from "@nestjs/testing";
import { createAxiosResponseMock } from "../../mocks/axios.mocks";
import { createWikipediaApiResponseMock } from "../../mocks/wikipedia-api.mocks";
import { WikipediaService } from "./wikipedia.service";

jest.mock("rxjs", () => ({
  firstValueFrom: jest.fn().mockImplementation((value) => {
    return value;
  }),
}));

describe("WikipediaService", () => {
  let service: WikipediaService;
  const mockHttpService = createMock<HttpService>({
    get: jest.fn().mockResolvedValue({} as any),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WikipediaService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<WikipediaService>(WikipediaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should fetch featured contents", async () => {
    const mockWikipediaApiResponse = createWikipediaApiResponseMock();
    const mockAxiosResponse = createAxiosResponseMock(mockWikipediaApiResponse);

    mockHttpService.get.mockResolvedValue(mockAxiosResponse as never);

    await service.fetchFeaturedContents("2021-09-01");

    expect(mockHttpService.get).toHaveBeenCalled();
  });

  it("should throw error when failed to fetch data", async () => {
    const mockAxiosResponse = createAxiosResponseMock(
      createWikipediaApiResponseMock(),
    );

    mockAxiosResponse.status = 400;
    mockHttpService.get.mockResolvedValue(mockAxiosResponse as never);

    expect(service.fetchFeaturedContents("2021-09-01")).rejects.toThrow(
      "Failed to fetch data from Wikipedia API",
    );
  });

  it("should return articles", async () => {
    const mockWikipediaApiResponse = createWikipediaApiResponseMock();
    const mockAxiosResponse = createAxiosResponseMock(mockWikipediaApiResponse);
    const amountOfArticles =
      1 +
      mockWikipediaApiResponse.mostread.articles.length +
      mockWikipediaApiResponse.onthisday.length +
      mockWikipediaApiResponse.news.length;

    mockHttpService.get.mockResolvedValue(mockAxiosResponse as never);

    const articles = await service.fetchFeaturedContents("2021-09-01");

    expect(articles).toHaveLength(amountOfArticles);
  });
});
