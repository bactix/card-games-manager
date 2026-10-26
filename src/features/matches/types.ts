import type { Participant } from '@/features/games';

export interface Match {
  id: string;
  gameTypeId: string;
  gangId?: string;
  participants: Participant[];
  /** Owned by the game module; stored as plain JSON. */
  state: unknown;
  status: 'active' | 'finished';
  winnerId?: string;
  /** True when the user ended the match before the game's own ending rule. */
  endedEarly?: boolean;
  createdAt: string; // ISO date
}
