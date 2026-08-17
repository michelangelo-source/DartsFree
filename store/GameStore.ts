import { create } from "zustand";

export type SingleScore = number | null;

export type VisitScore = {
  firstThrow: SingleScore;
  secondThrow: SingleScore;
  thirdThrow: SingleScore;
};

export type Player = {
  name: string;
  score: number;
  avg: number;
  dartsThrown: number;
  history: VisitScore[];
};

type GameState = {
  target: number;
  lastDartMultiplier: 1 | 2;
  players: Player[];
};

type GameActions = {
  setTarget: (target: number) => void;
  addPlayer: (player: Player) => void;
  deletePlayer: (playerName: string) => void;
  updatePlayer: (player: Player) => void;
};

type Game = GameState & GameActions;

export const useGameStore = create<Game>()((set) => ({
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
}));
