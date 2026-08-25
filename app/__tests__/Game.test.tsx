import { useGame } from "@/hooks/useGame";
import { act, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import Game from "../Game";

const MockPlayerCard: React.FC<any> = ({ player }) => (
  <Text testID={`player-card-${player?.name}`}>{player?.name}</Text>
);
const MockBustBar: React.FC<any> = () => <Text testID="bust-bar">Bust!</Text>;
const MockScorePreviewPanel: React.FC<any> = () => (
  <Text testID="score-preview">Preview</Text>
);
const MockNonStandardScorePanel: React.FC<any> = () => (
  <Text testID="non-standard-panel">NonStandard</Text>
);
const MockScorePanel: React.FC<any> = ({ title }) => (
  <Text testID={`score-panel-${title}`}>{title}</Text>
);
const MockFinishedGameModal: React.FC<any> = ({ open }) => (
  <Text testID="finished-modal">{open ? "open" : "closed"}</Text>
);

jest.mock("@/components/Game/PlayerCard", () => ({
  PlayerCard: (props: any) => MockPlayerCard(props),
}));
jest.mock("@/components/Game/BustBar", () => ({
  BustBar: (props: any) => MockBustBar(props),
}));
jest.mock("@/components/Game/ScorePreviewPanel", () => ({
  ScorePreviewPanel: (props: any) => MockScorePreviewPanel(props),
}));
jest.mock("@/components/Game/NonStandardScorePanel", () => ({
  NonStandardScorePanel: (props: any) => MockNonStandardScorePanel(props),
}));
jest.mock("@/components/Game/ScorePanel", () => ({
  ScorePanel: (props: any) => MockScorePanel(props),
}));
jest.mock("@/components/Game/FinishedGameModal", () => ({
  FinishedGameModal: (props: any) => MockFinishedGameModal(props),
}));

jest.mock("@/hooks/useGame", () => ({
  useGame: jest.fn(),
}));

describe("Game Screen", () => {
  const mockAddScore = jest.fn();
  const mockSetCurrentPlayerIndex = jest.fn();
  const mockUndoLastThrow = jest.fn();
  const mockNextPlayer = jest.fn();
  const mockSetFinished = jest.fn();

  const defaultUseGameState = {
    target: 501,
    currentPlayer: { name: "Alice", score: 0 },
    currentPlayerIndex: 0,
    players: [{ name: "Alice" }, { name: "Bob" }],
    playersListRef: { current: null },
    currentThrows: { firstThrow: null, secondThrow: null, thirdThrow: null },
    bust: false,
    isTurnOver: false,
    finished: false,
    classicScore: [],
    addScore: mockAddScore,
    setCurrentPlayerIndex: mockSetCurrentPlayerIndex,
    undoLastThrow: mockUndoLastThrow,
    nextPlayer: mockNextPlayer,
    setFinished: mockSetFinished,
  };

  beforeEach(() => {
    (useGame as jest.Mock).mockReturnValue(defaultUseGameState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders standard game interface components correctly", async () => {
    const { getByText, getByTestId, queryByTestId } = await render(<Game />);

    expect(getByTestId("player-card-Alice")).toBeTruthy();
    expect(getByTestId("player-card-Bob")).toBeTruthy();

    expect(getByText("Undo last throw")).toBeTruthy();
    expect(getByText("Next Player")).toBeTruthy();

    expect(getByTestId("score-panel-S-")).toBeTruthy();
    expect(getByTestId("score-panel-D-")).toBeTruthy();
    expect(getByTestId("score-panel-T-")).toBeTruthy();

    expect(queryByTestId("bust-bar")).toBeNull();
  });

  it("renders BustBar when bust state is true", async () => {
    (useGame as jest.Mock).mockReturnValue({
      ...defaultUseGameState,
      bust: true,
    });

    const { getByTestId } = await render(<Game />);

    expect(getByTestId("bust-bar")).toBeTruthy();
  });

  it("calls undoLastThrow when undo button is pressed", async () => {
    const { getByText } = await render(<Game />);
    const undoButton = getByText("Undo last throw");

    await act(async () => {
      fireEvent.press(undoButton);
    });

    expect(mockUndoLastThrow).toHaveBeenCalledTimes(1);
  });

  it("calls nextPlayer when next player button is pressed", async () => {
    const { getByText } = await render(<Game />);
    const nextPlayerBtn = getByText("Next Player");

    await act(async () => {
      fireEvent.press(nextPlayerBtn);
    });

    expect(mockNextPlayer).toHaveBeenCalledTimes(1);
  });

  it("passes correct state to FinishedGameModal", async () => {
    (useGame as jest.Mock).mockReturnValue({
      ...defaultUseGameState,
      finished: true,
    });

    const { getByTestId } = await render(<Game />);

    expect(getByTestId("finished-modal").props.children).toBe("open");
  });
});
