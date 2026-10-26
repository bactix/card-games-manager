import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { NameListScreen } from '@/components/NameListScreen';
import { useGangs } from '@/features/gangs';
import { newId } from '@/lib/id';

export default function GangsScreen() {
  const { items, add, remove } = useGangs();

  const addGang = async (name: string) => {
    const id = newId();
    await add({ id, name, players: [] });
    router.push(`/gang/${id}`); // go straight to adding its players
  };

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>Create a gang, then tap it to add its players. Saved on this phone.</Text>
      <NameListScreen
        items={items}
        placeholder="New gang name"
        getLabel={(g) => g.name}
        getSubtitle={(g) =>
          g.players.length ? g.players.map((p) => p.name).join(', ') : 'No players yet. Tap to add.'
        }
        onAdd={addGang}
        onRemove={remove}
        onPressItem={(g) => router.push(`/gang/${g.id}`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hint: { color: '#666', paddingHorizontal: 16, paddingTop: 12 },
});
