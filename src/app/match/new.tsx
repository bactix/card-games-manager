import { useLocalSearchParams } from 'expo-router';
import { NewMatchScreen } from '@/features/matches';

export default function NewMatchRoute() {
  const { gameId } = useLocalSearchParams<{ gameId?: string }>();
  return <NewMatchScreen initialGameId={gameId} />;
}
