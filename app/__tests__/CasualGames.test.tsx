import { useGameStore } from "@/store/GameStore";
import { act, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import Toast from "react-native-toast-message";
import CasualGames from "../CasualGames";

const MockCirclePlus: React.FC<any> = () => (
  <Text testID="circle-plus-icon">CirclePlus</Text>
);

const MockPlayerTab: React.FC<any> = ({ player }) => (
  <Text testID={`player-tab-${player?.name}`}>{player?.name}</Text>
);

const MockLink: React.FC<any> = ({ children, disabled }) =>
  React.cloneElement(children as any, { disabled } as any);

jest.mock("@/components/CasualGame/PlayerTab", () => ({
  PlayerTab: (props: any) => MockPlayerTab(props),
}));

jest.mock("lucide-react-native", () => ({
  CirclePlus: (props: any) => MockCirclePlus(props),
}));

jest.mock("expo-router", () => ({
  Link: (props: any) => MockLink(props),
}));

jest.mock("@/store/GameStore", () => ({
  useGameStore: jest.fn(),
}));

jest.mock("react-native-toast-message", () => ({
  __esModule: true,
  default: { show: jest.fn() },
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
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the setup screen correctly", async () => {
    const { getByText, getByPlaceholderText } = await render(<CasualGames />);

    expect(getByText("Game Setup")).toBeTruthy();
    expect(getByPlaceholderText("Insert player")).toBeTruthy();
  });

  it("adds a new player correctly", async () => {
    const { getByPlaceholderText, getByTestId } = await render(<CasualGames />);

    const input = getByPlaceholderText("Insert player");
    const addButton = getByTestId("circle-plus-icon");

    await act(async () => {
      fireEvent.changeText(input, "Alice");
    });

    await act(async () => {
      fireEvent.press(addButton);
    });

    expect(mockAddPlayer).toHaveBeenCalledTimes(1);
    expect(mockAddPlayer).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Alice", score: 0 }),
    );
  });

  it("shows an error toast if adding a duplicate player", async () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      target: 501,
      lastDartMultiplier: 2,
      setTarget: mockSetTarget,
      players: [
        { name: "Bob", score: 0, wins: 0, dartsThrown: 0, history: [] },
      ],
      addPlayer: mockAddPlayer,
      deletePlayer: mockDeletePlayer,
    });

    const { getByPlaceholderText, getByTestId } = await render(<CasualGames />);

    const input = getByPlaceholderText("Insert player");
    const addButton = getByTestId("circle-plus-icon");

    await act(async () => {
      fireEvent.changeText(input, "Bob");
    });

    await act(async () => {
      fireEvent.press(addButton);
    });

    expect(mockAddPlayer).not.toHaveBeenCalled();
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error", text1: "User already exists" }),
    );
  });

  it("disables the start button if there are less than 2 players", async () => {
    const { getByTestId } = await render(<CasualGames />);
    const startButton = getByTestId("start-button");

    expect(startButton.props.accessibilityState?.disabled).toBe(true);
  });

  describe("Target Validation Logic", () => {
    it("allows valid numbers like 101 without showing toast", async () => {
      (useGameStore as unknown as jest.Mock).mockReturnValue({
        target: 101,
        lastDartMultiplier: 2,
        setTarget: mockSetTarget,
        players: [],
        addPlayer: mockAddPlayer,
        deletePlayer: mockDeletePlayer,
      });

      const { getByTestId } = await render(<CasualGames />);
      const targetInput = getByTestId("target-input");

      await act(async () => {
        fireEvent(targetInput, "endEditing");
      });

      expect(Toast.show).not.toHaveBeenCalled();
      expect(mockSetTarget).not.toHaveBeenCalledWith(2);
    });

    it("blocks a target lower than lastDartMultiplier and corrects it", async () => {
      (useGameStore as unknown as jest.Mock).mockReturnValue({
        target: 1,
        lastDartMultiplier: 2,
        setTarget: mockSetTarget,
        players: [],
        addPlayer: mockAddPlayer,
        deletePlayer: mockDeletePlayer,
      });

      const { getByTestId } = await render(<CasualGames />);
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
  });
});
