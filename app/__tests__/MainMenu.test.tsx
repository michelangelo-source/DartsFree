import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import MainMenu from "../MainMenu"; // Upewnij się, że ścieżka jest poprawna

jest.mock("expo-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

const mockDartIcon = () => <Text testID="dart-icon">DartIcon</Text>;
const mockDartInTheBoard = () => (
  <Text testID="dart-in-the-board">DartInTheBoard</Text>
);
const mockThrowingMan = () => <Text testID="throwing-man">ThrowingMan</Text>;
const mockTrophy = () => <Text testID="trophy-icon">Trophy</Text>;

jest.mock("@/assets/icons/dartIcon.svg", () => () => mockDartIcon());
jest.mock(
  "@/assets/icons/dartInTheBoard.svg",
  () => () => mockDartInTheBoard(),
);
jest.mock("@/assets/icons/throwingMan.svg", () => () => mockThrowingMan());

jest.mock("lucide-react-native", () => ({
  Trophy: () => mockTrophy(),
}));

describe("MainMenu Screen", () => {
  it("renders the main title correctly", async () => {
    const { getByText, getByTestId } = await render(<MainMenu />);

    expect(getByText(/Darts Free/)).toBeTruthy();

    expect(getByTestId("dart-icon")).toBeTruthy();
  });

  it("renders all menu buttons with correct labels and icons", async () => {
    const { getByText, getByTestId } = await render(<MainMenu />);

    expect(getByText("Casual Games")).toBeTruthy();
    expect(getByTestId("dart-in-the-board")).toBeTruthy();

    expect(getByText("Tournament")).toBeTruthy();
    expect(getByTestId("trophy-icon")).toBeTruthy();

    expect(getByText("Training")).toBeTruthy();
    expect(getByTestId("throwing-man")).toBeTruthy();
  });
});
