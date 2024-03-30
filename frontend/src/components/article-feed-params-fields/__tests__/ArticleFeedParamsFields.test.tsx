import { fireEvent, render } from "@testing-library/react";
import { UseQueryResult } from "react-query";
import { useFeed } from "../../../api/useFeed";
import { createLanguageMock } from "../../../mocks/language";
import {
  GetAvailableFeedLanguagesResponse,
  Language,
} from "../../../types/language";
import { ArticleFeedParamsFields } from "../ArticleFeedParamsFields";

vi.mock("../../../api/useFeed");

describe("Article Feed Params Fields", () => {
  const defaultProps = {
    params: {
      date: "2021-01-01",
      languageCode: "en",
    },
    onParamsChange: vi.fn(),
  };

  const mockUseGetAvailableFeedLanguagesResponse = (response: Language[]) => {
    const mockUseGetAvailableFeedLanguages = vi
      .fn()
      .mockReturnValue({ data: response, isLoading: false } as UseQueryResult<
        GetAvailableFeedLanguagesResponse,
        unknown
      >);

    vi.mocked(useFeed).mockReturnValue({
      ...((() => {}) as typeof useFeed)(),
      useGetAvailableFeedLanguages: mockUseGetAvailableFeedLanguages,
    });

    return mockUseGetAvailableFeedLanguages;
  };

  test("should render correctly", () => {
    mockUseGetAvailableFeedLanguagesResponse([]);

    render(<ArticleFeedParamsFields {...defaultProps} />);
  });

  test("should render language options", () => {
    const languages = Array.from({ length: 2 }, () => createLanguageMock());

    languages[0] = { ...languages[0], code: "en", name: "English" };
    languages[1] = { ...languages[1], code: "es", name: "Spanish" };

    mockUseGetAvailableFeedLanguagesResponse(languages);

    const { getByText } = render(<ArticleFeedParamsFields {...defaultProps} />);

    const languageSelect = getByText("English");
    fireEvent.mouseDown(languageSelect);

    const languageOptions = languageSelect.querySelectorAll(
      ".ant-select-item-option-content",
    );

    languageOptions.forEach((option) => {
      expect(
        ["English", "Spanish"].includes(option.innerHTML),
      ).toBeInTheDocument();
    });
  });

  test("should change language parameters", () => {
    const languages = Array.from({ length: 2 }, () => createLanguageMock());

    languages[0] = { ...languages[0], code: "en", name: "English" };
    languages[1] = { ...languages[1], code: "es", name: "Spanish" };

    mockUseGetAvailableFeedLanguagesResponse(languages);

    const { getByText } = render(<ArticleFeedParamsFields {...defaultProps} />);

    const languageSelect = getByText("English");
    fireEvent.mouseDown(languageSelect);

    const spanishOption = getByText("Spanish");
    fireEvent.click(spanishOption);

    expect(defaultProps.onParamsChange).toHaveBeenCalledWith({
      ...defaultProps.params,
      languageCode: "es",
    });
  });

  test("should change date parameters", () => {
    const languages = Array.from({ length: 2 }, () => createLanguageMock());

    languages[0] = { ...languages[0], code: "en", name: "English" };
    languages[1] = { ...languages[1], code: "es", name: "Spanish" };

    mockUseGetAvailableFeedLanguagesResponse(languages);

    const { baseElement, getByTestId } = render(
      <ArticleFeedParamsFields {...defaultProps} />,
    );

    const dateInput = getByTestId("article-feed-params-fields-date-picker");
    fireEvent.mouseDown(dateInput);
    fireEvent.change(dateInput, { target: { value: "2021-01-02" } });
    fireEvent.click(baseElement.querySelector(".ant-picker-cell-selected")!);

    expect(defaultProps.onParamsChange).toHaveBeenCalledWith({
      ...defaultProps.params,
      date: "2021-01-02",
    });
  });
});
