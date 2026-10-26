import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { newId } from '@/lib/id';
import { colors, fonts } from '@/lib/theme';
import { PLAYER_COLORS } from '../constants';
import { useGangs } from '../useGangs';
import { playersLabel } from './GangsScreen';

/** Add and remove the players of one gang. */
export function GangDetailScreen({ gangId }: { gangId: string }) {
  const { items, loading, update, remove } = useGangs();
  const [name, setName] = useState('');
  const gang = items.find((g) => g.id === gangId);

  if (loading) return null;
  if (!gang) {
    return (
      <Screen>
        <Text style={styles.empty}>Gang not found.</Text>
      </Screen>
    );
  }

  const addPlayer = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const color = PLAYER_COLORS[gang.players.length % PLAYER_COLORS.length];
    void update({ ...gang, players: [...gang.players, { id: newId(), name: trimmed, color }] });
    setName('');
  };

  const removePlayer = (id: string) =>
    void update({ ...gang, players: gang.players.filter((p) => p.id !== id) });

  const deleteGang = () =>
    Alert.alert('Delete gang', `Delete "${gang.name}" and its players?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await remove(gang.id);
          router.back();
        },
      },
    ]);

  return (
    <Screen bottomInset>
      <View style={styles.header}>
        <IconButton icon="back" label="Back to gangs" onPress={() => router.back()} />
        <View style={styles.headerText}>
          <Text style={styles.title}>{gang.name}</Text>
          <Text style={styles.count}>{playersLabel(gang.players.length)}</Text>
        </View>
      </View>

      <View style={styles.addRow}>
        <TextInput
          accessibilityLabel="New player name"
          style={styles.input}
          value={name}
          onChangeText={setName}
          onSubmitEditing={addPlayer}
          placeholder="Add a player to this gang"
          placeholderTextColor={colors.faint}
        />
        <Pressable accessibilityRole="button" onPress={addPlayer} style={styles.addButton}>
          <Icon name="plus" size={18} color={colors.ink} />
          <Text style={styles.addLabel}>Add</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {gang.players.length > 0 && (
          <View style={styles.card}>
            {gang.players.map((p, i) => (
              <View key={p.id} style={[styles.member, i > 0 && styles.memberBorder]}>
                <Avatar name={p.name} color={p.color} size={40} />
                <Text style={styles.memberName}>{p.name}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${p.name}`}
                  onPress={() => removePlayer(p.id)}
                  style={styles.remove}
                >
                  <Icon name="close" color={colors.muted} />
                </Pressable>
              </View>
            ))}
          </View>
        )}
        {gang.players.length === 0 && <Text style={styles.empty}>No players yet. Add the first one above.</Text>}
        <Pressable accessibilityRole="button" onPress={deleteGang} style={styles.delete}>
          <Text style={styles.deleteLabel}>Delete this gang</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="New game"
          variant="ink"
          icon="plus"
          iconPosition="left"
          height={54}
          onPress={() => router.push('/match/new')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 24 },
  headerText: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.displayHeavy, fontSize: 26, letterSpacing: -0.3, color: colors.ink },
  count: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  addRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingTop: 20 },
  input: {
    flex: 1,
    minWidth: 0,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.ink,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.ink,
  },
  addButton: {
    height: 52,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addLabel: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  list: { paddingHorizontal: 20, paddingVertical: 20, gap: 14 },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 20 },
  member: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, paddingLeft: 14, paddingRight: 8 },
  memberBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  memberName: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  remove: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  empty: { textAlign: 'center', color: colors.muted, fontFamily: fonts.body, padding: 16 },
  delete: { height: 44, alignItems: 'center', justifyContent: 'center' },
  deleteLabel: { fontFamily: fonts.semibold, fontSize: 14, color: colors.danger },
  footer: { paddingHorizontal: 20, paddingBottom: 8 },
});
