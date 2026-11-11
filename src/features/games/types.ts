export type GameSymbolName = 'spade' | 'heart' | 'diamond' | 'club';
export type EndMode = 'score' | 'rounds';
export type WinnerRule = 'most' | 'least';

/** A card that is worth points when a player takes it in a round, shown as a tappable card button. */
export interface ScoreCard {
  id: string;
  suit: GameSymbolName;
  /** Printed on the card, e.g. "10" or "Q". Empty for a plain suit card such as any heart. */
  rank: string;
  /** Points added to the player's round score each time the card is taken. */
  points: number;
  /** How many of this card exist in one round (13 hearts, a single queen of spades). */
  maxPerRound: number;
  /**
   * When true, tapping the card sets the player's whole round score to `points` (instead of adding to it),
   * replacing any other such card or typed number. Several players can pick the same card.
   */
  setsScore?: boolean;
}

/** How a game is played: when it ends and who wins. */
export interface GameRules {
  endMode: EndMode;
  /** Used when endMode is 'score': the game ends as soon as a player reaches it. */
  targetScore: number;
  /** Used when endMode is 'rounds': the game ends after this many rounds. */
  rounds: number;
  playerLimit: number;
  /** True when the game is always played with exactly `playerLimit` players, so it can't be changed. */
  playersFixed?: boolean;
  /**
   * Optional "reset score" rule, only offered by games that define it. When on, a player whose
   * total is exactly `resetAt` at the end of a round starts the next round from 0.
   */
  resetScore?: boolean;
  resetAt?: number;
  /**
   * Optional bonus, only offered by games that define it. When on, a player who takes every point of a
   * round (all of `roundTotal`) gets 1 extra point, so the round counts as roundTotal + 1.
   */
  takeAllBonus?: boolean;
  /** A bad move is taking every point of a round (all of `roundTotal`). The bad move sound plays when it happens. */
  badMoveTakesAll?: boolean;
  /** Points every round adds up to across all players, shared out between them. 0 means no limit. */
  roundTotal: number;
  /** Most points any one player can score in a single round (not combined). 0 or unset means no maximum. */
  maxPerPlayer?: number;
  winner: WinnerRule;
  /** When set, a round is entered by giving these cards to players instead of typing points. */
  scoreCards?: ScoreCard[];
  /**
   * When set, every round exactly one player takes one of these penalties (negative numbers, such as
   * -30 or -60) and every other player scores more than 0.
   */
  penalties?: number[];
  /**
   * When set, every round starts with each player locking in one of these bids. When the round ends the
   * bid counts for them (+) if they made it, or against them (−) if they didn't. Bids can't be edited.
   */
  bids?: number[];
}

/** A card game with its default rules. The rules can still be changed for a single match. */
export interface Game {
  id: string;
  name: string;
  symbol: GameSymbolName;
  color: string;
  rules: GameRules;
  /** Which version of the built-in defaults this game's rules come from (built-in games only). */
  seedVersion?: number;
}
