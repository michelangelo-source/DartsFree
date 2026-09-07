import { useGameStore } from "@/store/GameStore";
import { act } from "@testing-library/react-native";
import * as helpers from "../helpers";
import { TournamentMatch, useTournamentStore } from "../TournamentStore";

jest.mock("@/store/GameStore", () => ({
  useGameStore: {
    getState: jest.fn(),
  },
}));

jest.mock("../helpers", () => ({
  shufflePlayers: jest.fn((players) => players),
  generateBracket: jest.fn(),
}));

describe("TournamentStore", () => {
  const initialTournamentState = useTournamentStore.getState();

  const mockPlayer1 = {
    name: "Alice",
    score: 0,
    wins: 0,
    dartsThrown: 0,
    history: [],
  };
  const mockPlayer2 = {
    name: "Bob",
    score: 0,
    wins: 0,
    dartsThrown: 0,
    history: [],
  };
  const mockPlayer3 = {
    name: "Charlie",
    score: 0,
    wins: 0,
    dartsThrown: 0,
    history: [],
  };
  const mockPlayer4 = {
    name: "Dave",
    score: 0,
    wins: 0,
    dartsThrown: 0,
    history: [],
  };

  const mockQuitGame = jest.fn();
  const mockSetTarget = jest.fn();
  const mockAddPlayer = jest.fn();

  beforeEach(() => {
    useTournamentStore.setState(initialTournamentState, true);
    jest.clearAllMocks();

    (useGameStore.getState as jest.Mock).mockReturnValue({
      quitGame: mockQuitGame,
      setTarget: mockSetTarget,
      addPlayer: mockAddPlayer,
    });
  });

  it("should initialize with correct default state", () => {
    const state = useTournamentStore.getState();

    expect(state.readyToStart).toBe(false);
    expect(state.target).toBe(501);
    expect(state.isStarted).toBe(false);
    expect(state.tournamentParticipants).toEqual([]);
    expect(state.tournamentMatches).toEqual([]);
    expect(state.currentMatch).toBeNull();
  });

  it("setTournamentTarget should update the target", () => {
    act(() => {
      useTournamentStore.getState().setTournamentTarget(301);
    });

    expect(useTournamentStore.getState().target).toBe(301);
  });

  it("resetTournament should reset state to initial state", () => {
    act(() => {
      useTournamentStore.getState().setTournamentTarget(301);
      useTournamentStore.getState().addTournamentParticipants(mockPlayer1);
    });

    act(() => {
      useTournamentStore.getState().resetTournament();
    });

    const state = useTournamentStore.getState();
    expect(state.readyToStart).toBe(false);
    expect(state.target).toBe(501);
    expect(state.isStarted).toBe(false);
    expect(state.tournamentParticipants).toEqual([]);
    expect(state.tournamentMatches).toEqual([]);
    expect(state.currentMatch).toBeNull();
  });

  it("addTournamentParticipants should add a player and set readyToStart to false", () => {
    act(() => {
      useTournamentStore.getState().addTournamentParticipants(mockPlayer1);
    });

    const state = useTournamentStore.getState();
    expect(state.tournamentParticipants).toHaveLength(1);
    expect(state.tournamentParticipants[0].name).toBe("Alice");
    expect(state.readyToStart).toBe(false);
  });

  it("deleteTournamentParticipants should remove a player by name and set readyToStart to false", () => {
    useTournamentStore.setState({
      tournamentParticipants: [mockPlayer1, mockPlayer2],
      readyToStart: true,
    });

    act(() => {
      useTournamentStore.getState().deleteTournamentParticipants("Alice");
    });

    const state = useTournamentStore.getState();
    expect(state.tournamentParticipants).toHaveLength(1);
    expect(state.tournamentParticipants[0].name).toBe("Bob");
    expect(state.readyToStart).toBe(false);
  });

  it("randomizeTournament should shuffle players, generate bracket and set readyToStart to true", () => {
    const mockMatches: TournamentMatch[] = [
      {
        id: 1,
        round: 1,
        player1: mockPlayer1,
        player2: mockPlayer2,
        winner: null,
        source_match_p1: null,
        source_match_p2: null,
        next_match_id: null,
      },
    ];

    (helpers.generateBracket as jest.Mock).mockReturnValue(mockMatches);

    useTournamentStore.setState({
      tournamentParticipants: [mockPlayer1, mockPlayer2],
    });

    act(() => {
      useTournamentStore.getState().randomizeTournament();
    });

    const state = useTournamentStore.getState();
    expect(helpers.shufflePlayers).toHaveBeenCalledWith([
      mockPlayer1,
      mockPlayer2,
    ]);
    expect(helpers.generateBracket).toHaveBeenCalled();
    expect(state.readyToStart).toBe(true);
    expect(state.tournamentMatches).toEqual(mockMatches);
  });

  it("startMatch should set currentMatch, isStarted and configure GameStore", () => {
    const mockMatch: TournamentMatch = {
      id: 1,
      round: 1,
      player1: mockPlayer1,
      player2: mockPlayer2,
      winner: null,
      source_match_p1: null,
      source_match_p2: null,
      next_match_id: null,
    };

    useTournamentStore.setState({ target: 701 });

    act(() => {
      useTournamentStore.getState().startMatch(mockMatch);
    });

    const state = useTournamentStore.getState();

    expect(state.currentMatch).toEqual(mockMatch);
    expect(state.isStarted).toBe(true);

    expect(mockQuitGame).toHaveBeenCalled();
    expect(mockSetTarget).toHaveBeenCalledWith(701);
    expect(mockAddPlayer).toHaveBeenCalledWith(mockPlayer1);
    expect(mockAddPlayer).toHaveBeenCalledWith(mockPlayer2);
  });

  it("startMatch should auto-find the next available match if no match is provided", () => {
    const match1: TournamentMatch = {
      id: 1,
      round: 1,
      player1: mockPlayer1,
      player2: mockPlayer2,
      winner: 1,
      source_match_p1: null,
      source_match_p2: null,
      next_match_id: null,
    };
    const match2: TournamentMatch = {
      id: 2,
      round: 1,
      player1: mockPlayer3,
      player2: mockPlayer4,
      winner: null,
      source_match_p1: null,
      source_match_p2: null,
      next_match_id: null,
    };

    useTournamentStore.setState({ tournamentMatches: [match1, match2] });

    act(() => {
      useTournamentStore.getState().startMatch();
    });

    expect(useTournamentStore.getState().currentMatch).toEqual(match2);
  });

  it("setWinner should update the current match winner and propagate the winning player to the next match", () => {
    const match1: TournamentMatch = {
      id: 1,
      round: 1,
      player1: mockPlayer1,
      player2: mockPlayer2,
      winner: null,
      source_match_p1: null,
      source_match_p2: null,
      next_match_id: 3,
    };
    const match2: TournamentMatch = {
      id: 2,
      round: 1,
      player1: mockPlayer3,
      player2: mockPlayer4,
      winner: null,
      source_match_p1: null,
      source_match_p2: null,
      next_match_id: 3,
    };
    const match3: TournamentMatch = {
      id: 3,
      round: 2,
      player1: null,
      player2: null,
      winner: null,
      source_match_p1: 1,
      source_match_p2: 2,
      next_match_id: null,
    };

    useTournamentStore.setState({
      tournamentMatches: [match1, match2, match3],
      currentMatch: match1,
    });

    act(() => {
      useTournamentStore.getState().setWinner(1);
    });

    const matches = useTournamentStore.getState().tournamentMatches;

    expect(matches[0].winner).toBe(1);

    expect(matches[2].player1).toEqual(mockPlayer1);
    expect(matches[2].player2).toBeNull();
  });
});
