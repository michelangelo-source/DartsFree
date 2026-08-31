import { Player } from "@/store/GameStore";
import { generateBracket, shufflePlayers } from "../helpers";

describe("Tournament Helpers", () => {
  const createMockPlayer = (name: string): Player => ({
    name,
    score: 0,
    wins: 0,
    dartsThrown: 0,
    history: [],
  });

  describe("shufflePlayers", () => {
    it("should return an array of the same length with the same players", () => {
      const players = [
        createMockPlayer("A"),
        createMockPlayer("B"),
        createMockPlayer("C"),
      ];
      const shuffled = shufflePlayers(players);

      expect(shuffled).toHaveLength(3);
      expect(shuffled).toEqual(expect.arrayContaining(players));
    });

    it("should not mutate the original array", () => {
      const players = [createMockPlayer("A"), createMockPlayer("B")];
      const playersCopy = [...players];

      shufflePlayers(players);

      expect(players).toEqual(playersCopy);
    });
  });

  describe("generateBracket", () => {
    it("should generate a 1-match bracket for 2 players", () => {
      const players = [createMockPlayer("A"), createMockPlayer("B")];
      const matches = generateBracket(players);

      expect(matches).toHaveLength(1);
      expect(matches[0].player1?.name).toBe("A");
      expect(matches[0].player2?.name).toBe("B");
      expect(matches[0].winner).toBeNull();
      expect(matches[0].round).toBe(1);
    });

    it("should handle 4 players symmetrically (3 matches total)", () => {
      const players = ["A", "B", "C", "D"].map(createMockPlayer);
      const matches = generateBracket(players);

      expect(matches).toHaveLength(3);

      expect(matches[0].round).toBe(1);
      expect(matches[0].player1?.name).toBe("A");
      expect(matches[0].player2?.name).toBe("B");

      expect(matches[1].round).toBe(1);
      expect(matches[1].player1?.name).toBe("C");
      expect(matches[1].player2?.name).toBe("D");

      expect(matches[2].round).toBe(2);
      expect(matches[2].player1).toBeNull();
      expect(matches[2].player2).toBeNull();
      expect(matches[2].source_match_p1).toBe(matches[0].id);
      expect(matches[2].source_match_p2).toBe(matches[1].id);
    });

    it("should handle 3 players using 'byes' (3 matches total)", () => {
      const players = ["A", "B", "C"].map(createMockPlayer);
      const matches = generateBracket(players);

      expect(matches).toHaveLength(3);

      expect(matches[0].round).toBe(1);
      expect(matches[0].player1?.name).toBe("A");
      expect(matches[0].player2?.name).toBe("B");
      expect(matches[0].winner).toBeNull();

      expect(matches[1].round).toBe(1);
      expect(matches[1].player1?.name).toBe("C");
      expect(matches[1].player2).toBeNull();
      expect(matches[1].winner).toBe(1);

      expect(matches[2].round).toBe(2);
      expect(matches[2].source_match_p1).toBe(matches[0].id);
      expect(matches[2].source_match_p2).toBe(matches[1].id);

      expect(matches[2].player2?.name).toBe("C");
      expect(matches[2].player1).toBeNull();
    });

    it("should handle 5 players (7 matches total)", () => {
      const players = ["A", "B", "C", "D", "E"].map(createMockPlayer);
      const matches = generateBracket(players);

      expect(matches).toHaveLength(7);

      expect(matches[0].player2?.name).toBe("B");
      expect(matches[0].winner).toBeNull();

      expect(matches[1].player2).toBeNull();
      expect(matches[1].winner).toBe(1);

      expect(matches[2].player2).toBeNull();
      expect(matches[2].winner).toBe(1);

      expect(matches[3].player2).toBeNull();
      expect(matches[3].winner).toBe(1);

      expect(matches[6].round).toBe(3);
    });
  });
});
