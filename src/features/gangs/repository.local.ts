import { createLocalRepository } from '@/lib/createLocalRepository';
import type { Gang } from './types';

export const localGangsRepository = createLocalRepository<Gang>('cgm:gangs');
