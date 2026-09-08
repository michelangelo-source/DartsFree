import { act, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { ManageScore } from "../ManageScore";

const MockSetScoreButton: React.FC<any> = ({ target, setTarget }) => (
  <TouchableOpacity
    testID={`set-score-${target}`}
    onPress={() => setTarget(target)}
  >
    <Text>{target}</Text>
  </TouchableOpacity>
);

jest.mock("react-native-toast-message", () => ({
  __esModule: true,
  default: { show: jest.fn() },
}));

jest.mock("@/components/CasualGame/SetScoreButton", () => ({
  __esModule: true,
  default: (props: any) => MockSetScoreButton(props),
}));

describe("ManageScore Component", () => {
  const mockSetTarget = jest.fn();

  const mockSetLastDartMultiplier = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with quick set score buttons", async () => {
    const { getByTestId } = await render(
      <ManageScore
        target={501}
        setTarget={mockSetTarget}
        lastDartMultiplier={2}
        setLastDartMultiplier={mockSetLastDartMultiplier}
      />,
    );

    expect(getByTestId("target-input")).toBeTruthy();
    expect(getByTestId("set-score-301")).toBeTruthy();
    expect(getByTestId("set-score-501")).toBeTruthy();
    expect(getByTestId("set-score-701")).toBeTruthy();
  });

  it("filters out non-numeric characters on text input", async () => {
    const { getByTestId } = await render(
      <ManageScore
        target={501}
        setTarget={mockSetTarget}
        lastDartMultiplier={2}
        setLastDartMultiplier={mockSetLastDartMultiplier}
      />,
    );

    const targetInput = getByTestId("target-input");

    await act(async () => {
      fireEvent.changeText(targetInput, "1a0b1");
    });

    expect(mockSetTarget).toHaveBeenCalledWith(101);
  });

  it("allows valid numbers like 101 without showing toast on end editing", async () => {
    const { getByTestId } = await render(
      <ManageScore
        target={101}
        setTarget={mockSetTarget}
        lastDartMultiplier={2}
        setLastDartMultiplier={mockSetLastDartMultiplier}
      />,
    );

    const targetInput = getByTestId("target-input");

    await act(async () => {
      fireEvent(targetInput, "endEditing");
    });

    expect(Toast.show).not.toHaveBeenCalled();
    expect(mockSetTarget).not.toHaveBeenCalledWith(2);
  });

  it("blocks a target lower than lastDartMultiplier and corrects it", async () => {
    const { getByTestId } = await render(
      <ManageScore
        target={1}
        setTarget={mockSetTarget}
        lastDartMultiplier={2}
        setLastDartMultiplier={mockSetLastDartMultiplier}
      />,
    );

    const targetInput = getByTestId("target-input");

    await act(async () => {
      fireEvent(targetInput, "endEditing");
    });

    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        text1: "Target too low",
      }),
    );
    expect(mockSetTarget).toHaveBeenCalledWith(2);
  });

  it("sets predefined targets correctly when quick buttons are pressed", async () => {
    const { getByTestId } = await render(
      <ManageScore
        target={501}
        setTarget={mockSetTarget}
        lastDartMultiplier={2}
        setLastDartMultiplier={mockSetLastDartMultiplier}
      />,
    );

    const button301 = getByTestId("set-score-301");

    await act(async () => {
      fireEvent.press(button301);
    });

    expect(mockSetTarget).toHaveBeenCalledWith(301);
  });
});
