import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import { MenuButton } from "../MenuButton";

jest.mock("expo-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

describe("MenuButton Component", () => {
  const mockIcon = <Text testID="mock-icon">Icon</Text>;

  const defaultProps = {
    href: "/TestRoute" as any,
    label: "Play Game",
    icon: mockIcon,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the label correctly", async () => {
    const { getByText } = await render(<MenuButton {...defaultProps} />);

    expect(getByText("Play Game")).toBeTruthy();
  });

  it("renders the provided icon component", async () => {
    const { getByTestId } = await render(<MenuButton {...defaultProps} />);

    expect(getByTestId("mock-icon")).toBeTruthy();
  });
});
