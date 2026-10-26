import { useRepositoryList } from '@/lib/useRepositoryList';
import { matchesRepository } from './repository';

export const useMatches = () => useRepositoryList(matchesRepository);
