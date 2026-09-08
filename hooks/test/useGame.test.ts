import { useGameStore } from "@/store/GameStore";
import { useTournamentStore } from "@/store/Tournament/TournamentStore";
import { act, renderHook } from "@testing-library/react-native";
import { useGame } from "../useGame";

jest.mock("@/store/GameStore", () => ({
  useGameStore: jest.fn(),
}));

jest.mock("@/store/Tournament/TournamentStore", () => ({
  useTournamentStore: jest.fn(),
}));

describe("useGame Hook", () => {
  let mockUpdatePlayer: jest.Mock;
  let mockSetWinner: jest.Mock;

  const mockPlayers = [
    { name: "Player 1", score: 0, dartsThrown: 0, history: [] },
    { name: "Player 2", score: 0, dartsThrown: 0, history: [] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdatePlayer = jest.fn();
    mockSetWinner = jest.fn();

    (useGameStore as unknown as jest.Mock).mockReturnValue({
      target: 501,
      legsToWin: 1,
      lastDartMultiplier: 2,
      players: mockPlayers,
      updatePlayer: mockUpdatePlayer,
    });

    (useTournamentStore as unknown as jest.Mock).mockReturnValue({
      isStarted: false,
      setWinner: mockSetWinner,
    });
  });

  it("should correctly initialize state", async () => {
    const { result } = await renderHook(() => useGame());

    expect(result.current.target).toBe(501);
    expect(result.current.currentPlayer.name).toBe("Player 1");
    expect(result.current.currentPlayerIndex).toBe(0);
    expect(result.current.bust).toBe(false);
    expect(result.current.finished).toBe(false);
    expect(result.current.currentThrows).toEqual({
      firstThrow: null,
      secondThrow: null,
      thirdThrow: null,
    });
  });

  it("addScore should add points and update throws", async () => {
    const { result } = await renderHook(() => useGame());

    await act(() => {
      result.current.addScore(20, 3);
    });

    expect(mockUpdatePlayer).toHaveBeenCalledWith(
      expect.objectContaining({
        score: 60,
        dartsThrown: 1,
      }),
    );
    expect(result.current.currentThrows.firstThrow).toBe(60);
  });

  it("addScore should set bust = true if the player exceeds the target", async () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      target: 501,
      legsToWin: 1,
      lastDartMultiplier: 2,
      players: [
        { id: "1", name: "Player 1", score: 490, dartsThrown: 3, history: [] },
      ],
      updatePlayer: mockUpdatePlayer,
    });

    const { result } = await renderHook(() => useGame());

    await act(() => {
      result.current.addScore(20, 1);
    });

    expect(result.current.bust).toBe(true);
  });

  it("addScore should set finished = true if the player perfectly hits the target in Casual Mode", async () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      target: 50,
      legsToWin: 1,
      lastDartMultiplier: 2,
      players: [
        { id: "1", name: "Player 1", score: 10, dartsThrown: 3, history: [] },
      ],
      updatePlayer: mockUpdatePlayer,
    });

    const { result } = await renderHook(() => useGame());

    await act(() => {
      result.current.addScore(20, 2);
    });

    expect(result.current.finished).toBe(true);
    expect(mockUpdatePlayer).toHaveBeenCalledWith(
      expect.objectContaining({
        score: 50,
      }),
    );
    expect(mockSetWinner).not.toHaveBeenCalled();
  });

  it("addScore should set finished = true and call setWinner if the player perfectly hits the target in Tournament Mode", async () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      target: 50,
      legsToWin: 1,
      lastDartMultiplier: 2,
      players: [
        { id: "1", name: "Player 1", score: 10, wins: 0, dartsThrown: 3, history: [] },
      ],
      updatePlayer: mockUpdatePlayer,
    });

    (useTournamentStore as unknown as jest.Mock).mockReturnValue({
      isStarted: true,
      setWinner: mockSetWinner,
    });

    const { result } = await renderHook(() => useGame());

    await act(() => {
      result.current.addScore(20, 2);
    });

    expect(result.current.finished).toBe(true);
    expect(mockUpdatePlayer).toHaveBeenCalledWith(
      expect.objectContaining({
        score: 50,
      }),
    );
    expect(mockSetWinner).toHaveBeenCalledWith(1);
  });

  it("addScore should set finished = true but NOT call setWinner if the player has not reached legsToWin in Tournament Mode", async () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      target: 50,
      legsToWin: 2,
      lastDartMultiplier: 2,
      players: [
        { id: "1", name: "Player 1", score: 10, wins: 0, dartsThrown: 3, history: [] },
      ],
      updatePlayer: mockUpdatePlayer,
    });

    (useTournamentStore as unknown as jest.Mock).mockReturnValue({
      isStarted: true,
      setWinner: mockSetWinner,
    });

    const { result } = await renderHook(() => useGame());

    await act(() => {
      result.current.addScore(20, 2);
    });

    expect(result.current.finished).toBe(true);
    expect(mockSetWinner).not.toHaveBeenCalled();
  });

  it("classicScore should set 26 points (1, 5, 20) and 3 throws", async () => {
    const { result } = await renderHook(() => useGame());

    await act(() => {
      result.current.classicScore();
    });

    expect(mockUpdatePlayer).toHaveBeenCalledWith(
      expect.objectContaining({
        score: 26,
        dartsThrown: 3,
      }),
    );
    expect(result.current.currentThrows).toEqual({
      firstThrow: 1,
      secondThrow: 5,
      thirdThrow: 20,
    });
  });

  it("classicScore should not add score if remaining score is 26 or less", async () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      target: 501,
      legsToWin: 1,
      lastDartMultiplier: 2,
      players: [
        { id: "1", name: "Player 1", score: 480, dartsThrown: 0, history: [] },
      ],
      updatePlayer: mockUpdatePlayer,
    });

    const { result } = await renderHook(() => useGame());

    await act(() => {
      result.current.classicScore();
    });

    expect(mockUpdatePlayer).not.toHaveBeenCalled();
    expect(result.current.currentThrows).toEqual({
      firstThrow: null,
      secondThrow: null,
      thirdThrow: null,
    });
  });

  it("nextPlayer should change currentPlayerIndex to the next player", async () => {
    const { result } = await renderHook(() => useGame());

    await act(() => {
      result.current.nextPlayer();
    });

    expect(result.current.currentPlayerIndex).toBe(1);
    expect(result.current.currentThrows).toEqual({
      firstThrow: null,
      secondThrow: null,
      thirdThrow: null,
    });
  });

  it("undoLastThrow should undo the last throw", async () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      target: 501,
      legsToWin: 1,
      lastDartMultiplier: 2,
      players: [
        { id: "1", name: "Player 1", score: 20, dartsThrown: 1, history: [] },
      ],
      updatePlayer: mockUpdatePlayer,
    });

    const { result } = await renderHook(() => useGame());

    await act(async () => {
      result.current.addScore(20, 1);
    });

    await act(async () => {
      result.current.undoLastThrow();
    });

    expect(mockUpdatePlayer).toHaveBeenCalledWith(
      expect.objectContaining({
        score: 0,
        dartsThrown: 0,
      }),
    );
    expect(result.current.currentThrows.firstThrow).toBeNull();
  });

  it("addScore should correctly handle 'MISS' throw", async () => {
    const { result } = await renderHook(() => useGame());

    await act(() => {
      result.current.addScore("MISS", 1);
    });

    expect(mockUpdatePlayer).toHaveBeenCalledWith(
      expect.objectContaining({
        score: 0,
        dartsThrown: 1,
      }),
    );
    expect(result.current.currentThrows.firstThrow).toBe("MISS");
  });

  it("addScore should not add score if the turn is over (third throw exists)", async () => {
    const { result } = await renderHook(() => useGame());

    await act(() => {
      result.current.addScore(20, 1);
      result.current.addScore(20, 1);
      result.current.addScore(20, 1);
    });

    mockUpdatePlayer.mockClear();

    await act(() => {
      result.current.addScore(20, 1);
    });

    expect(mockUpdatePlayer).not.toHaveBeenCalled();
    expect(result.current.isTurnOver).toBe(true);
  });

  it("nextPlayer should save bust state in player history", async () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      target: 501,
      legsToWin: 1,
      lastDartMultiplier: 2,
      players: [
        { id: "1", name: "Player 1", score: 490, dartsThrown: 0, history: [] },
        { id: "2", name: "Player 2", score: 0, dartsThrown: 0, history: [] },
      ],
      updatePlayer: mockUpdatePlayer,
    });
    const { result } = await renderHook(() => useGame());

    await act(() => {
      result.current.addScore(20, 1);
    });

    await act(() => {
      result.current.nextPlayer();
    });

    expect(result.current.bust).toBe(false);
    expect(mockUpdatePlayer).toHaveBeenCalledWith(
      expect.objectContaining({
        history: expect.arrayContaining([
          expect.objectContaining({ isBust: true }),
        ]),
      }),
    );
  });

  it("nextPlayer should fill unthrown darts with 'MISS' and increment dartsThrown", async () => {
    const { result, rerender } = await renderHook(() => useGame());

    await act(() => {
      result.current.addScore(20, 1);
    });

    (useGameStore as unknown as jest.Mock).mockReturnValue({
      target: 501,
      legsToWin: 1,
      lastDartMultiplier: 2,
      players: [
        { name: "Player 1", score: 20, dartsThrown: 1, history: [] },
        { name: "Player 2", score: 0, dartsThrown: 0, history: [] },
      ],
      updatePlayer: mockUpdatePlayer,
    });

    await rerender(undefined);

    await act(() => {
      result.current.nextPlayer();
    });

    expect(mockUpdatePlayer).toHaveBeenCalledWith(
      expect.objectContaining({
        dartsThrown: 3,
        history: expect.arrayContaining([
          { firstThrow: 20, secondThrow: "MISS", thirdThrow: "MISS" },
        ]),
      }),
    );
  });

  it("undoLastThrow should revert to previous player if current throws are empty", async () => {
    const historyMock = [
      { firstThrow: 20, secondThrow: null, thirdThrow: null, isBust: false },
    ];

    (useGameStore as unknown as jest.Mock).mockReturnValue({
      target: 501,
      legsToWin: 1,
      lastDartMultiplier: 2,
      players: [
        {
          id: "1",
          name: "Player 1",
          score: 20,
          dartsThrown: 1,
          history: historyMock,
        },
        { id: "2", name: "Player 2", score: 0, dartsThrown: 0, history: [] },
      ],
      updatePlayer: mockUpdatePlayer,
    });
    const { result } = await renderHook(() => useGame());

    await act(() => {
      result.current.setCurrentPlayerIndex(1);
    });

    await act(() => {
      result.current.undoLastThrow();
    });

    expect(result.current.currentPlayerIndex).toBe(0);
    expect(result.current.currentThrows).toEqual(historyMock[0]);
  });

  it("undoLastThrow should correctly revert bust state", async () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      target: 501,
      legsToWin: 1,
      lastDartMultiplier: 2,
      players: [
        { id: "1", name: "Player 1", score: 490, dartsThrown: 0, history: [] },
      ],
      updatePlayer: mockUpdatePlayer,
    });

    const { result } = await renderHook(() => useGame());

    await act(() => {
      result.current.addScore(5, 1);
    });

    await act(() => {
      result.current.addScore(20, 1);
    });

    expect(result.current.bust).toBe(true);

    await act(() => {
      result.current.undoLastThrow();
    });

    expect(result.current.bust).toBe(false);
    expect(result.current.currentThrows.firstThrow).toBe(5);
    expect(result.current.currentThrows.secondThrow).toBeNull();
  });
});
