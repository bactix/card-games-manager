import { useRepositoryList } from '@/lib/useRepositoryList';
import { gamesRepository } from './repository';

export const useGames = () => useRepositoryList(gamesRepository);
