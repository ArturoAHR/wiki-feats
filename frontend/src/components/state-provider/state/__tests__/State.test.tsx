import { render } from "@testing-library/react";
import { State } from "../State";

describe("State", () => {
  const defaultProps = {
    icon: <></>,
    message: "",
  };

  it("should render correctly", () => {
    render(<State {...defaultProps} />);
  });

  it("should render the icon and message", () => {
    const { getByText } = render(
      <State icon={<span>Icon</span>} message="message" />,
    );

    const icon = getByText("Icon");
    const message = getByText("message");

    expect(icon).toBeInTheDocument();
    expect(message).toBeInTheDocument();
  });
});
