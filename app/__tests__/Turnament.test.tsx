import { useTournamentStore } from "@/store/Tournament/TournamentStore";
import { useGameStore } from "@/store/GameStore";
import { act, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text, View } from "react-native";
import Tournament from "../Tournament";

jest.mock("@/store/GameStore", () => ({
  useGameStore: {
    getState: jest.fn(),
  },
}));

const MockAnimatedScrollView: React.FC<any> = ({
  children,
  contentContainerStyle,
}) => (
  <View testID="animated-scroll-view" style={contentContainerStyle}>
    {children}
  </View>
);

jest.mock("react-native-reanimated", () => ({
  __esModule: true,
  default: {
    ScrollView: (props: any) => MockAnimatedScrollView(props),
  },
  useAnimatedRef: jest.fn(() => ({ current: null })),
  useScrollOffset: jest.fn(() => ({ value: 0 })),
}));

const MockManagePlayers: React.FC<any> = () => (
  <Text testID="manage-players-mock">ManagePlayers</Text>
);

const MockManageScore: React.FC<any> = () => (
  <Text testID="manage-score-mock">ManageScore</Text>
);

const MockBracket: React.FC<any> = () => (
  <Text testID="bracket-mock">Bracket</Text>
);

const MockExitGameModal: React.FC<any> = () => (
  <Text testID="exit-game-modal">Exit</Text>
);

jest.mock("@/components/SetupGame/ManagePlayers", () => ({
  ManagePlayers: (props: any) => MockManagePlayers(props),
}));

jest.mock("@/components/SetupGame/ManageScore", () => ({
  ManageScore: (props: any) => MockManageScore(props),
}));

jest.mock("@/components/Tournament/Bracket/Bracket", () => ({
  Bracket: (props: any) => MockBracket(props),
}));

jest.mock("@/components/Modals/ExitGameModal", () => ({
  ExitGameModal: (props: any) => MockExitGameModal(props),
}));

jest.mock("expo-router/build/global-state/router", () => ({
  router: {
    navigate: jest.fn(),
  },
}));

jest.mock("@/store/Tournament/TournamentStore", () => ({
  useTournamentStore: jest.fn(),
}));

describe("Tournament Screen", () => {
  const mockSetTournamentTarget = jest.fn();
  const mockStartMatch = jest.fn();
  const mockAddTournamentParticipants = jest.fn();
  const mockDeleteTournamentParticipants = jest.fn();
  const mockRandomizeTournament = jest.fn();

  const defaultTournamentState = {
    readyToStart: false,
    lastDartMultiplier: 2,
    target: 501,
    isStarted: false,
    tournamentParticipants: [],
    setTournamentTarget: mockSetTournamentTarget,
    startMatch: mockStartMatch,
    addTournamentParticipants: mockAddTournamentParticipants,
    deleteTournamentParticipants: mockDeleteTournamentParticipants,
    randomizeTournament: mockRandomizeTournament,
    resetTournament: jest.fn(),
  };

  beforeEach(() => {
    (useTournamentStore as unknown as jest.Mock).mockReturnValue(
      defaultTournamentState,
    );
    (useGameStore.getState as jest.Mock).mockReturnValue({
      quitGame: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders setup elements when tournament has not started", async () => {
    const { getByText, getByTestId } = await render(<Tournament />);

    expect(getByText("Tournament")).toBeTruthy();
    expect(getByTestId("manage-score-mock")).toBeTruthy();
    expect(getByTestId("manage-players-mock")).toBeTruthy();
    expect(getByTestId("bracket-mock")).toBeTruthy();
  });

  it("hides setup elements and shows next match button when tournament has started and is ready", async () => {
    (useTournamentStore as unknown as jest.Mock).mockReturnValue({
      ...defaultTournamentState,
      isStarted: true,
      readyToStart: true,
      tournamentParticipants: [
        { name: "Alice", score: 0 },
        { name: "Bob", score: 0 },
      ],
    });

    const { queryByTestId, getByText } = await render(<Tournament />);

    expect(queryByTestId("manage-score-mock")).toBeNull();
    expect(queryByTestId("manage-players-mock")).toBeNull();
    expect(getByText("Next Match")).toBeTruthy();
  });

  it("disables shuffle button when there are fewer than 2 participants", async () => {
    const { getByText } = await render(<Tournament />);
    const shuffleButton = getByText("Shuffle").parent;

    expect(shuffleButton?.props.accessibilityState?.disabled).toBe(true);
  });

  it("enables shuffle button and triggers randomizeTournament when pressed with 2 or more participants", async () => {
    (useTournamentStore as unknown as jest.Mock).mockReturnValue({
      ...defaultTournamentState,
      tournamentParticipants: [
        { name: "Alice", score: 0 },
        { name: "Bob", score: 0 },
      ],
    });

    const { getByText } = await render(<Tournament />);
    const shuffleButton = getByText("Shuffle").parent;

    expect(shuffleButton?.props.accessibilityState?.disabled).toBeFalsy();

    await act(async () => {
      fireEvent.press(shuffleButton!);
    });

    expect(mockRandomizeTournament).toHaveBeenCalledTimes(1);
  });
  it("renders ExitGameModal when there are tournament participants", async () => {
    (useTournamentStore as unknown as jest.Mock).mockReturnValue({
      ...defaultTournamentState,
      tournamentParticipants: [{ name: "Alice", score: 0 }],
    });

    const { getByTestId } = await render(<Tournament />);
    expect(getByTestId("exit-game-modal")).toBeTruthy();
  });

  it("does not render ExitGameModal when there are no tournament participants", async () => {
    (useTournamentStore as unknown as jest.Mock).mockReturnValue({
      ...defaultTournamentState,
      tournamentParticipants: [],
    });

    const { queryByTestId } = await render(<Tournament />);
    expect(queryByTestId("exit-game-modal")).toBeNull();
  });

  it("calls resetTournament and GameStore.quitGame on unmount", async () => {
    const mockResetTournament = jest.fn();
    (useTournamentStore as unknown as jest.Mock).mockReturnValue({
      ...defaultTournamentState,
      resetTournament: mockResetTournament,
    });

    const mockQuitGame = jest.fn();
    (useGameStore.getState as jest.Mock).mockReturnValue({
      quitGame: mockQuitGame,
    });

    const { unmount } = await render(<Tournament />);
    await act(async () => {
      unmount();
    });

    expect(mockResetTournament).toHaveBeenCalled();
    expect(mockQuitGame).toHaveBeenCalled();
  });
});
