import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import { PlayerTab } from "../PlayerTab";

const MockXIcon: React.FC<any> = () => <Text testID="delete-icon">X</Text>;

jest.mock("lucide-react-native", () => ({
  X: () => MockXIcon({}),
}));

jest.mock("react-native", () => {
  const rn = jest.requireActual("react-native");
  rn.useWindowDimensions = jest.fn(() => ({
    width: 400,
    height: 800,
    scale: 1,
    fontScale: 1,
  }));
  return rn;
});

describe("PlayerTab Component", () => {
  const mockHandleDeletePlayer = jest.fn();

  const mockPlayer = {
    name: "Charlie",
    wins: 0,
    score: 0,
    dartsThrown: 0,
    history: [],
  };

  const defaultProps = {
    player: mockPlayer,
    handleDeletePlayer: mockHandleDeletePlayer,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the player's name correctly", async () => {
    const { getByText } = await render(<PlayerTab {...defaultProps} />);

    expect(getByText("Charlie")).toBeTruthy();
  });

  it("calls handleDeletePlayer with the correct name when the delete button is pressed", async () => {
    const { getByTestId } = await render(<PlayerTab {...defaultProps} />);

    const deleteButton = getByTestId("delete-icon");
    fireEvent.press(deleteButton);

    expect(mockHandleDeletePlayer).toHaveBeenCalledTimes(1);
    expect(mockHandleDeletePlayer).toHaveBeenCalledWith("Charlie");
  });
});
