import { likha } from './likha';
import type { GameModule } from './types';

// To add a game: create its folder, then register it here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const games: GameModule<any, any>[] = [likha];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const listGames = (): GameModule<any, any>[] => games;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getGame = (id: string): GameModule<any, any> | undefined =>
  games.find((g) => g.id === id);
