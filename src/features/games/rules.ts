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
    a.maxPerPlayer === b.maxPerPlayer &&
    a.resetScore === b.resetScore &&
    a.resetAt === b.resetAt &&
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
  const maxEach =
    (r.maxPerPlayer ?? 0) > 0 ? ` Each player scores at most ${r.maxPerPlayer} points in a round.` : '';
  const penalty = r.penalties?.length
    ? ` In every round one player takes ${r.penalties.map((p) => (p < 0 ? `−${-p}` : p)).join(' or ')} and everyone else scores above 0.`
    : '';
  const bids = r.bids?.length
    ? ` Every round starts with each player locking in a bid (${r.bids.join(', ')}). If they make it the bid is added to their score, if not it is taken off.`
    : '';
  const reset = r.resetScore ? ` A player who finishes a round on exactly ${r.resetAt ?? 100} starts the next round from 0.` : '';
  return `${r.playerLimit} players. ${ending}${perRound}${maxEach}${penalty}${bids}${reset} ${winnerText(r)} points wins.`;
}

/** Short caption under a game tile, e.g. "First to 41" or "5 rounds". */
export function shortTarget(r: GameRules): string {
  if (r.endMode === 'rounds') return `${r.rounds} ${r.rounds === 1 ? 'round' : 'rounds'}`;
  return r.winner === 'least' ? `Up to ${r.targetScore}` : `First to ${r.targetScore}`;
}
