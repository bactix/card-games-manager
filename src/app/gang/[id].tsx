import { useLocalSearchParams } from 'expo-router';
import { GangDetailScreen } from '@/features/gangs';

export default function GangRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <GangDetailScreen gangId={id} />;
}
