// Public API of the games feature. Other features import only from here.
export { CreateGameScreen } from './components/CreateGameScreen';
export { GameTile } from './components/GameTile';
export { RulesEditor } from './components/RulesEditor';
export { describeRules, rulesEqual, shortTarget } from './rules';
export type { EndMode, Game, GameRules, GameSymbolName, WinnerRule } from './types';
export { useGames } from './useGames';
