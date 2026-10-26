import { createLocalRepository } from '@/lib/createLocalRepository';
import { SEED_GAMES } from './seed';
import type { Game } from './types';

export const localGamesRepository = createLocalRepository<Game>('cgm:games:v2', SEED_GAMES);
