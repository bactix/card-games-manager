import type { GameResult, Participant } from '../types';

export const HEARTS_PER_ROUND = 13;
export const QUEEN_OF_SPADES_POINTS = 13;
export const TEN_OF_DIAMONDS_POINTS = 10;
export const LOSING_SCORE = 100;

/** What each player collected in one round (the deck is split between the 4 players). */
export interface LikhaRound {
  hearts: Record<string, number>;
  queenOfSpadesPlayerId: string;
  tenOfDiamondsPlayerId: string;
}

export interface LikhaState {
  participants: Participant[];
  rounds: LikhaRound[];
}

export type LikhaAction = { type: 'addRound'; round: LikhaRound } | { type: 'undoRound' };

export function roundPoints(round: LikhaRound, participants: Participant[]): Record<string, number> {
  const points: Record<string, number> = {};
  for (const p of participants) {
    points[p.id] =
      (round.hearts[p.id] ?? 0) +
      (round.queenOfSpadesPlayerId === p.id ? QUEEN_OF_SPADES_POINTS : 0) +
      (round.tenOfDiamondsPlayerId === p.id ? TEN_OF_DIAMONDS_POINTS : 0);
  }
  return points;
}

/** True when one player took every point of the round: all 13 hearts, Q♠ and 10♦. */
export function tookAllPoints(round: LikhaRound, participants: Participant[]): boolean {
  return participants.some(
    (p) =>
      round.hearts[p.id] === HEARTS_PER_ROUND &&
      round.queenOfSpadesPlayerId === p.id &&
      round.tenOfDiamondsPlayerId === p.id,
  );
}

export function totals(state: LikhaState): Record<string, number> {
  const result: Record<string, number> = {};
  for (const p of state.participants) result[p.id] = 0;
  for (const round of state.rounds) {
    const points = roundPoints(round, state.participants);
    for (const p of state.participants) result[p.id] += points[p.id];
  }
  return result;
}

/** Returns an error message, or undefined when the round is valid. */
export function validateRound(
  round: Partial<LikhaRound> & { hearts: Record<string, number> },
  participants: Participant[],
): string | undefined {
  const hearts = participants.reduce((sum, p) => sum + (round.hearts[p.id] ?? 0), 0);
  if (hearts !== HEARTS_PER_ROUND) return `Hearts must add up to ${HEARTS_PER_ROUND} (now ${hearts}).`;
  if (!round.queenOfSpadesPlayerId) return 'Choose who took the queen of spades.';
  if (!round.tenOfDiamondsPlayerId) return 'Choose who took the 10 of diamonds.';
  return undefined;
}

export function initialState(participants: Participant[]): LikhaState {
  return { participants, rounds: [] };
}

export function reduce(state: LikhaState, action: LikhaAction): LikhaState {
  switch (action.type) {
    case 'addRound':
      return { ...state, rounds: [...state.rounds, action.round] };
    case 'undoRound':
      return { ...state, rounds: state.rounds.slice(0, -1) };
  }
}

/** The match ends as soon as any player reaches 100. */
export function isFinished(state: LikhaState): boolean {
  return Object.values(totals(state)).some((total) => total >= LOSING_SCORE);
}

/** The player with the fewest points wins. */
export function getResult(state: LikhaState): GameResult {
  const scores = totals(state);
  let winnerId: string | undefined;
  for (const p of state.participants) {
    if (winnerId === undefined || scores[p.id] < scores[winnerId]) winnerId = p.id;
  }
  return { winnerId, scores };
}

/** The player with the most points once the match is over. */
export function getLoserId(state: LikhaState): string | undefined {
  const scores = totals(state);
  let loserId: string | undefined;
  for (const p of state.participants) {
    if (loserId === undefined || scores[p.id] > scores[loserId]) loserId = p.id;
  }
  return loserId;
}
