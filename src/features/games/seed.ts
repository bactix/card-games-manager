import type { Game } from './types';

/** Games available on first launch. They are ordinary games: edit them or add more. */
export const SEED_GAMES: Game[] = [
  {
    id: 'likha',
    name: 'Likha',
    symbol: 'heart',
    color: '#8E1B2E',
    rules: { endMode: 'score', targetScore: 100, rounds: 5, playerLimit: 4, roundTotal: 36, winner: 'least' },
  },
  {
    id: 'tarneeb',
    name: 'Tarneeb',
    symbol: 'spade',
    color: '#0E5A4A',
    rules: { endMode: 'score', targetScore: 41, rounds: 5, playerLimit: 4, roundTotal: 0, winner: 'most' },
  },
  {
    id: 'hand',
    name: 'Hand',
    symbol: 'club',
    color: '#2F2A7A',
    rules: { endMode: 'rounds', targetScore: 100, rounds: 9, playerLimit: 3, roundTotal: 0, winner: 'most' },
  },
];
