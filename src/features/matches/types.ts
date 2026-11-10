import type { GameRules } from '@/features/games';

export interface MatchPlayer {
  id: string;
  name: string;
  color: string;
}

/** One game being played. It keeps its own copy of the rules, so later edits to the game don't change it. */
export interface Match {
  id: string;
  gameId: string;
  gameName: string;
  rules: GameRules;
  players: MatchPlayer[];
  /** rounds[r][p] = points player p scored in round r (same order as `players`). */
  rounds: number[][];
  status: 'active' | 'finished';
  /** Games with bids: the bids locked in for the round being played (same order as `players`). */
  bids?: number[];
  /** True when the user ended the match before the game's own ending rule. */
  endedEarly?: boolean;
  createdAt: string; // ISO date
}
