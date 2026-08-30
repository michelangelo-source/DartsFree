import { create } from "zustand";
import { Player } from "./GameStore";

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
  target: number;
  lastDartMultiplier: 1 | 2 | 3;
  isStarted: boolean;
  tournamentParticipants: Player[];
  tournamentMatches: TournamentMatch[];
};
type TournamentActions = {
  startTournament: () => void;
  setTournamentTarget: (target: number) => void;
  addTournamentParticipants: (player: Player) => void;
  deleteTournamentParticipants: (playerName: string) => void;
  randomizeTournament: () => void;
};
type Tournament = TournamentState & TournamentActions;

export const useTournamentStore = create<Tournament>()((set, get, store) => ({
  target: 501,
  lastDartMultiplier: 2,
  isStarted: false,
  tournamentParticipants: [],
  tournamentMatches: [],

  startTournament: () => set(() => ({ isStarted: true })),
  setTournamentTarget: (target: number) => set({ target }),
  deleteTournamentParticipants: (playerName: string) =>
    set((state) => ({
      tournamentParticipants: state.tournamentParticipants.filter(
        (p) => p.name !== playerName,
      ),
    })),
  addTournamentParticipants: (player: Player) => {
    set((state) => ({
      tournamentParticipants: [...state.tournamentParticipants, player],
    }));
  },
  //make it really random
  randomizeTournament: () => {
    const allMatches: TournamentMatch[] = [];
    let matchIdCounter = 1;
    const players = get().tournamentParticipants;
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
      tournamentMatches: allMatches,
    }));
  },
}));
