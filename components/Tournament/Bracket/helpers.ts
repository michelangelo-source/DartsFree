export const MATCH_HEIGHT = 60;
export const MATCH_HEIGHT_MARGIN = 16;
export const MATCH_WIDTH = 130;
export const MATCH_WIDTH_MARGIN = 30;
export const EXTRA_SCROLL_SPACE = 20;
export const MAP_PADDING = 50;

const getPreviousMatchesCount = (round: number, totalMatches: number) => {
  if (round <= 1) return 0;
  return totalMatches + 1 - (totalMatches + 1) / Math.pow(2, round - 1);
};

export const calculateTopStartingPosition = (round: number) => {
  if (round < 2) return 0;
  return (
    Math.pow(2, round - 2) * MATCH_HEIGHT +
    (Math.pow(2, round - 2) - 1) * MATCH_HEIGHT_MARGIN +
    MATCH_HEIGHT_MARGIN / 2 -
    MATCH_HEIGHT / 2
  );
};

export const calculateMatchSpacing = (
  round: number,
  index: number,
  totalMatches: number,
) => {
  if (round === 1) {
    return index * (MATCH_HEIGHT + MATCH_HEIGHT_MARGIN);
  }
  const prevMatches = getPreviousMatchesCount(round, totalMatches);
  return (
    MATCH_HEIGHT * Math.pow(2, round - 1) * (index - prevMatches) +
    MATCH_HEIGHT_MARGIN * Math.pow(2, round - 1) * (index - prevMatches)
  );
};
