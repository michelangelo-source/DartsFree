import { act } from "@testing-library/react-native";
import { DEFAULT_SETTINGS } from "../constans";
import { useRandomStore } from "../RandomThrowsStore";

describe("RandomThrowsStore", () => {
  beforeEach(() => {
    act(() => {
      useRandomStore.getState().reset();
    });
  });

  it("should initialize with default state", () => {
    const state = useRandomStore.getState();
    expect(state.settings).toEqual(DEFAULT_SETTINGS);
    expect(state.playing).toBe(false);
    expect(state.targets).toEqual([]);
    expect(state.result).toBeNull();
    expect(state.gameId).toBe(0);
  });

  it("should update settings", () => {
    const newSettings = {
      singles: false,
      doubles: true,
      triples: true,
      totalThrows: 30,
    };
    act(() => {
      useRandomStore.getState().updateSettings(newSettings);
    });

    expect(useRandomStore.getState().settings).toEqual(newSettings);
  });

  it("should start a game and generate targets", () => {
    const initialGameId = useRandomStore.getState().gameId;
    
    act(() => {
      useRandomStore.getState().start();
    });

    const state = useRandomStore.getState();
    expect(state.playing).toBe(true);
    expect(state.result).toBeNull();
    expect(state.targets).toHaveLength(DEFAULT_SETTINGS.totalThrows);
    expect(state.gameId).toBe(initialGameId + 1);
  });

  it("should start a game with empty pool if no target types are selected", () => {
    act(() => {
      useRandomStore.getState().updateSettings({
        singles: false,
        doubles: false,
        triples: false,
        totalThrows: 10,
      });
      useRandomStore.getState().start();
    });

    const state = useRandomStore.getState();
    expect(state.targets).toEqual([]);
    expect(state.playing).toBe(true);
  });

  it("should finish the game and calculate correct result string", () => {
    act(() => {
      useRandomStore.getState().start();
      useRandomStore.getState().finish(15, 20); // 15 hits out of 20 total throws
    });

    const state = useRandomStore.getState();
    expect(state.result).toBe("15/20 (75%)");
    expect(state.playing).toBe(true);
  });

  it("should handle division by zero safely when total is 0", () => {
    act(() => {
      useRandomStore.getState().finish(0, 0);
    });

    const state = useRandomStore.getState();
    expect(state.result).toBe("0/0 (0%)");
  });

  it("should reset the state to initial values", () => {
    act(() => {
      useRandomStore.getState().start();
      useRandomStore.getState().finish(5, 5);
      useRandomStore.getState().reset();
    });

    const state = useRandomStore.getState();
    expect(state.playing).toBe(false);
    expect(state.result).toBeNull();
    expect(state.targets).toEqual([]);
    expect(state.gameId).toBe(0);
  });
});
