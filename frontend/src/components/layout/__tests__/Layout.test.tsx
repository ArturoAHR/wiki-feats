import { render } from "@testing-library/react";
import { Layout } from "../Layout";

describe("Layout", () => {
  test("should render correctly", () => {
    render(
      <Layout>
        <div></div>
      </Layout>,
    );
  });

  test("should render children", () => {
    const { getByText } = render(
      <Layout>
        <div>Test</div>
      </Layout>,
    );
    expect(getByText("Test")).toBeInTheDocument();
  });
});
