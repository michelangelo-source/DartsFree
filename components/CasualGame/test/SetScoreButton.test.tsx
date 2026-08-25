import { fireEvent, render } from "@testing-library/react-native";
import SetScoreButton from "../SetScoreButton";

describe("SetScoreButton Component", () => {
  const mockSetTarget = jest.fn();

  const defaultProps = {
    target: 501,
    setTarget: mockSetTarget,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the target score correctly", async () => {
    const { getByText } = await render(<SetScoreButton {...defaultProps} />);

    expect(getByText("501")).toBeTruthy();
  });

  it("calls setTarget with the correct target value when pressed", async () => {
    const customProps = { target: 301, setTarget: mockSetTarget };
    const { getByText } = await render(<SetScoreButton {...customProps} />);

    fireEvent.press(getByText("301"));

    expect(mockSetTarget).toHaveBeenCalledTimes(1);
    expect(mockSetTarget).toHaveBeenCalledWith(301);
  });
});
