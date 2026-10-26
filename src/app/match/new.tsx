import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Chip } from '@/components/Chip';
import { getGame, listGames } from '@/features/games';
import { useGangs } from '@/features/gangs';
import { useMatches } from '@/features/matches';
import { useTeams } from '@/features/teams';
import { newId } from '@/lib/id';

export default function NewMatchScreen() {
  const games = listGames();
  const { items: gangs } = useGangs();
  const { items: teams } = useTeams();
  const { add } = useMatches();

  const [gameId, setGameId] = useState(games[0].id);
  const [pickedGangId, setPickedGangId] = useState<string>();
  // undefined = nothing changed by hand, so the default (first players in the list) applies
  const [pickedIds, setPickedIds] = useState<string[]>();

  const game = getGame(gameId)!;
  const gangId = pickedGangId ?? gangs[0]?.id;
  const candidates = game.teamBased
    ? teams.map((t) => ({ id: t.id, name: t.name }))
    : (gangs.find((g) => g.id === gangId)?.players ?? []);

  const defaultCount = game.maxParticipants ?? game.minParticipants;
  const selected = pickedIds ?? candidates.slice(0, defaultCount).map((c) => c.id);

  const toggle = (id: string) =>
    setPickedIds(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  const start = async () => {
    const participants = candidates.filter((c) => selected.includes(c.id));
    const tooFew = participants.length < game.minParticipants;
    const tooMany = game.maxParticipants !== undefined && participants.length > game.maxParticipants;
    if (tooFew || tooMany) {
      const range = game.maxParticipants
        ? `${game.minParticipants}-${game.maxParticipants}`
        : `at least ${game.minParticipants}`;
      Alert.alert('Participants', `${game.name} needs ${range} participants.`);
      return;
    }
    const id = newId();
    await add({
      id,
      gameTypeId: game.id,
      gangId: game.teamBased ? undefined : gangId,
      participants,
      state: game.initialState(participants),
      status: 'active',
      createdAt: new Date().toISOString(),
    });
    router.replace(`/match/${id}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Game</Text>
      <View style={styles.chips}>
        {games.map((g) => (
          <Chip
            key={g.id}
            label={g.name}
            selected={g.id === gameId}
            onPress={() => {
              setGameId(g.id);
              setPickedIds(undefined);
            }}
          />
        ))}
      </View>

      {!game.teamBased && (
        <>
          <Text style={styles.heading}>Gang</Text>
          <View style={styles.chips}>
            {gangs.map((g) => (
              <Chip
                key={g.id}
                label={g.name}
                selected={g.id === gangId}
                onPress={() => {
                  setPickedGangId(g.id);
                  setPickedIds(undefined);
                }}
              />
            ))}
          </View>
          {gangs.length === 0 && <Text style={styles.hint}>Create a gang first in the Gangs tab.</Text>}
        </>
      )}

      <Text style={styles.heading}>{game.teamBased ? 'Teams' : 'Players'}</Text>
      <View style={styles.chips}>
        {candidates.map((c) => (
          <Chip key={c.id} label={c.name} selected={selected.includes(c.id)} onPress={() => toggle(c.id)} />
        ))}
      </View>
      {candidates.length === 0 && (
        <Text style={styles.hint}>
          {game.teamBased ? 'Create teams first in the Teams tab.' : 'Pick a gang that has players.'}
        </Text>
      )}

      <Button title="Start match" onPress={start} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  heading: { fontSize: 16, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  hint: { color: '#888' },
});
