// Public API of the games feature. Other features import only from here.
export { getGame, listGames } from './registry';
export type { GameModule, GameResult, GameScreenProps, Participant } from './types';
