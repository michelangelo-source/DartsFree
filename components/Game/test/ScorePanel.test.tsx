import { fireEvent, render } from "@testing-library/react-native";
import { ScorePanel } from "../ScorePanel";

describe("ScorePanel Component", () => {
  const mockHandlePress = jest.fn();

  const defaultProps = {
    title: "D-",
    multiplier: 2,
    handlePress: mockHandlePress,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the title correctly", async () => {
    const { getByText } = await render(<ScorePanel {...defaultProps} />);

    expect(getByText("D-")).toBeTruthy();
  });

  it("renders buttons from both columns", async () => {
    const { getByText } = await render(<ScorePanel {...defaultProps} />);

    expect(getByText("1")).toBeTruthy();
    expect(getByText("10")).toBeTruthy();

    expect(getByText("11")).toBeTruthy();
    expect(getByText("20")).toBeTruthy();
  });

  it("calls handlePress with correct value and multiplier from the first column", async () => {
    const { getByText } = await render(<ScorePanel {...defaultProps} />);

    fireEvent.press(getByText("5"));

    expect(mockHandlePress).toHaveBeenCalledWith(5, 2);
  });

  it("calls handlePress with correct value and multiplier from the second column", async () => {
    const tripleProps = { ...defaultProps, title: "Triple", multiplier: 3 };
    const { getByText } = await render(<ScorePanel {...tripleProps} />);

    fireEvent.press(getByText("17"));

    expect(mockHandlePress).toHaveBeenCalledWith(17, 3);
  });
});
