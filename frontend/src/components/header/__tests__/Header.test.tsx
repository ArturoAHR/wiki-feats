import { render } from "@testing-library/react";
import { Header } from "../Header";

describe("Header", () => {
  test("should render correctly", () => {
    render(<Header />);
  });
});
