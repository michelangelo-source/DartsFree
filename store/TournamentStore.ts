import { create } from "zustand";
import { Player, useGameStore } from "./GameStore";

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

export const useTournamentStore = create<Tournament>()((set, get, store) => ({
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
    const allMatches: TournamentMatch[] = [];
    let matchIdCounter = 1;

    const players = [...get().tournamentParticipants];
    for (let i = players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [players[i], players[j]] = [players[j], players[i]];
    }

    const N = players.length;
    const P = Math.pow(2, Math.ceil(Math.log2(N)));
    const r1MatchesCount = P / 2;
    const byes = P - N;
    const realMatchesCount = r1MatchesCount - byes;

    let queue: TournamentMatch[] = [];
    let playerIndex = 0;

    for (let i = 0; i < r1MatchesCount; i++) {
      if (i < realMatchesCount) {
        const match: TournamentMatch = {
          id: matchIdCounter++,
          round: 1,
          player1: players[playerIndex++],
          player2: players[playerIndex++],
          winner: null,
          source_match_p1: null,
          source_match_p2: null,
          next_match_id: null,
        };
        allMatches.push(match);
        queue.push(match);
      } else {
        const match: TournamentMatch = {
          id: matchIdCounter++,
          round: 1,
          player1: players[playerIndex++],
          player2: null,
          winner: 1,
          source_match_p1: null,
          source_match_p2: null,
          next_match_id: null,
        };
        allMatches.push(match);
        queue.push(match);
      }
    }

    let currentRound = 2;

    while (queue.length > 1) {
      const nextQueue: TournamentMatch[] = [];

      for (let i = 0; i < queue.length; i += 2) {
        const match1 = queue[i];
        const match2 = queue[i + 1];

        const match: TournamentMatch = {
          id: matchIdCounter++,
          round: currentRound,
          player1: match1.winner === 1 ? match1.player1 : null,
          player2: match2.winner === 1 ? match2.player1 : null,
          winner: null,
          source_match_p1: match1.id,
          source_match_p2: match2.id,
          next_match_id: null,
        };

        match1.next_match_id = match.id;
        match2.next_match_id = match.id;

        allMatches.push(match);
        nextQueue.push(match);
      }

      queue = nextQueue;
      currentRound++;
    }

    set(() => ({
      readyToStart: true,
      tournamentMatches: allMatches,
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
