import { NameListScreen } from '@/components/NameListScreen';
import { useTeams } from '@/features/teams';
import { newId } from '@/lib/id';

export default function TeamsScreen() {
  const { items, add, remove } = useTeams();
  return (
    <NameListScreen
      items={items}
      placeholder="New team name"
      getLabel={(t) => t.name}
      onAdd={(name) => add({ id: newId(), name, playerIds: [] })}
      onRemove={remove}
    />
  );
}
