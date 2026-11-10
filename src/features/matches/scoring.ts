import type { Match } from './types';

type Scored = Pick<Match, 'rules' | 'players' | 'rounds'>;

/** True when "reset score" is on and a player finished a round on exactly the reset score. */
export function resetsToZero(rules: Scored['rules'], total: number): boolean {
  return !!rules.resetScore && total === (rules.resetAt ?? 100);
}

/** The score a player starts the next round from: 0 if they finished the last round on the reset score. */
export function startOfNextRound(rules: Scored['rules'], total: number): number {
  return resetsToZero(rules, total) ? 0 : total;
}

/**
 * Running totals. With "reset score" on, a player who finishes a round on exactly the reset score
 * keeps that total on the board, then starts the next round from 0.
 */
export function totals(match: Scored): number[] {
  return match.players.map((_, p) =>
    match.rounds.reduce((sum, round) => startOfNextRound(match.rules, sum) + (round[p] ?? 0), 0),
  );
}

/** The game's own ending rule: someone reached the target, or the last round was played. */
export function reachedEnd(match: Scored): boolean {
  const { rules } = match;
  if (rules.endMode === 'rounds') return match.rounds.length >= rules.rounds;
  return totals(match).some((total) => total >= rules.targetScore);
}

/** Player indexes from best to worst under the game's winner rule (ties keep seating order). */
export function ranking(match: Scored): number[] {
  const sums = totals(match);
  const sign = match.rules.winner === 'most' ? -1 : 1;
  return sums
    .map((_, i) => i)
    .sort((a, b) => sign * (sums[a] - sums[b]) || a - b);
}

export function biggestRound(match: Scored): { value: number; playerIndex: number; round: number } | undefined {
  let best: { value: number; playerIndex: number; round: number } | undefined;
  match.rounds.forEach((round, r) =>
    round.forEach((value, p) => {
      if (!best || value > best.value) best = { value, playerIndex: p, round: r + 1 };
    }),
  );
  return best;
}

/** How far the match is from ending, for the progress bar. */
export function progress(match: Scored): { label: string; current: number; max: number } {
  if (match.rules.endMode === 'rounds') {
    return { label: 'Rounds played', current: match.rounds.length, max: match.rules.rounds };
  }
  return { label: 'Highest score', current: Math.max(0, ...totals(match)), max: match.rules.targetScore };
}
