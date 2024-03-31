import { render } from "@testing-library/react";
import { ErrorBoundary } from "../ErrorBoundary";

describe("Error Boundary", () => {
  test("should render correctly", () => {
    render(
      <ErrorBoundary>
        <div></div>
      </ErrorBoundary>,
    );
  });

  test("should render children", () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>Children</div>
      </ErrorBoundary>,
    );

    expect(getByText("Children")).toBeInTheDocument();
  });

  test("should render error", () => {
    const ThrowingComponent = () => {
      throw new Error("Error");
    };

    const consoleSpy = vi.spyOn(console, "error");
    consoleSpy.mockImplementation(() => {});

    const { getByText } = render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(getByText("Oops! Something went wrong.")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
