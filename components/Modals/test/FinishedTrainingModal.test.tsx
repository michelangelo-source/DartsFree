import { fireEvent, render } from "@testing-library/react-native";
import { router } from "expo-router";
import { FinishedTrainingModal } from "../FinishedTrainingModal";

jest.mock("expo-router", () => ({
  router: {
    navigate: jest.fn(),
  },
}));

describe("FinishedTrainingModal Component", () => {
  const mockResetTraining = jest.fn();

  const defaultProps = {
    open: true,
    result: "15/20 (75%)",
    resetTraining: mockResetTraining,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders result text when open", async () => {
    const { getByText } = await render(
      <FinishedTrainingModal {...defaultProps} />,
    );

    expect(getByText("Result:")).toBeTruthy();
    expect(getByText("15/20 (75%)")).toBeTruthy();
  });

  it("renders Exit and Reset buttons", async () => {
    const { getByText } = await render(
      <FinishedTrainingModal {...defaultProps} />,
    );

    expect(getByText("Exit")).toBeTruthy();
    expect(getByText("Reset")).toBeTruthy();
  });

  it("does not render when closed", async () => {
    const { queryByText } = await render(
      <FinishedTrainingModal {...defaultProps} open={false} />,
    );

    expect(queryByText("Result:")).toBeNull();
  });

  it("navigates to MainMenu on Exit press", async () => {
    const { getByText } = await render(
      <FinishedTrainingModal {...defaultProps} />,
    );

    fireEvent.press(getByText("Exit"));

    expect(router.navigate).toHaveBeenCalledWith("/MainMenu");
  });

  it("calls resetTraining on Reset press", async () => {
    const { getByText } = await render(
      <FinishedTrainingModal {...defaultProps} />,
    );

    fireEvent.press(getByText("Reset"));

    expect(mockResetTraining).toHaveBeenCalled();
  });
});
