import type { GameRules } from './types';

export const DEFAULT_RULES: GameRules = {
  endMode: 'score',
  targetScore: 100,
  rounds: 5,
  playerLimit: 4,
  roundTotal: 0,
  winner: 'most',
};

export function rulesEqual(a: GameRules, b: GameRules): boolean {
  return (
    a.endMode === b.endMode &&
    a.targetScore === b.targetScore &&
    a.rounds === b.rounds &&
    a.playerLimit === b.playerLimit &&
    a.roundTotal === b.roundTotal &&
    a.winner === b.winner
  );
}

const winnerText = (r: GameRules) => (r.winner === 'most' ? 'Most' : 'Least');

/** Full sentence shown while editing rules. */
export function describeRules(r: GameRules): string {
  const ending =
    r.endMode === 'score'
      ? `Unlimited rounds. The game ends as soon as someone reaches ${r.targetScore} points.`
      : `Exactly ${r.rounds} ${r.rounds === 1 ? 'round' : 'rounds'}. The game ends after the last round.`;
  const perRound = r.roundTotal > 0 ? ` Every round adds up to ${r.roundTotal} points.` : '';
  return `${r.playerLimit} players. ${ending}${perRound} ${winnerText(r)} points wins.`;
}

/** Short caption under a game tile, e.g. "First to 41" or "5 rounds". */
export function shortTarget(r: GameRules): string {
  if (r.endMode === 'rounds') return `${r.rounds} ${r.rounds === 1 ? 'round' : 'rounds'}`;
  return r.winner === 'least' ? `Up to ${r.targetScore}` : `First to ${r.targetScore}`;
}
