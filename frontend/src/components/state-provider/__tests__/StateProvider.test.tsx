import { render } from "@testing-library/react";
import { StateProvider } from "../StateProvider";

describe("State Provider", () => {
  it("should render correctly", () => {
    render(
      <StateProvider isLoading={false} isError={false}>
        <div></div>
      </StateProvider>,
    );
  });

  it("should render children when not loading or in error state", () => {
    const { getByText } = render(
      <StateProvider isLoading={false} isError={false}>
        <div>Children</div>
      </StateProvider>,
    );

    const children = getByText("Children");

    expect(children).toBeInTheDocument();
  });

  it("should render loading state", () => {
    const { getByTestId } = render(
      <StateProvider isLoading={true} isError={false}>
        <div></div>
      </StateProvider>,
    );

    const loadingStateIcon = getByTestId("loading-state-icon");

    expect(loadingStateIcon).toBeInTheDocument();
  });

  it("should render error state", () => {
    const { getByTestId } = render(
      <StateProvider isLoading={false} isError={true}>
        <div></div>
      </StateProvider>,
    );

    const errorStateIcon = getByTestId("error-state-icon");

    expect(errorStateIcon).toBeInTheDocument();
  });
});
