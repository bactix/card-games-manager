import type { GameResult, Participant } from '../types';

export interface RoundScoreConfig {
  id: string;
  name: string;
  teamBased: boolean;
  minParticipants: number;
  maxParticipants?: number;
  /** The match ends automatically when someone reaches this total. */
  targetScore?: number;
  lowestWins?: boolean;
}

export interface RoundScoreState {
  participants: Participant[];
  rounds: Record<string, number>[];
  finished: boolean;
  targetScore?: number;
  lowestWins: boolean;
}

export type RoundScoreAction =
  | { type: 'addRound'; scores: Record<string, number> }
  | { type: 'undoRound' }
  | { type: 'finish' };

export function initialState(config: RoundScoreConfig, participants: Participant[]): RoundScoreState {
  return {
    participants,
    rounds: [],
    finished: false,
    targetScore: config.targetScore,
    lowestWins: config.lowestWins ?? false,
  };
}

export function totals(state: RoundScoreState): Record<string, number> {
  const result: Record<string, number> = {};
  for (const p of state.participants) {
    result[p.id] = state.rounds.reduce((sum, round) => sum + (round[p.id] ?? 0), 0);
  }
  return result;
}

export function reduce(state: RoundScoreState, action: RoundScoreAction): RoundScoreState {
  switch (action.type) {
    case 'addRound':
      return { ...state, rounds: [...state.rounds, action.scores] };
    case 'undoRound':
      return { ...state, rounds: state.rounds.slice(0, -1) };
    case 'finish':
      return { ...state, finished: true };
  }
}

export function isFinished(state: RoundScoreState): boolean {
  if (state.finished) return true;
  if (state.targetScore === undefined) return false;
  const target = state.targetScore;
  return Object.values(totals(state)).some((total) => total >= target);
}

export function getResult(state: RoundScoreState): GameResult {
  const scores = totals(state);
  let winnerId: string | undefined;
  for (const p of state.participants) {
    if (winnerId === undefined) {
      winnerId = p.id;
      continue;
    }
    const better = state.lowestWins ? scores[p.id] < scores[winnerId] : scores[p.id] > scores[winnerId];
    if (better) winnerId = p.id;
  }
  return { winnerId, scores };
}
