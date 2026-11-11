import type { Game } from './types';

/**
 * Bump this whenever the default rules below change. Phones that saved an older copy of a built-in
 * game (for example after reordering the tiles) get the new default rules the next time the app opens.
 */
export const SEED_VERSION = 12;

/** Games available on first launch. They are ordinary games: edit them or add more. */
export const SEED_GAMES: Game[] = [
  {
    id: 'likha',
    name: 'Likha',
    symbol: 'heart',
    color: '#8E1B2E',
    seedVersion: SEED_VERSION,
    rules: {
      endMode: 'score',
      targetScore: 101,
      rounds: 5,
      playerLimit: 4,
      playersFixed: true,
      roundTotal: 36,
      takeAllBonus: true,
      badMoveTakesAll: true,
      resetScore: false,
      resetAt: 100,
      winner: 'least',
      scoreCards: [
        { id: 'hearts', suit: 'heart', rank: '', points: 1, maxPerRound: 13 },
        { id: 'ten-of-diamonds', suit: 'diamond', rank: '10', points: 10, maxPerRound: 1 },
        { id: 'queen-of-spades', suit: 'spade', rank: 'Q', points: 13, maxPerRound: 1 },
      ],
    },
  },
  {
    id: 'tarneeb',
    name: 'Tarneeb',
    symbol: 'spade',
    color: '#0E5A4A',
    seedVersion: SEED_VERSION,
    rules: { endMode: 'score', targetScore: 41, rounds: 5, playerLimit: 4, roundTotal: 0, winner: 'most' },
  },
  {
    id: 'hand',
    name: 'Hand',
    symbol: 'club',
    color: '#2F2A7A',
    seedVersion: SEED_VERSION,
    rules: {
      endMode: 'rounds',
      targetScore: 100,
      rounds: 9,
      playerLimit: 4,
      roundTotal: 0,
      maxPerPlayer: 200,
      penalties: [-30, -60],
      winner: 'least',
      // each positive player picks 100, 200 or types their own number (up to maxPerPlayer)
      scoreCards: [
        { id: 'hundred', suit: 'club', rank: '100', points: 100, maxPerRound: 10, setsScore: true },
        { id: 'two-hundred', suit: 'club', rank: '200', points: 200, maxPerRound: 10, setsScore: true },
      ],
    },
  },
  {
    id: '400',
    name: '400',
    symbol: 'diamond',
    color: '#B45309',
    seedVersion: SEED_VERSION,
    rules: {
      endMode: 'score',
      targetScore: 400,
      rounds: 5,
      playerLimit: 4,
      roundTotal: 0,
      winner: 'most',
      bids: [2, 3, 4, 10, 12, 14, 16, 18, 20, 22, 24, 26],
    },
  },
];
