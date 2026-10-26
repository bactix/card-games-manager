import { useLocalSearchParams } from 'expo-router';
import { GangPlayersScreen } from '@/features/gangs';

export default function GangRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <GangPlayersScreen gangId={id} />;
}
