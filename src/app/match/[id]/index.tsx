import { useLocalSearchParams } from 'expo-router';
import { ScoreboardScreen } from '@/features/matches';

export default function ScoreboardRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ScoreboardScreen matchId={id} />;
}
