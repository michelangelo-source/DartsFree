import { shuffleArray, buildTargetPool } from "../helpers";
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
});
