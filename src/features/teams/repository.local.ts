import { createLocalRepository } from '@/lib/createLocalRepository';
import type { Team } from './types';

export const localTeamsRepository = createLocalRepository<Team>('cgm:teams');
