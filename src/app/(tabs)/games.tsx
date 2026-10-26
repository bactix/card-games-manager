import { FlatList, StyleSheet, Text, View } from 'react-native';
import { listGames } from '@/features/games';

export default function GamesScreen() {
  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={listGames()}
      keyExtractor={(g) => g.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>
            {item.teamBased ? 'Team game' : 'Individual game'} · {item.minParticipants}
            {item.maxParticipants ? `-${item.maxParticipants}` : '+'} participants
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  item: { paddingVertical: 10 },
  title: { fontSize: 16, fontWeight: '600' },
  subtitle: { color: '#666' },
});
