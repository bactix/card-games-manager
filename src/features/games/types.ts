import type { ComponentType } from 'react';

export interface Participant {
  id: string;
  name: string;
}

export interface GameResult {
  winnerId?: string;
  scores: Record<string, number>;
}

export interface GameScreenProps<State, Action> {
  state: State;
  dispatch: (action: Action) => void;
  /** True once the match is finished: show the result, accept no more input. */
  readOnly: boolean;
}

/**
 * Everything the app needs to know about one card game. Each game keeps its
 * own State and Action shapes; the match feature stores the state as plain JSON.
 */
export interface GameModule<State = unknown, Action = unknown> {
  id: string;
  name: string;
  teamBased: boolean;
  minParticipants: number;
  maxParticipants?: number;
  initialState(participants: Participant[]): State;
  reduce(state: State, action: Action): State;
  isFinished(state: State): boolean;
  getResult(state: State): GameResult;
  Screen: ComponentType<GameScreenProps<State, Action>>;
}
