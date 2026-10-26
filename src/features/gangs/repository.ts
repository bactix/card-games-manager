import type { Repository } from '@/lib/repository';
import { localGangsRepository } from './repository.local';
import type { Gang } from './types';

// The only place that chooses the data source for this feature.
export const gangsRepository: Repository<Gang> = localGangsRepository;
