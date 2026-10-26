export type GameSymbolName = 'spade' | 'heart' | 'diamond' | 'club';
export type EndMode = 'score' | 'rounds';
export type WinnerRule = 'most' | 'least';

/** How a game is played: when it ends and who wins. */
export interface GameRules {
  endMode: EndMode;
  /** Used when endMode is 'score': the game ends as soon as a player reaches it. */
  targetScore: number;
  /** Used when endMode is 'rounds': the game ends after this many rounds. */
  rounds: number;
  playerLimit: number;
  /** Points every round must add up to across all players. 0 means no limit. */
  roundTotal: number;
  winner: WinnerRule;
}

/** A card game with its default rules. The rules can still be changed for a single match. */
export interface Game {
  id: string;
  name: string;
  symbol: GameSymbolName;
  color: string;
  rules: GameRules;
}
