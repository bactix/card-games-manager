import { createLocalRepository } from '@/lib/createLocalRepository';
import type { Match } from './types';

export const localMatchesRepository = createLocalRepository<Match>('cgm:matches:v2');
