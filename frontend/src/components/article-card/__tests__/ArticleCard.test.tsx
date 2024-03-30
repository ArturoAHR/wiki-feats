import { fireEvent, render } from "@testing-library/react";
import { createArticleMock } from "../../../mocks/article";
import { ArticleCard } from "../ArticleCard";

describe("Article Card", () => {
  const articleMock = createArticleMock();

  const originalWindowOpen = window.open;

  beforeEach(() => {
    window.open = vi.fn();
  });

  afterEach(() => {
    window.open = originalWindowOpen;
  });

  test("should render correctly", () => {
    render(<ArticleCard article={articleMock} />);
  });

  test("should render article card contents", () => {
    const articleMockCopy = {
      ...articleMock,
      title: "A",
      extractHtml: "B",
      context: "C",
    };

    const { getByText } = render(
      <ArticleCard article={articleMockCopy} alreadyRead />,
    );

    const articleTitle = getByText(articleMockCopy.title);
    const articleExtract = getByText(articleMockCopy.extractHtml);
    const articleContext = getByText(articleMockCopy.context!);

    expect(articleTitle).toBeInTheDocument();
    expect(articleExtract).toBeInTheDocument();
    expect(articleContext).toBeInTheDocument();
  });

  test("should open article url on click on a new tab", () => {
    const { getByTestId } = render(<ArticleCard article={articleMock} />);

    const articleCard = getByTestId("article-card");

    fireEvent.click(articleCard);

    expect(window.open).toHaveBeenCalledWith(articleMock.articleUrl, "_blank");
  });

  test("should render article card with read class", () => {
    const { getByTestId } = render(
      <ArticleCard article={articleMock} alreadyRead />,
    );

    const articleCard = getByTestId("article-card");

    expect(articleCard).toHaveClass("article-card-read");
  });

  test("should call onClick when article card is clicked", () => {
    const onClick = vi.fn();

    const { getByTestId } = render(
      <ArticleCard article={articleMock} onClick={onClick} />,
    );

    const articleCard = getByTestId("article-card");

    fireEvent.click(articleCard);

    expect(onClick).toHaveBeenCalledWith(articleMock);
  });
});
