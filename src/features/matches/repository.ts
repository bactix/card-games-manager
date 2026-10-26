import type { Repository } from '@/lib/repository';
import { localMatchesRepository } from './repository.local';
import type { Match } from './types';

// The only place that chooses the data source for this feature.
export const matchesRepository: Repository<Match> = localMatchesRepository;
