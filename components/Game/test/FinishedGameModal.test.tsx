import { fireEvent, render } from "@testing-library/react-native";
import { router } from "expo-router";
import { FinishedGameModal } from "../FinishedGameModal";

jest.mock("expo-router", () => ({
  router: {
    navigate: jest.fn(),
  },
}));

const mockQuitGame = jest.fn();
const mockNextLeg = jest.fn();

jest.mock("@/store/GameStore", () => ({
  useGameStore: () => ({
    quitGame: mockQuitGame,
    nextLeg: mockNextLeg,
  }),
}));

describe("FinishedGameModal Component", () => {
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

  it("handles 'Quit Game' button press correctly", async () => {
    const { getByText } = await render(<FinishedGameModal {...defaultProps} />);

    const quitButton = getByText("Quit Game");
    fireEvent.press(quitButton);

    expect(mockSetOpen).toHaveBeenCalledWith(false);
    expect(router.navigate).toHaveBeenCalledWith("/MainMenu");
    expect(mockQuitGame).toHaveBeenCalled();
  });

  it("handles 'Next Leg' button press correctly", async () => {
    const { getByText } = await render(<FinishedGameModal {...defaultProps} />);

    const nextButton = getByText("Next Leg");
    fireEvent.press(nextButton);

    expect(mockNextLeg).toHaveBeenCalledWith("Alice");
    expect(mockResetOrder).toHaveBeenCalled();
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
});
