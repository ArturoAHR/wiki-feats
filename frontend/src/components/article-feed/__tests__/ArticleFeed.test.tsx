import { fireEvent, render } from "@testing-library/react";
import { UseQueryResult } from "react-query";
import { useFeed } from "../../../api/useFeed";
import { createArticleMock } from "../../../mocks/article";
import { Article } from "../../../types/article";
import { PaginatedResponse } from "../../../types/pagination";
import { ArticleFeed } from "../ArticleFeed";

vi.mock("../../../api/useFeed");

vi.mock("../../article-card/ArticleCard", () => ({
  ArticleCard: () => {
    return <div data-testid="article-card" />;
  },
}));

describe("Article Feed", () => {
  const articleMocks = Array.from({ length: 5 }, () => createArticleMock());

  test("should render correctly", () => {
    vi.mocked(useFeed).mockReturnValue({
      useGetFeedQuery: () =>
        ({
          data: {
            items: [] as Article[],
            meta: {
              total: 5,
              page: 1,
              pageSize: 5,
              totalPages: 1,
            },
          },
          isLoading: false,
        }) as UseQueryResult<PaginatedResponse<Article>, unknown>,
    });

    render(<ArticleFeed date="2024-03-29" />);
  });

  test("should render article cards", () => {
    vi.mocked(useFeed).mockReturnValue({
      useGetFeedQuery: () =>
        ({
          data: {
            items: articleMocks,
            meta: {
              total: 5,
              page: 1,
              pageSize: 5,
              totalPages: 1,
            },
          },
          isLoading: false,
        }) as UseQueryResult<PaginatedResponse<Article>, unknown>,
    });

    const { getAllByTestId } = render(<ArticleFeed date="2024-03-29" />);
    expect(getAllByTestId("article-card").length).toBe(5);
  });

  test("should go to the next page on page next button click", async () => {
    const date = "2024-03-29";

    const mockUseGetFeedQuery = vi.fn().mockReturnValue({
      data: {
        items: articleMocks,
        meta: {
          total: 50,
          page: 1,
          pageSize: 5,
          totalPages: 10,
        },
      },
      isLoading: false,
    } as UseQueryResult<PaginatedResponse<Article>, unknown>);

    vi.mocked(useFeed).mockReturnValue({
      useGetFeedQuery: mockUseGetFeedQuery,
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

  test("should go to back to the previous page on previous page button click", async () => {
    const date = "2024-03-29";

    const mockUseGetFeedQuery = vi.fn().mockReturnValue({
      data: {
        items: articleMocks,
        meta: {
          total: 50,
          page: 1,
          pageSize: 5,
          totalPages: 10,
        },
      },
      isLoading: false,
    } as UseQueryResult<PaginatedResponse<Article>, unknown>);

    vi.mocked(useFeed).mockReturnValue({
      useGetFeedQuery: mockUseGetFeedQuery,
    });

    const { getByTestId } = render(<ArticleFeed date={date} />);

    const pagination = getByTestId("article-feed-pagination");
    const nextPageButton = pagination.querySelector(".ant-pagination-next");
    fireEvent.click(nextPageButton!);

    const prevPageButton = pagination.querySelector(".ant-pagination-prev");
    fireEvent.click(prevPageButton!);

    expect(mockUseGetFeedQuery.mock.calls[2][0]).toEqual({
      date,
      page: 1,
      languageCode: undefined,
      pageSize: 5,
    });
  });

  test("should change page size on page size change", async () => {
    const date = "2024-03-29";

    const mockUseGetFeedQuery = vi.fn().mockReturnValue({
      data: {
        items: articleMocks,
        meta: {
          total: 50,
          page: 1,
          pageSize: 5,
          totalPages: 10,
        },
      },
      isLoading: false,
    } as UseQueryResult<PaginatedResponse<Article>, unknown>);

    vi.mocked(useFeed).mockReturnValue({
      useGetFeedQuery: mockUseGetFeedQuery,
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
});
