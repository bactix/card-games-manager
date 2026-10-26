import { router } from 'expo-router';
import { Button, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { getGame } from '@/features/games';
import { useMatches } from '@/features/matches';

export default function MatchesScreen() {
  const { items } = useMatches();
  const matches = [...items].reverse();

  return (
    <View style={styles.container}>
      <Button title="New match" onPress={() => router.push('/match/new')} />
      <FlatList
        data={matches}
        keyExtractor={(m) => m.id}
        ListEmptyComponent={<Text style={styles.empty}>No matches recorded yet.</Text>}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => router.push(`/match/${item.id}`)}>
            <Text style={styles.title}>
              {getGame(item.gameTypeId)?.name ?? 'Unknown game'} ·{' '}
              {item.status === 'finished' ? (item.endedEarly ? 'ended early' : 'finished') : 'in progress'}
            </Text>
            <Text style={styles.subtitle}>
              {item.participants.map((p) => p.name).join(' vs ')}
            </Text>
            <Text style={styles.subtitle}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  item: { paddingVertical: 10 },
  title: { fontSize: 16, fontWeight: '600' },
  subtitle: { color: '#666' },
  empty: { textAlign: 'center', color: '#888', marginTop: 24 },
});
