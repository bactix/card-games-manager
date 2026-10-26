import type { Repository } from '@/lib/repository';
import { localGamesRepository } from './repository.local';
import type { Game } from './types';

// The only place that chooses the data source for this feature.
export const gamesRepository: Repository<Game> = localGamesRepository;
