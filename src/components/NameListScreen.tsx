import { useState } from 'react';
import { Button, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface Props<T extends { id: string }> {
  items: T[];
  placeholder: string;
  getLabel: (item: T) => string;
  getSubtitle?: (item: T) => string;
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onPressItem?: (item: T) => void;
}

/** "Type a name, add it, list it" screen shared by gangs, teams and the players of a gang. */
export function NameListScreen<T extends { id: string }>({
  items,
  placeholder,
  getLabel,
  getSubtitle,
  onAdd,
  onRemove,
  onPressItem,
}: Props<T>) {
  const [name, setName] = useState('');

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder={placeholder}
          onSubmitEditing={submit}
        />
        <Button title="Add" onPress={submit} />
      </View>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Text style={styles.empty}>Nothing here yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Pressable style={styles.itemText} onPress={() => onPressItem?.(item)}>
              <Text style={styles.label}>{getLabel(item)}</Text>
              {getSubtitle && <Text style={styles.subtitle}>{getSubtitle(item)}</Text>}
            </Pressable>
            <Button title="Delete" color="#c0392b" onPress={() => onRemove(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 8 },
  itemText: { flex: 1 },
  label: { fontSize: 16, fontWeight: '600' },
  subtitle: { color: '#666' },
  empty: { textAlign: 'center', color: '#888', marginTop: 24 },
});
