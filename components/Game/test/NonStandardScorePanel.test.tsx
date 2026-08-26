import { fireEvent, render } from "@testing-library/react-native";
import { NonStandardScorePanel } from "../NonStandardScorePanel";

describe("NonStandardScorePanel Component", () => {
  const mockClassicScore = jest.fn();
  const mockAddScore = jest.fn();

  const defaultProps = {
    classicScore: mockClassicScore,
    addScore: mockAddScore,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all score buttons correctly", async () => {
    const { getByText } = await render(
      <NonStandardScorePanel {...defaultProps} />,
    );

    expect(getByText("MISS")).toBeTruthy();
    expect(getByText("26")).toBeTruthy();
    expect(getByText("25")).toBeTruthy();
    expect(getByText("50")).toBeTruthy();
  });

  it("calls addScore with 'MISS' and multiplier 1 when MISS button is pressed", async () => {
    const { getByText } = await render(
      <NonStandardScorePanel {...defaultProps} />,
    );

    fireEvent.press(getByText("MISS"));

    expect(mockAddScore).toHaveBeenCalledWith("MISS", 1);
  });

  it("calls classicScore when 26 button is pressed", async () => {
    const { getByText } = await render(
      <NonStandardScorePanel {...defaultProps} />,
    );

    fireEvent.press(getByText("26"));

    expect(mockClassicScore).toHaveBeenCalledTimes(1);
  });

  it("calls addScore with 25 and multiplier 1 when 25 button is pressed", async () => {
    const { getByText } = await render(
      <NonStandardScorePanel {...defaultProps} />,
    );

    fireEvent.press(getByText("25"));

    expect(mockAddScore).toHaveBeenCalledWith(25, 1);
  });

  it("calls addScore with 25 and multiplier 2 when 50 button is pressed", async () => {
    const { getByText } = await render(
      <NonStandardScorePanel {...defaultProps} />,
    );

    fireEvent.press(getByText("50"));

    expect(mockAddScore).toHaveBeenCalledWith(25, 2);
  });
});
