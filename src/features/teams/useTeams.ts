import { useRepositoryList } from '@/lib/useRepositoryList';
import { teamsRepository } from './repository';

export const useTeams = () => useRepositoryList(teamsRepository);
