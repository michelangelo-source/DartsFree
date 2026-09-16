import { create } from "zustand";
import { DEFAULT_SETTINGS } from "./constans";
import { buildTargetPool, pickRandomTargets } from "./helpers";

export type RandomSettings = {
  singles: boolean;
  doubles: boolean;
  triples: boolean;
  totalThrows: number;
};

type RandomState = {
  settings: RandomSettings;
  playing: boolean;
  targets: string[];
  result: string | null;
  gameId: number;
};

type RandomActions = {
  updateSettings: (settings: RandomSettings) => void;
  start: () => void;
  finish: (hits: number, total: number) => void;
  reset: () => void;
};

type RandomStore = RandomState & RandomActions;

export const useRandomStore = create<RandomStore>()((set, get, store) => ({
  settings: DEFAULT_SETTINGS,
  playing: false,
  targets: [],
  result: null,
  gameId: 0,

  updateSettings: (settings) => set({ settings }),

  start: () => {
    const { settings, gameId } = get();
    const pool = buildTargetPool(settings);
    const targets = pickRandomTargets(pool, settings.totalThrows);
    set({ targets, playing: true, result: null, gameId: gameId + 1 });
  },

  finish: (hits, total) => {
    const pct = total > 0 ? Math.round((hits / total) * 100) : 0;
    set({ result: `${hits}/${total} (${pct}%)` });
  },

  reset: () => {
    set(store.getInitialState());
  },
}));
