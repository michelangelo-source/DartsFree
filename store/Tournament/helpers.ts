import { Player } from "../GameStore";
import { TournamentMatch } from "./TournamentStore";

export const shufflePlayers = (players: Player[]): Player[] => {
  const shuffled = [...players];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateBracket = (players: Player[]): TournamentMatch[] => {
  const allMatches: TournamentMatch[] = [];
  let matchIdCounter = 1;

  const totalPlayers = players.length;
  const bracketSize = Math.pow(2, Math.ceil(Math.log2(totalPlayers)));
  const firstRoundMatchCount = bracketSize / 2;
  const byesCount = bracketSize - totalPlayers;
  const realMatchesCount = firstRoundMatchCount - byesCount;

  let queue: TournamentMatch[] = [];
  let playerIndex = 0;

  for (let i = 0; i < firstRoundMatchCount; i++) {
    if (i < realMatchesCount) {
      const match: TournamentMatch = {
        id: matchIdCounter++,
        round: 1,
        player1: players[playerIndex++],
        player2: players[playerIndex++],
        winner: null,
        source_match_p1: null,
        source_match_p2: null,
        next_match_id: null,
      };
      allMatches.push(match);
      queue.push(match);
    } else {
      const match: TournamentMatch = {
        id: matchIdCounter++,
        round: 1,
        player1: players[playerIndex++],
        player2: null,
        winner: 1,
        source_match_p1: null,
        source_match_p2: null,
        next_match_id: null,
      };
      allMatches.push(match);
      queue.push(match);
    }
  }

  let currentRound = 2;
  while (queue.length > 1) {
    const nextQueue: TournamentMatch[] = [];

    for (let i = 0; i < queue.length; i += 2) {
      const match1 = queue[i];
      const match2 = queue[i + 1];

      const match: TournamentMatch = {
        id: matchIdCounter++,
        round: currentRound,
        player1: match1.winner === 1 ? match1.player1 : null,
        player2: match2.winner === 1 ? match2.player1 : null,
        winner: null,
        source_match_p1: match1.id,
        source_match_p2: match2.id,
        next_match_id: null,
      };

      match1.next_match_id = match.id;
      match2.next_match_id = match.id;

      allMatches.push(match);
      nextQueue.push(match);
    }

    queue = nextQueue;
    currentRound++;
  }

  return allMatches;
};
