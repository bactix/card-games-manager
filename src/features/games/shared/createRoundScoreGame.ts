import type { GameModule } from '../types';
import { RoundScoreScreen } from './RoundScoreScreen';
import {
  getResult,
  initialState,
  isFinished,
  reduce,
  type RoundScoreAction,
  type RoundScoreConfig,
  type RoundScoreState,
} from './roundScoreRules';

/**
 * Builds a game module for games scored round by round. Games with their own
 * flow skip this and write their own rules.ts and Screen.tsx.
 */
export function createRoundScoreGame(
  config: RoundScoreConfig,
): GameModule<RoundScoreState, RoundScoreAction> {
  return {
    id: config.id,
    name: config.name,
    teamBased: config.teamBased,
    minParticipants: config.minParticipants,
    maxParticipants: config.maxParticipants,
    initialState: (participants) => initialState(config, participants),
    reduce,
    isFinished,
    getResult,
    Screen: RoundScoreScreen,
  };
}
