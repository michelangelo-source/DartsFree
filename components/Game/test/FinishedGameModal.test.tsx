import { useGameStore } from "@/store/GameStore";
import { useTournamentStore } from "@/store/Tournament/TournamentStore";
import { fireEvent, render } from "@testing-library/react-native";
import { router } from "expo-router";
import { FinishedGameModal } from "../FinishedGameModal";

jest.mock("expo-router", () => ({
  router: {
    navigate: jest.fn(),
  },
}));

jest.mock("@/store/GameStore", () => ({
  useGameStore: jest.fn(),
}));

jest.mock("@/store/Tournament/TournamentStore", () => ({
  useTournamentStore: jest.fn(),
}));

describe("FinishedGameModal Component", () => {
  const mockQuitGame = jest.fn();
  const mockNextLeg = jest.fn();
  const mockStartMatch = jest.fn();
  const mockSetOpen = jest.fn();
  const mockResetOrder = jest.fn();

  const mockWinner = {
    name: "Alice",
    wins: 2,
    score: 150,
    dartsThrown: 5,
    history: [],
  };

  const defaultProps = {
    open: true,
    winner: mockWinner,
    resetOrder: mockResetOrder,
    setOpen: mockSetOpen,
  };

  beforeEach(() => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      quitGame: mockQuitGame,
      nextLeg: mockNextLeg,
    });

    (useTournamentStore as unknown as jest.Mock).mockReturnValue({
      isStarted: false,
      startMatch: mockStartMatch,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays correct winner text and statistics", async () => {
    const { getByText } = await render(<FinishedGameModal {...defaultProps} />);

    expect(getByText("Winner: Alice")).toBeTruthy();
    expect(getByText("Darts Thrown: 5")).toBeTruthy();
    expect(getByText("Average: 30")).toBeTruthy();
  });

  it("displays average as 0 if dartsThrown is 0 to avoid NaN", async () => {
    const winnerZeroDarts = { ...mockWinner, score: 0, dartsThrown: 0 };
    const { getByText } = await render(
      <FinishedGameModal {...defaultProps} winner={winnerZeroDarts} />,
    );

    expect(getByText("Average: 0")).toBeTruthy();
  });

  describe("Casual Mode (Tournament isStarted: false)", () => {
    it("handles 'Quit Game' button press correctly", async () => {
      const { getByText } = await render(
        <FinishedGameModal {...defaultProps} />,
      );

      const quitButton = getByText("Quit Game");
      fireEvent.press(quitButton);

      expect(mockSetOpen).toHaveBeenCalledWith(false);
      expect(router.navigate).toHaveBeenCalledWith("/MainMenu");
      expect(mockQuitGame).toHaveBeenCalled();
    });

    it("handles 'Next Leg' button press correctly", async () => {
      const { getByText } = await render(
        <FinishedGameModal {...defaultProps} />,
      );

      const nextButton = getByText("Next Leg");
      fireEvent.press(nextButton);

      expect(mockNextLeg).toHaveBeenCalledWith("Alice");
      expect(mockResetOrder).toHaveBeenCalled();
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });

  describe("Tournament Mode (Tournament isStarted: true)", () => {
    beforeEach(() => {
      (useTournamentStore as unknown as jest.Mock).mockReturnValue({
        isStarted: true,
        startMatch: mockStartMatch,
      });
    });

    it("renders tournament buttons and hides casual buttons", async () => {
      const { getByText, queryByText } = await render(
        <FinishedGameModal {...defaultProps} />,
      );

      expect(getByText("See Bracket")).toBeTruthy();
      expect(getByText("Next Match")).toBeTruthy();
      expect(queryByText("Quit Game")).toBeNull();
      expect(queryByText("Next Leg")).toBeNull();
    });

    it("handles 'See Bracket' button press correctly", async () => {
      const { getByText } = await render(
        <FinishedGameModal {...defaultProps} />,
      );

      const bracketButton = getByText("See Bracket");
      fireEvent.press(bracketButton);

      expect(mockSetOpen).toHaveBeenCalledWith(false);
      expect(router.navigate).toHaveBeenCalledWith("/Tournament");
      expect(mockQuitGame).toHaveBeenCalled();
    });

    it("handles 'Next Match' button press correctly", async () => {
      const { getByText } = await render(
        <FinishedGameModal {...defaultProps} />,
      );

      const nextMatchButton = getByText("Next Match");
      fireEvent.press(nextMatchButton);

      expect(mockQuitGame).toHaveBeenCalled();
      expect(mockSetOpen).toHaveBeenCalledWith(false);
      expect(mockStartMatch).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith("/Game");
    });
  });
});
