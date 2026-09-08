import { Player, useGameStore } from "../GameStore";
describe("GameStore", () => {
  const initialState = useGameStore.getState();

  beforeEach(() => {
    useGameStore.setState(initialState, true);
  });

  const player1: Player = {
    name: "Alice",
    wins: 0,
    score: 100,
    dartsThrown: 3,
    history: [{ firstThrow: 20, secondThrow: 20, thirdThrow: 60 }],
  };

  const player2: Player = {
    name: "Bob",
    wins: 2,
    score: 140,
    dartsThrown: 6,
    history: [
      { firstThrow: 20, secondThrow: 20, thirdThrow: 20 },
      { firstThrow: 60, secondThrow: 20, thirdThrow: "MISS" },
    ],
  };

  it("correct initial state", () => {
    const state = useGameStore.getState();
    expect(state.target).toBe(501);
    expect(state.legsToWin).toBe(1);
    expect(state.lastDartMultiplier).toBe(2);
    expect(state.players).toEqual([]);
  });

  it("setTarget", () => {
    useGameStore.getState().setTarget(301);
    expect(useGameStore.getState().target).toBe(301);
  });

  it("setLegsToWin", () => {
    useGameStore.getState().setLegsToWin(3);
    expect(useGameStore.getState().legsToWin).toBe(3);
  });

  it("setLastDartMultiplier", () => {
    useGameStore.getState().setLastDartMultiplier(1);
    expect(useGameStore.getState().lastDartMultiplier).toBe(1);
  });

  it("addPlayer", () => {
    useGameStore.getState().addPlayer(player1);
    const { players } = useGameStore.getState();

    expect(players).toHaveLength(1);
    expect(players[0]).toEqual(player1);
  });

  it("deletePlayer", () => {
    const store = useGameStore.getState();
    store.addPlayer(player1);
    store.addPlayer(player2);

    useGameStore.getState().deletePlayer("Alice");

    const { players } = useGameStore.getState();
    expect(players).toHaveLength(1);
    expect(players[0].name).toBe("Bob");
  });

  it("updatePlayer", () => {
    const store = useGameStore.getState();
    store.addPlayer(player1);

    const updatedPlayer: Player = { ...player1, score: 300, dartsThrown: 6 };
    useGameStore.getState().updatePlayer(updatedPlayer);

    const { players } = useGameStore.getState();
    expect(players[0].score).toBe(300);
    expect(players[0].dartsThrown).toBe(6);
  });

  describe("nextLeg", () => {
    useGameStore.setState(initialState, true);
    beforeEach(() => {
      const store = useGameStore.getState();
      store.addPlayer(player1);
      store.addPlayer(player2);
    });

    it("cleaning history and score for everyone", () => {
      useGameStore.getState().nextLeg("Alice");

      const { players } = useGameStore.getState();
      players.forEach((player) => {
        expect(player.score).toBe(0);
        expect(player.dartsThrown).toBe(0);
        expect(player.history).toEqual([]);
      });
    });

    it("wins increment", () => {
      useGameStore.getState().nextLeg("Alice");

      const { players } = useGameStore.getState();
      const alice = players.find((p) => p.name === "Alice");
      const bob = players.find((p) => p.name === "Bob");
      expect(alice?.wins).toBe(1);
      expect(bob?.wins).toBe(2);
    });

    it("changing player order", () => {
      useGameStore.getState().nextLeg("Alice");

      const { players } = useGameStore.getState();
      expect(players[0].name).toBe("Bob");
      expect(players[1].name).toBe("Alice");
    });
  });

  it("quitGame", () => {
    const store = useGameStore.getState();
    store.addPlayer(player1);
    store.setTarget(701);
    store.setLegsToWin(5);

    expect(useGameStore.getState().players).toHaveLength(1);
    expect(useGameStore.getState().target).toBe(701);
    expect(useGameStore.getState().legsToWin).toBe(5);

    useGameStore.getState().quitGame();

    const stateAfterQuit = useGameStore.getState();
    expect(stateAfterQuit.players).toEqual([]);
    expect(stateAfterQuit.target).toBe(501);
    expect(stateAfterQuit.legsToWin).toBe(1);
  });
});
