import { useTournamentStore } from "@/store/Tournament/TournamentStore";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text, View } from "react-native";
import { Bracket } from "../Bracket";

const MockAnimatedView: React.FC<any> = ({ children, testID }) => (
  <View testID={testID || "animated-view"}>{children}</View>
);

jest.mock("react-native-reanimated", () => ({
  __esModule: true,
  default: {
    View: (props: any) => MockAnimatedView(props),
    ScrollView: (props: any) => MockAnimatedView(props),
  },
  useSharedValue: jest.fn(() => ({ value: 0 })),
  useAnimatedStyle: jest.fn(() => ({})),
  clamp: jest.fn(),
  scrollTo: jest.fn(),
  withDecay: jest.fn(),
}));

const MockGestureDetector: React.FC<any> = ({ children }) => <>{children}</>;

jest.mock("react-native-gesture-handler", () => ({
  GestureDetector: (props: any) => MockGestureDetector(props),
  Gesture: {
    Pan: () => ({
      onStart: jest.fn().mockReturnThis(),
      onUpdate: jest.fn().mockReturnThis(),
      onEnd: jest.fn().mockReturnThis(),
    }),
  },
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

const MockPlayIcon: React.FC<any> = () => <Text testID="play-icon">Play</Text>;

jest.mock("lucide-react-native", () => ({
  Play: () => MockPlayIcon({}),
}));

jest.mock("@/store/Tournament/TournamentStore", () => ({
  useTournamentStore: jest.fn(),
}));

describe("Bracket Component", () => {
  const mockHandleStart = jest.fn();

  const defaultProps = {
    scrollViewRef: { current: null } as any,
    scrollY: { value: 0 } as any,
    handleStart: mockHandleStart,
  };

  beforeEach(() => {
    (useTournamentStore as unknown as jest.Mock).mockReturnValue({
      readyToStart: false,
      legsToWin: [],
      setLegToWin: jest.fn(),
      tournamentMatches: [],
      target: 501,
      lastDartMultiplier: 2,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with no matches", async () => {
    const { queryByTestId } = await render(<Bracket {...defaultProps} />);
    expect(queryByTestId("animated-view")).toBeNull();
  });

  it("renders match players correctly", async () => {
    (useTournamentStore as unknown as jest.Mock).mockReturnValue({
      readyToStart: false,
      legsToWin: [],
      setLegToWin: jest.fn(),
      target: 501,
      lastDartMultiplier: 2,
      tournamentMatches: [
        {
          id: "match-1",
          round: 1,
          player1: { name: "Alice" },
          player2: { name: "Bob" },
        },
      ],
    });

    const { getByText } = await render(<Bracket {...defaultProps} />);

    expect(getByText("Alice")).toBeTruthy();
    expect(getByText("Bob")).toBeTruthy();
  });

  it("shows the Play button and triggers handleStart when readyToStart is true and no winner is selected", async () => {
    const mockMatch = {
      id: "match-1",
      round: 1,
      player1: { name: "Alice" },
      player2: { name: "Bob" },
      winner: null,
    };

    (useTournamentStore as unknown as jest.Mock).mockReturnValue({
      readyToStart: true,
      legsToWin: [],
      setLegToWin: jest.fn(),
      target: 501,
      lastDartMultiplier: 2,
      tournamentMatches: [mockMatch],
    });

    const { getByTestId } = await render(<Bracket {...defaultProps} />);
    const playButton = getByTestId("play-icon");

    expect(playButton).toBeTruthy();

    fireEvent.press(playButton);
    expect(mockHandleStart).toHaveBeenCalledTimes(1);
    expect(mockHandleStart).toHaveBeenCalledWith(mockMatch);
  });

  it("does not show the Play button if the match already has a winner", async () => {
    (useTournamentStore as unknown as jest.Mock).mockReturnValue({
      readyToStart: true,
      legsToWin: [],
      setLegToWin: jest.fn(),
      target: 501,
      lastDartMultiplier: 2,
      tournamentMatches: [
        {
          id: "match-1",
          round: 1,
          player1: { name: "Alice" },
          player2: { name: "Bob" },
          winner: 1,
        },
      ],
    });

    const { queryByTestId } = await render(<Bracket {...defaultProps} />);

    expect(queryByTestId("play-icon")).toBeNull();
  });

  it("does not show the Play button if readyToStart is false", async () => {
    (useTournamentStore as unknown as jest.Mock).mockReturnValue({
      readyToStart: false,
      legsToWin: [],
      setLegToWin: jest.fn(),
      target: 501,
      lastDartMultiplier: 2,
      tournamentMatches: [
        {
          id: "match-1",
          round: 1,
          player1: { name: "Alice" },
          player2: { name: "Bob" },
          winner: null,
        },
      ],
    });

    const { queryByTestId } = await render(<Bracket {...defaultProps} />);

    expect(queryByTestId("play-icon")).toBeNull();
  });

  it("does not show the Play button if target is less than lastDartMultiplier", async () => {
    (useTournamentStore as unknown as jest.Mock).mockReturnValue({
      readyToStart: true,
      legsToWin: [],
      setLegToWin: jest.fn(),
      target: 1,
      lastDartMultiplier: 2,
      tournamentMatches: [
        {
          id: "match-1",
          round: 1,
          player1: { name: "Alice" },
          player2: { name: "Bob" },
          winner: null,
        },
      ],
    });

    const { queryByTestId } = await render(<Bracket {...defaultProps} />);

    expect(queryByTestId("play-icon")).toBeNull();
  });
});
