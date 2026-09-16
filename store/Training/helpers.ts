import { DOUBLES, SINGLES, TRIPLES } from "./constans";
import { RandomSettings } from "./RandomThrowsStore";

export const shuffleArray = <T>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const buildTargetPool = (settings: RandomSettings): string[] => {
  const pool: string[] = [];
  if (settings.singles) pool.push(...SINGLES);
  if (settings.doubles) pool.push(...DOUBLES);
  if (settings.triples) pool.push(...TRIPLES);
  return pool;
};

export const pickRandomTargets = (pool: string[], count: number): string[] => {
  if (pool.length === 0) return [];
  const targets: string[] = [];
  while (targets.length < count) {
    const shuffled = shuffleArray(pool);
    targets.push(...shuffled);
  }
  return targets.slice(0, count);
};
