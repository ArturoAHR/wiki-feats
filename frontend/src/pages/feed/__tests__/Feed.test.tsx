import { render } from "@testing-library/react";
import { Feed } from "../Feed";

vi.mock("../../../components/article-feed/ArticleFeed.tsx", () => ({
  ArticleFeed: () => <div data-testid="article-feed" />,
}));

describe("Feed Page", () => {
  test("should render correctly", () => {
    render(<Feed />);
  });
});
