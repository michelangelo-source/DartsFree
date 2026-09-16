import { shuffleArray, buildTargetPool, pickRandomTargets } from "../helpers";
import { SINGLES, DOUBLES, TRIPLES } from "../constans";

describe("Training helpers", () => {
  describe("shuffleArray", () => {
    it("should return an array of the same length with same elements", () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(arr);
      expect(shuffled).toHaveLength(arr.length);
      expect(shuffled).toEqual(expect.arrayContaining(arr));
    });

    it("should not mutate the original array", () => {
      const arr = [1, 2, 3];
      const arrCopy = [...arr];
      shuffleArray(arr);
      expect(arr).toEqual(arrCopy);
    });
  });

  describe("buildTargetPool", () => {
    it("should build pool with singles if selected", () => {
      const settings = { singles: true, doubles: false, triples: false, totalThrows: 10 };
      const pool = buildTargetPool(settings);
      expect(pool).toEqual(SINGLES);
    });

    it("should build pool with doubles if selected", () => {
      const settings = { singles: false, doubles: true, triples: false, totalThrows: 10 };
      const pool = buildTargetPool(settings);
      expect(pool).toEqual(DOUBLES);
    });

    it("should build pool with triples if selected", () => {
      const settings = { singles: false, doubles: false, triples: true, totalThrows: 10 };
      const pool = buildTargetPool(settings);
      expect(pool).toEqual(TRIPLES);
    });

    it("should build pool with all selected targets", () => {
      const settings = { singles: true, doubles: true, triples: true, totalThrows: 10 };
      const pool = buildTargetPool(settings);
      expect(pool).toHaveLength(SINGLES.length + DOUBLES.length + TRIPLES.length);
      expect(pool).toEqual([...SINGLES, ...DOUBLES, ...TRIPLES]);
    });
  });

  describe("pickRandomTargets", () => {
    it("should return empty array if pool is empty", () => {
      expect(pickRandomTargets([], 10)).toEqual([]);
    });

    it("should return requested number of targets", () => {
      const pool = ["S-1", "D-1", "T-1"];
      const targets = pickRandomTargets(pool, 10);
      expect(targets).toHaveLength(10);
    });

    it("should repeat elements if count > pool length", () => {
      const pool = ["S-1"];
      const targets = pickRandomTargets(pool, 5);
      expect(targets).toEqual(["S-1", "S-1", "S-1", "S-1", "S-1"]);
    });

    it("should pick from the pool", () => {
      const pool = ["S-1", "D-1", "T-1"];
      const targets = pickRandomTargets(pool, 5);
      targets.forEach(target => {
        expect(pool).toContain(target);
      });
    });
  });
});
