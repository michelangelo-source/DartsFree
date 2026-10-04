import { create } from "zustand";
import { DEFAULT_SETTINGS } from "./constans";
import { buildTargetPool, shuffleArray } from "./helpers";

export type RandomSettings = {
  singles: boolean;
  doubles: boolean;
  triples: boolean;
  totalThrows: number;
};

type RandomState = {
  settings: RandomSettings;
  playing: boolean;
  pool: string[];
  remainingPool: string[];
  currentTarget: string;
  result: string | null;
  gameId: number;
};

type RandomActions = {
  updateSettings: (settings: RandomSettings) => void;
  start: () => void;
  nextTarget: () => void;
  finish: (hits: number, total: number) => void;
  reset: () => void;
};

type RandomStore = RandomState & RandomActions;

export const useRandomStore = create<RandomStore>()((set, get, store) => ({
  settings: DEFAULT_SETTINGS,
  playing: false,
  pool: [],
  remainingPool: [],
  currentTarget: "",
  result: null,
  gameId: 0,

  updateSettings: (settings) => set({ settings }),

  start: () => {
    const { settings, gameId } = get();
    const pool = buildTargetPool(settings);
    const remainingPool = shuffleArray(pool);
    
    const currentTarget = remainingPool.pop() || "";
    set({ pool, remainingPool, currentTarget, playing: true, result: null, gameId: gameId + 1 });
  },

  nextTarget: () => {
    const { pool, remainingPool } = get();
    let nextRemaining = [...remainingPool];
    if (nextRemaining.length === 0) {
      nextRemaining = shuffleArray(pool);
    }
    const currentTarget = nextRemaining.pop() || "";
    set({ remainingPool: nextRemaining, currentTarget });
  },

  finish: (hits, total) => {
    const pct = total > 0 ? Math.round((hits / total) * 100) : 0;
    set({ result: `${hits}/${total} (${pct}%)` });
  },

  reset: () => {
    set(store.getInitialState());
  },
}));
