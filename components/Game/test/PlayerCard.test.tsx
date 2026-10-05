import { render } from "@testing-library/react-native";
import { PlayerCard } from "../PlayerCard";

describe("PlayerCard Component", () => {
  const mockPlayer = {
    name: "John",
    wins: 2,
    score: 100,
    dartsThrown: 3,
    history: [],
  };

  const defaultProps = {
    target: 501,
    isCurrentPlayer: true,
    player: mockPlayer,
    playerCount: 3,
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("displays player name correctly", async () => {
    const { getByText } = await render(<PlayerCard {...defaultProps} />);

    expect(getByText("John")).toBeTruthy();
  });

  it("calculates and displays remaining score correctly", async () => {
    const { getByText } = await render(<PlayerCard {...defaultProps} />);

    expect(getByText("401")).toBeTruthy();
  });

  it("calculates and displays average correctly", async () => {
    const { getByText } = await render(<PlayerCard {...defaultProps} />);

    expect(getByText("100")).toBeTruthy();
  });

  it("displays average as 0 when no darts have been thrown", async () => {
    const playerWithZeroThrows = { ...mockPlayer, score: 0, dartsThrown: 0 };

    const { getByText } = await render(
      <PlayerCard {...defaultProps} player={playerWithZeroThrows} />,
    );

    expect(getByText("0")).toBeTruthy();
  });

  it("calculates correct width for 1 player (screenWidth - 20)", async () => {
    const { getByTestId } = await render(
      <PlayerCard {...defaultProps} playerCount={1} />,
    );
    const card = getByTestId("player-card");
    expect(card.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: 730 })]),
    );
  });

  it("calculates correct width for 2 players (screenWidth / 2 - 20)", async () => {
    const { getByTestId } = await render(
      <PlayerCard {...defaultProps} playerCount={2} />,
    );
    const card = getByTestId("player-card");
    expect(card.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: 355 })]),
    );
  });

  it("calculates correct width for 3 or more players (screenWidth / 3 - 20)", async () => {
    const { getByTestId } = await render(
      <PlayerCard {...defaultProps} playerCount={4} />,
    );
    const card = getByTestId("player-card");
    expect(card.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: 230 })]),
    );
  });
});
