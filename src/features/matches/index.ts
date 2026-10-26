// Public API of the matches feature. Other features import only from here.
export { AddRoundScreen } from './components/AddRoundScreen';
export { HistoryScreen } from './components/HistoryScreen';
export { HomeScreen } from './components/HomeScreen';
export { NewMatchScreen } from './components/NewMatchScreen';
export { ScoreboardScreen } from './components/ScoreboardScreen';
export { WinnerScreen } from './components/WinnerScreen';
export type { Match, MatchPlayer } from './types';
export { useMatches } from './useMatches';
