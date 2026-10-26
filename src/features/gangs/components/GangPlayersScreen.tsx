import { Stack } from 'expo-router';
import { useState } from 'react';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { newId } from '@/lib/id';
import { useGangs } from '../useGangs';

/** Add, remove and drag-to-sort the players of one gang. The order is saved. */
export function GangPlayersScreen({ gangId }: { gangId: string }) {
  const { items, loading, update } = useGangs();
  const [name, setName] = useState('');
  const gang = items.find((g) => g.id === gangId);

  if (loading) return null;
  if (!gang) return <Text style={styles.message}>Gang not found.</Text>;

  const addPlayer = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    void update({ ...gang, players: [...gang.players, { id: newId(), name: trimmed }] });
    setName('');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: gang.name }} />
      <Text style={styles.hint}>
        Hold ≡ and drag to reorder. New matches pick players from the top of this list.
      </Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="New player name"
          onSubmitEditing={addPlayer}
        />
        <Button title="Add" onPress={addPlayer} />
      </View>
      <DraggableFlatList
        data={gang.players}
        keyExtractor={(p) => p.id}
        onDragEnd={({ data }) => void update({ ...gang, players: data })}
        ListEmptyComponent={<Text style={styles.empty}>No players yet.</Text>}
        renderItem={({ item, drag, isActive, getIndex }) => (
          <ScaleDecorator>
            <View style={[styles.item, isActive && styles.active]}>
              <Pressable onPressIn={drag} hitSlop={8}>
                <Text style={styles.handle}>≡</Text>
              </Pressable>
              <Text style={styles.index}>{(getIndex() ?? 0) + 1}</Text>
              <Text style={styles.label}>{item.name}</Text>
              <Button
                title="Delete"
                color="#c0392b"
                onPress={() =>
                  void update({ ...gang, players: gang.players.filter((p) => p.id !== item.id) })
                }
              />
            </View>
          </ScaleDecorator>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  message: { padding: 16 },
  hint: { color: '#666' },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  active: { backgroundColor: '#eef2ff' },
  handle: { fontSize: 24, color: '#888', paddingHorizontal: 4 },
  index: { width: 20, color: '#888' },
  label: { flex: 1, fontSize: 16, fontWeight: '600' },
  empty: { textAlign: 'center', color: '#888', marginTop: 24 },
});
