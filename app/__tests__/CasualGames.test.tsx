import { useGameStore } from "@/store/GameStore";
import { act, render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import CasualGames from "../CasualGames";

const MockManagePlayers: React.FC<any> = () => (
  <Text testID="manage-players-mock">ManagePlayers</Text>
);

const MockManageScore: React.FC<any> = () => (
  <Text testID="manage-score-mock">ManageScore</Text>
);

const MockLink: React.FC<any> = ({ children, disabled }) =>
  React.cloneElement(children as any, { disabled } as any);

jest.mock("@/components/SetupGame/ManagePlayers", () => ({
  ManagePlayers: (props: any) => MockManagePlayers(props),
}));

jest.mock("@/components/SetupGame/ManageScore", () => ({
  ManageScore: (props: any) => MockManageScore(props),
}));

jest.mock("expo-router", () => ({
  Link: (props: any) => MockLink(props),
}));

jest.mock("@/store/GameStore", () => ({
  useGameStore: jest.fn(),
}));

describe("CasualGames Screen", () => {
  const mockSetTarget = jest.fn();
  const mockAddPlayer = jest.fn();
  const mockDeletePlayer = jest.fn();

  beforeEach(() => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      target: 501,
      lastDartMultiplier: 2,
      setTarget: mockSetTarget,
      players: [],
      addPlayer: mockAddPlayer,
      deletePlayer: mockDeletePlayer,
      quitGame: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the setup screen and child components correctly", async () => {
    const { getByText, getByTestId } = await render(<CasualGames />);

    expect(getByText("Game Setup")).toBeTruthy();
    expect(getByTestId("manage-score-mock")).toBeTruthy();
    expect(getByTestId("manage-players-mock")).toBeTruthy();
  });

  it("disables the start button if there are less than 2 players", async () => {
    const { getByTestId } = await render(<CasualGames />);
    const startButton = getByTestId("start-button");

    expect(startButton.props.accessibilityState?.disabled).toBe(true);
  });

  it("enables the start button if there are 2 or more players", async () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      target: 501,
      lastDartMultiplier: 2,
      setTarget: mockSetTarget,
      players: [
        { name: "Alice", score: 0 },
        { name: "Bob", score: 0 },
      ],
      addPlayer: mockAddPlayer,
      deletePlayer: mockDeletePlayer,
      quitGame: jest.fn(),
    });

    const { getByTestId } = await render(<CasualGames />);
    const startButton = getByTestId("start-button");

    expect(startButton.props.accessibilityState?.disabled).toBeFalsy();
  });

  it("disables the start button if target is less than lastDartMultiplier", async () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      target: 1,
      lastDartMultiplier: 2,
      setTarget: mockSetTarget,
      players: [
        { name: "Alice", score: 0 },
        { name: "Bob", score: 0 },
      ],
      addPlayer: mockAddPlayer,
      deletePlayer: mockDeletePlayer,
      quitGame: jest.fn(),
    });

    const { getByTestId } = await render(<CasualGames />);
    const startButton = getByTestId("start-button");

    expect(startButton.props.accessibilityState?.disabled).toBe(true);
  });

  it("calls quitGame on unmount", async () => {
    const mockQuitGame = jest.fn();
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      target: 501,
      lastDartMultiplier: 2,
      setTarget: mockSetTarget,
      players: [],
      addPlayer: mockAddPlayer,
      deletePlayer: mockDeletePlayer,
      quitGame: mockQuitGame,
    });

    const { unmount } = await render(<CasualGames />);
    await act(async () => {
      unmount();
    });

    expect(mockQuitGame).toHaveBeenCalled();
  });
});
