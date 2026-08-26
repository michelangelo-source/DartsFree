import { create } from "zustand";

export type SingleScore = number | null | "MISS";

export type VisitScore = {
  firstThrow: SingleScore;
  secondThrow: SingleScore;
  thirdThrow: SingleScore;
  isBust?: boolean;
};

export type Player = {
  wins: number;
  name: string;
  score: number;
  dartsThrown: number;
  history: VisitScore[];
};

type GameState = {
  target: number;
  lastDartMultiplier: 1 | 2 | 3;
  players: Player[];
};

type GameActions = {
  setTarget: (target: number) => void;
  addPlayer: (player: Player) => void;
  deletePlayer: (playerName: string) => void;
  updatePlayer: (player: Player) => void;
  nextLeg: (winnerName: string) => void;
  quitGame: () => void;
};

type Game = GameState & GameActions;

export const useGameStore = create<Game>()((set, get, store) => ({
  target: 501,
  players: [],
  lastDartMultiplier: 2,
  setTarget: (target: number) => set({ target }),
  addPlayer: (player: Player) =>
    set((state) => ({ players: [...state.players, player] })),
  deletePlayer: (playerName: string) =>
    set((state) => ({
      players: state.players.filter((p) => p.name !== playerName),
    })),
  updatePlayer: (player: Player) =>
    set((state) => ({
      players: state.players.map((p) => (p.name === player.name ? player : p)),
    })),

  nextLeg: (winnerName: string) => {
    const resetPlayers = get().players.map((player) => ({
      ...player,
      history: [],
      score: 0,
      dartsThrown: 0,
      wins: player.name === winnerName ? player.wins + 1 : player.wins,
    }));
    const firstPlayer = resetPlayers.shift();
    if (!firstPlayer) return;
    resetPlayers.push(firstPlayer);
    set({
      players: resetPlayers,
    });
  },
  quitGame: () => {
    set(store.getInitialState());
  },
}));
