import { createLocalRepository } from '@/lib/createLocalRepository';
import type { Repository } from '@/lib/repository';
import { SEED_GAMES, SEED_VERSION } from './seed';
import type { Game } from './types';

const base = createLocalRepository<Game>('cgm:games:v2', SEED_GAMES);
const seeds = new Map(SEED_GAMES.map((g) => [g.id, g]));

/** Built-in games saved with older default rules get the current ones; order and your own games are kept. */
async function list(): Promise<Game[]> {
  const stored = await base.list();
  let changed = false;
  const upgraded = stored.map((game) => {
    const seed = seeds.get(game.id);
    if (!seed || (game.seedVersion ?? 0) >= SEED_VERSION) return game;
    changed = true;
    return { ...game, rules: seed.rules, seedVersion: SEED_VERSION };
  });
  // Built-in games added in a later version are appended to a list that was saved before they existed.
  for (const seed of SEED_GAMES) {
    if (!upgraded.some((game) => game.id === seed.id)) {
      upgraded.push(seed);
      changed = true;
    }
  }
  if (changed) await base.replaceAll(upgraded);
  return upgraded;
}

export const localGamesRepository: Repository<Game> = { ...base, list };
