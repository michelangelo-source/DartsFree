import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import TrainingMenu from "../TrainingMenu";

jest.mock("expo-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

const mockClock = () => <Text testID="clock-icon">Clock</Text>;
const mockDices = () => <Text testID="dices-icon">Dices</Text>;

jest.mock("lucide-react-native", () => ({
  Clock: (props: any) => mockClock(),
  Dices: (props: any) => mockDices(),
}));

describe("TrainingMenu Screen", () => {
  it("renders Around The Clock button", async () => {
    const { getByText, getByTestId } = await render(<TrainingMenu />);

    expect(getByText("Around The Clock")).toBeTruthy();
    expect(getByTestId("clock-icon")).toBeTruthy();
  });

  it("renders Random button", async () => {
    const { getByText, getByTestId } = await render(<TrainingMenu />);

    expect(getByText("Random")).toBeTruthy();
    expect(getByTestId("dices-icon")).toBeTruthy();
  });
});
