import { useLocalSearchParams } from 'expo-router';
import { AddRoundScreen } from '@/features/matches';

export default function AddRoundRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <AddRoundScreen matchId={id} />;
}
