import { useLocalSearchParams } from 'expo-router';
import { MatchScreen } from '@/features/matches';

export default function MatchRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <MatchScreen matchId={id} />;
}
