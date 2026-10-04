import { act } from "@testing-library/react-native";
import { DEFAULT_SETTINGS } from "../constans";
import { useRandomStore } from "../RandomThrowsStore";

describe("RandomThrowsStore", () => {
  beforeEach(async () => {
    await act(async () => {
      useRandomStore.getState().reset();
    });
  });

  it("should initialize with default state", async () => {
    const state = useRandomStore.getState();
    expect(state.settings).toEqual(DEFAULT_SETTINGS);
    expect(state.playing).toBe(false);
    expect(state.pool).toEqual([]);
    expect(state.remainingPool).toEqual([]);
    expect(state.currentTarget).toBe("");
    expect(state.result).toBeNull();
    expect(state.gameId).toBe(0);
  });

  it("should update settings", async () => {
    const newSettings = {
      singles: false,
      doubles: true,
      triples: true,
      totalThrows: 30,
    };
    await act(async () => {
      useRandomStore.getState().updateSettings(newSettings);
    });

    expect(useRandomStore.getState().settings).toEqual(newSettings);
  });

  it("should start a game and generate targets", async () => {
    const initialGameId = useRandomStore.getState().gameId;

    await act(async () => {
      useRandomStore.getState().start();
    });

    const state = useRandomStore.getState();
    expect(state.playing).toBe(true);
    expect(state.result).toBeNull();
    expect(state.pool.length).toBeGreaterThan(0);
    expect(state.currentTarget).not.toBe("");
    expect(state.gameId).toBe(initialGameId + 1);
  });

  it("should have remainingPool length independent of totalThrows and repopulate correctly", async () => {
    const totalThrows = 100;

    await act(async () => {
      useRandomStore.getState().updateSettings({
        singles: true,
        doubles: false,
        triples: false,
        totalThrows,
      });
      useRandomStore.getState().start();
    });

    let state = useRandomStore.getState();
    const expectedPoolLength = 21;

    expect(state.pool).toHaveLength(expectedPoolLength);
    expect(state.remainingPool).toHaveLength(expectedPoolLength - 1);

    expect(state.remainingPool.length).not.toEqual(totalThrows);

    await act(async () => {
      for (let i = 0; i < 20; i++) {
        useRandomStore.getState().nextTarget();
      }
    });

    state = useRandomStore.getState();
    expect(state.remainingPool).toHaveLength(0);

    await act(async () => {
      useRandomStore.getState().nextTarget();
    });

    state = useRandomStore.getState();
    expect(state.remainingPool).toHaveLength(expectedPoolLength - 1);
  });

  it("should start a game with empty pool if no target types are selected", async () => {
    await act(async () => {
      useRandomStore.getState().updateSettings({
        singles: false,
        doubles: false,
        triples: false,
        totalThrows: 10,
      });
      useRandomStore.getState().start();
    });

    const state = useRandomStore.getState();
    expect(state.pool).toEqual([]);
    expect(state.currentTarget).toBe("");
    expect(state.playing).toBe(true);
  });

  it("should finish the game and calculate correct result string", async () => {
    await act(async () => {
      useRandomStore.getState().start();
      useRandomStore.getState().finish(15, 20); // 15 hits out of 20 total throws
    });

    const state = useRandomStore.getState();
    expect(state.result).toBe("15/20 (75%)");
    expect(state.playing).toBe(true);
  });

  it("should handle division by zero safely when total is 0", async () => {
    await act(async () => {
      useRandomStore.getState().finish(0, 0);
    });

    const state = useRandomStore.getState();
    expect(state.result).toBe("0/0 (0%)");
  });

  it("should reset the state to initial values", async () => {
    await act(async () => {
      useRandomStore.getState().start();
      useRandomStore.getState().finish(5, 5);
      useRandomStore.getState().reset();
    });

    const state = useRandomStore.getState();
    expect(state.playing).toBe(false);
    expect(state.result).toBeNull();
    expect(state.pool).toEqual([]);
    expect(state.currentTarget).toBe("");
    expect(state.gameId).toBe(0);
  });
});
