import { create } from "zustand";
import { Player, useGameStore } from "../GameStore";
import { generateBracket, shufflePlayers } from "./helpers";

export type TournamentMatch = {
  id: number;
  round: number;
  player1: Player | null;
  player2: Player | null;
  winner: 1 | 2 | null;
  source_match_p1: number | null;
  source_match_p2: number | null;
  next_match_id: number | null;
};

type TournamentState = {
  readyToStart: boolean;
  target: number;
  lastDartMultiplier: 1 | 2 | 3;
  isStarted: boolean;
  tournamentParticipants: Player[];
  tournamentMatches: TournamentMatch[];
  currentMatch: TournamentMatch | null;
};

type TournamentActions = {
  setCurrentMatch: (match: TournamentMatch) => void;
  setWinner: (winner: 1 | 2) => void;
  startTournament: () => void;
  setTournamentTarget: (target: number) => void;
  addTournamentParticipants: (player: Player) => void;
  deleteTournamentParticipants: (playerName: string) => void;
  randomizeTournament: () => void;
  startMatch: (match?: TournamentMatch) => void;
};

type Tournament = TournamentState & TournamentActions;

export const useTournamentStore = create<Tournament>()((set, get) => ({
  readyToStart: false,
  target: 501,
  lastDartMultiplier: 2,
  isStarted: false,
  tournamentParticipants: [],
  tournamentMatches: [],
  currentMatch: null,

  setCurrentMatch: (match: TournamentMatch) =>
    set(() => ({ currentMatch: match })),

  setWinner: (winner: 1 | 2) => {
    set((state) => {
      const { currentMatch, tournamentMatches } = state;
      if (!currentMatch) return state;

      const winningPlayer =
        winner === 1 ? currentMatch.player1 : currentMatch.player2;

      const newMatches = tournamentMatches.map((match) => {
        if (match.id === currentMatch.id) {
          return { ...match, winner };
        }

        if (match.id === currentMatch.next_match_id) {
          if (match.source_match_p1 === currentMatch.id) {
            return { ...match, player1: winningPlayer };
          } else if (match.source_match_p2 === currentMatch.id) {
            return { ...match, player2: winningPlayer };
          }
        }

        return match;
      });
      return {
        tournamentMatches: newMatches,
      };
    });
  },

  startTournament: () => set(() => ({ isStarted: true })),
  setTournamentTarget: (target: number) => set({ target }),

  deleteTournamentParticipants: (playerName: string) =>
    set((state) => ({
      readyToStart: false,
      tournamentParticipants: state.tournamentParticipants.filter(
        (p) => p.name !== playerName,
      ),
    })),

  addTournamentParticipants: (player: Player) => {
    set((state) => ({
      readyToStart: false,
      tournamentParticipants: [...state.tournamentParticipants, player],
    }));
  },

  randomizeTournament: () => {
    const players = get().tournamentParticipants;
    const shuffledPlayers = shufflePlayers(players);
    const tournamentMatches = generateBracket(shuffledPlayers);

    set(() => ({
      readyToStart: true,
      tournamentMatches,
    }));
  },

  startMatch: (match?: TournamentMatch) => {
    const state = get();

    const matchToStart =
      match ||
      state.tournamentMatches.find((m) => m.player1 && m.player2 && !m.winner);

    if (matchToStart) {
      const gameStore = useGameStore.getState();

      gameStore.quitGame();
      gameStore.setTarget(state.target);

      if (matchToStart.player1) gameStore.addPlayer(matchToStart.player1);
      if (matchToStart.player2) gameStore.addPlayer(matchToStart.player2);

      set({
        currentMatch: matchToStart,
        isStarted: true,
      });
    }
  },
}));
