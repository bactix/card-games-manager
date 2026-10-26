import type { GameModule } from '../types';
import { LikhaScreen } from './Screen';
import {
  getResult,
  initialState,
  isFinished,
  reduce,
  type LikhaAction,
  type LikhaState,
} from './rules';

export const likha: GameModule<LikhaState, LikhaAction> = {
  id: 'likha',
  name: 'Likha',
  teamBased: false,
  minParticipants: 4,
  maxParticipants: 4,
  initialState,
  reduce,
  isFinished,
  getResult,
  Screen: LikhaScreen,
};
