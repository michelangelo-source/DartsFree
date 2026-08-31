import {
  calculateMatchSpacing,
  calculateTopStartingPosition,
} from "../helpers";

describe("Bracket Helpers", () => {
  describe("calculateTopStartingPosition", () => {
    it("returns 0 for round 1 (or less)", () => {
      expect(calculateTopStartingPosition(0)).toBe(0);
      expect(calculateTopStartingPosition(1)).toBe(0);
    });

    it("calculates correct starting position for round 2", () => {
      expect(calculateTopStartingPosition(2)).toBe(38);
    });

    it("calculates correct starting position for round 3", () => {
      expect(calculateTopStartingPosition(3)).toBe(114);
    });
  });

  describe("calculateMatchSpacing", () => {
    it("calculates correct spacing for round 1 (linear spacing)", () => {
      const totalMatches = 7;

      expect(calculateMatchSpacing(1, 0, totalMatches)).toBe(0);

      expect(calculateMatchSpacing(1, 1, totalMatches)).toBe(76);

      expect(calculateMatchSpacing(1, 2, totalMatches)).toBe(152);
    });

    it("calculates correct spacing for round 2", () => {
      const totalMatches = 7;
      const round = 2;

      expect(calculateMatchSpacing(round, 4, totalMatches)).toBe(0);

      expect(calculateMatchSpacing(round, 5, totalMatches)).toBe(152);
    });

    it("calculates correct spacing for round 3", () => {
      const totalMatches = 7;
      const round = 3;

      expect(calculateMatchSpacing(round, 6, totalMatches)).toBe(0);
    });
  });
});
