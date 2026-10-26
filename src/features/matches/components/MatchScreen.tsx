import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { getGame } from '@/features/games';
import { useMatches } from '../useMatches';

/** Runs any game module for a stored match and lets the user end it at any time. */
export function MatchScreen({ matchId }: { matchId: string }) {
  const { items, loading, update } = useMatches();
  const match = items.find((m) => m.id === matchId);
  const game = match && getGame(match.gameTypeId);

  if (loading) return null;
  if (!match || !game) return <Text style={styles.message}>Match not found.</Text>;

  const dispatch = (action: unknown) => {
    const state = game.reduce(match.state, action);
    const finished = game.isFinished(state);
    void update({
      ...match,
      state,
      status: finished ? 'finished' : 'active',
      winnerId: finished ? game.getResult(state).winnerId : undefined,
    });
  };

  // Ends the match now; the winner is whoever leads under the game's own rules.
  const endNow = () =>
    Alert.alert('End match', 'End this match now? The current leader wins.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'End match',
        style: 'destructive',
        onPress: () =>
          void update({
            ...match,
            status: 'finished',
            endedEarly: true,
            winnerId: game.getResult(match.state).winnerId,
          }),
      },
    ]);

  const winner = match.participants.find((p) => p.id === match.winnerId);
  const finished = match.status === 'finished';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{game.name}</Text>
      {finished && (
        <Text style={styles.winner}>
          {match.endedEarly ? 'Ended early' : 'Finished'}
          {winner ? ` · Winner: ${winner.name}` : ''}
        </Text>
      )}
      <game.Screen state={match.state} dispatch={dispatch} readOnly={finished} />
      {!finished && (
        <View style={styles.footer}>
          <Button title="End match now" color="#c0392b" onPress={endNow} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  message: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', paddingHorizontal: 16, paddingTop: 16 },
  winner: { fontSize: 16, color: '#16a34a', paddingHorizontal: 16 },
  footer: { padding: 16 },
});
