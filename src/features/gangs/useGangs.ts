import { useRepositoryList } from '@/lib/useRepositoryList';
import { gangsRepository } from './repository';

export const useGangs = () => useRepositoryList(gangsRepository);
