import { fireEvent, render } from "@testing-library/react";
import { ImageWithFallback } from "../ImageWithFallback";

describe("Image With Fallback", () => {
  test("should render correctly", () => {
    render(
      <ImageWithFallback
        src="https://example.com/image.jpg"
        fallback="https://example.com/fallback.jpg"
        alt="Test Image"
      />,
    );
  });

  test("should render src when it's valid", () => {
    const { getByAltText } = render(
      <ImageWithFallback
        src={"https://example.com/image.jpg"}
        alt="Test Image"
        fallback=""
      />,
    );

    expect(getByAltText("Test Image").getAttribute("src")).toBe(
      "https://example.com/image.jpg",
    );
  });

  test("should render fallback image when src is not available", () => {
    const { getByAltText } = render(
      <ImageWithFallback
        src=""
        fallback="https://example.com/fallback.jpg"
        alt="Test Image"
      />,
    );

    expect(getByAltText("Test Image").getAttribute("src")).toBe(
      "https://example.com/fallback.jpg",
    );
  });

  test("should render fallback when src fails to lead", () => {
    const { getByAltText } = render(
      <ImageWithFallback
        src="https://example.com/image.jpg"
        fallback="https://example.com/fallback.jpg"
        alt="Test Image"
      />,
    );

    const image = getByAltText("Test Image");
    fireEvent.error(image);

    expect(image.getAttribute("src")).toBe("https://example.com/fallback.jpg");
  });
});
