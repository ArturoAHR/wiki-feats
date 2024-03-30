import { fireEvent, render } from "@testing-library/react";
import { UseQueryResult } from "react-query";
import { Mock } from "vitest";
import { useFeed } from "../../../api/useFeed";
import { createArticleMock } from "../../../mocks/article";
import { Article } from "../../../types/article";
import { PaginatedResponse } from "../../../types/pagination";
import { ArticleFeed } from "../ArticleFeed";

vi.mock("../../../api/useFeed");

vi.mock("../../article-card/ArticleCard", () => ({
  ArticleCard: ({
    article,
    onClick,
  }: {
    article: Article;
    onClick: (article: Article) => void;
  }) => {
    return <div data-testid="article-card" onClick={() => onClick(article)} />;
  },
}));

describe("Article Feed", async () => {
  const articleMocks = Array.from({ length: 5 }, () => createArticleMock());

  const originalWindowLocalStorage = window.localStorage;

  beforeEach(() => {
    window.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    } as unknown as Storage;
  });

  afterEach(() => {
    window.localStorage = originalWindowLocalStorage;
  });

  const mockUseGetFeedQueryResponse = (
    response: PaginatedResponse<Article>,
    states?: { isLoading: boolean; isError: boolean },
  ) => {
    const mockUseGetFeedQuery = vi.fn().mockReturnValue({
      data: response,
      isLoading: false,
      ...states,
    } as UseQueryResult<PaginatedResponse<Article>, unknown>);

    vi.mocked(useFeed).mockReturnValue({
      ...((() => {}) as typeof useFeed)(),
      useGetFeedQuery: mockUseGetFeedQuery,
    });

    return mockUseGetFeedQuery;
  };

  test("should render correctly", () => {
    mockUseGetFeedQueryResponse({
      items: [] as Article[],
      meta: {
        total: 5,
        page: 1,
        pageSize: 5,
        totalPages: 1,
      },
    });

    render(<ArticleFeed date="2024-03-29" />);
  });

  test("should render article cards", () => {
    mockUseGetFeedQueryResponse({
      items: articleMocks,
      meta: {
        total: 5,
        page: 1,
        pageSize: 5,
        totalPages: 1,
      },
    });
    const { getAllByTestId } = render(<ArticleFeed date="2024-03-29" />);
    expect(getAllByTestId("article-card").length).toBe(5);
  });

  test("should go to the next page on page next button click", () => {
    const date = "2024-03-29";

    const mockUseGetFeedQuery = mockUseGetFeedQueryResponse({
      items: articleMocks,
      meta: {
        total: 50,
        page: 1,
        pageSize: 5,
        totalPages: 10,
      },
    });

    const { getByTestId } = render(<ArticleFeed date={date} />);

    const pagination = getByTestId("article-feed-pagination");
    const nextPageButton = pagination.querySelector(".ant-pagination-next");
    fireEvent.click(nextPageButton!);

    expect(mockUseGetFeedQuery).toBeCalledWith({
      date,
      page: 2,
      languageCode: undefined,
      pageSize: 5,
    });
  });

  test("should go to back to the previous page on previous page button click", () => {
    const date = "2024-03-29";

    const mockUseGetFeedQuery = mockUseGetFeedQueryResponse({
      items: articleMocks,
      meta: {
        total: 50,
        page: 1,
        pageSize: 5,
        totalPages: 10,
      },
    });

    const { getByTestId } = render(<ArticleFeed date={date} />);

    const pagination = getByTestId("article-feed-pagination");
    const nextPageButton = pagination.querySelector(".ant-pagination-next");
    fireEvent.click(nextPageButton!);

    const prevPageButton = pagination.querySelector(".ant-pagination-prev");
    fireEvent.click(prevPageButton!);

    expect(
      mockUseGetFeedQuery.mock.calls[
        mockUseGetFeedQuery.mock.calls.length - 1
      ][0],
    ).toEqual({
      date,
      page: 1,
      languageCode: undefined,
      pageSize: 5,
    });
  });

  test("should change page size on page size change", () => {
    const date = "2024-03-29";

    const mockUseGetFeedQuery = mockUseGetFeedQueryResponse({
      items: articleMocks,
      meta: {
        total: 50,
        page: 1,
        pageSize: 5,
        totalPages: 10,
      },
    });

    const { getByText } = render(<ArticleFeed date={date} />);

    const pageSizeSelector = getByText("5 / page");
    fireEvent.mouseDown(pageSizeSelector!);

    const pageSizeOption = getByText("15 / page");
    fireEvent.click(pageSizeOption!);

    expect(mockUseGetFeedQuery).toBeCalledWith({
      date,
      page: 1,
      languageCode: undefined,
      pageSize: 15,
    });
  });

  test("should call window localStorage on article click", () => {
    const date = "2024-03-29";

    mockUseGetFeedQueryResponse({
      items: articleMocks,
      meta: {
        total: 50,
        page: 1,
        pageSize: 5,
        totalPages: 10,
      },
    });

    const { getAllByTestId } = render(<ArticleFeed date={date} />);

    const articleCard = getAllByTestId("article-card")[0];
    fireEvent.click(articleCard);

    expect(window.localStorage.setItem).toBeCalledWith(
      "readArticles",
      JSON.stringify([articleMocks[0].wikipediaPageId]),
    );
  });

  test("should get already read articles from localStorage", () => {
    const date = "2024-03-29";

    mockUseGetFeedQueryResponse({
      items: articleMocks,
      meta: {
        total: 50,
        page: 1,
        pageSize: 5,
        totalPages: 10,
      },
    });

    (window.localStorage.getItem as Mock).mockReturnValue(
      JSON.stringify([articleMocks[0].wikipediaPageId]),
    );

    render(<ArticleFeed date={date} />);

    expect(window.localStorage.getItem).toBeCalledWith("readArticles");
  });

  test("should render loading state when fetch query is loading", () => {
    const date = "2024-03-29";

    mockUseGetFeedQueryResponse(
      {
        items: [],
        meta: {
          total: 0,
          page: 1,
          pageSize: 5,
          totalPages: 0,
        },
      },
      { isLoading: true, isError: false },
    );

    const { getByTestId } = render(<ArticleFeed date={date} />);

    const loadingStateIcon = getByTestId("loading-state-icon");

    expect(loadingStateIcon).toBeInTheDocument();
  });

  test("should render error state on fetch query error", () => {
    const date = "2024-03-29";

    mockUseGetFeedQueryResponse(
      {
        items: [],
        meta: {
          total: 0,
          page: 1,
          pageSize: 5,
          totalPages: 0,
        },
      },
      { isLoading: false, isError: true },
    );

    const { getByTestId } = render(<ArticleFeed date={date} />);

    const loadingStateIcon = getByTestId("error-state-icon");

    expect(loadingStateIcon).toBeInTheDocument();
  });

  test("should pass in language code to fetch query hook", () => {
    const date = "2024-03-29";
    const languageCode = "fr";

    const mockUseGetFeedQuery = mockUseGetFeedQueryResponse({
      items: articleMocks,
      meta: {
        total: 50,
        page: 1,
        pageSize: 5,
        totalPages: 10,
      },
    });

    render(<ArticleFeed date={date} languageCode={languageCode} />);

    expect(mockUseGetFeedQuery).toBeCalledWith({
      date,
      page: 1,
      languageCode,
      pageSize: 5,
    });
  });
});
