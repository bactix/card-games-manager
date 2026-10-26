import type { Repository } from '@/lib/repository';
import { localTeamsRepository } from './repository.local';
import type { Team } from './types';

// The only place that chooses the data source for this feature.
export const teamsRepository: Repository<Team> = localTeamsRepository;
