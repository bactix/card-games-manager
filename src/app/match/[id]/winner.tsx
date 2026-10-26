import { useLocalSearchParams } from 'expo-router';
import { WinnerScreen } from '@/features/matches';

export default function WinnerRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <WinnerScreen matchId={id} />;
}
