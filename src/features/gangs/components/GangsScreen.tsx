import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { newId } from '@/lib/id';
import { colors, fonts } from '@/lib/theme';
import { useGangs } from '../useGangs';

export function playersLabel(count: number) {
  return `${count} ${count === 1 ? 'player' : 'players'}`;
}

export function GangsScreen() {
  const { items, add } = useGangs();
  const [name, setName] = useState('');

  const create = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = newId();
    await add({ id, name: trimmed, players: [] });
    setName('');
    router.push(`/gang/${id}`); // go straight to adding its players
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.count}>{items.length} saved</Text>
        <Text style={styles.title}>Gangs</Text>
      </View>

      <View style={styles.createRow}>
        <TextInput
          accessibilityLabel="New gang name"
          style={styles.input}
          value={name}
          onChangeText={setName}
          onSubmitEditing={create}
          placeholder="Name your new gang"
          placeholderTextColor={colors.faint}
        />
        <Pressable accessibilityRole="button" onPress={create} style={styles.createButton}>
          <Icon name="plus" size={18} color={colors.ink} />
          <Text style={styles.createLabel}>Create</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {items.length === 0 && <Text style={styles.empty}>Create your first gang to save its players.</Text>}
        {items.map((gang) => (
          <Pressable
            key={gang.id}
            accessibilityRole="button"
            accessibilityLabel={`Open ${gang.name}, ${playersLabel(gang.players.length)}`}
            onPress={() => router.push(`/gang/${gang.id}`)}
            style={styles.card}
          >
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{gang.name}</Text>
              <View style={styles.avatars}>
                {gang.players.slice(0, 4).map((p, i) => (
                  <View key={p.id} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                    <Avatar name={p.name} color={p.color} size={28} ring />
                  </View>
                ))}
                <Text style={[styles.cardCount, gang.players.length > 0 && { marginLeft: 10 }]}>
                  {playersLabel(gang.players.length)}
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" color={colors.faint} />
          </Pressable>
        ))}
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
  header: { paddingHorizontal: 20, paddingTop: 28, gap: 2 },
  count: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
  title: { fontFamily: fonts.displayHeavy, fontSize: 34, letterSpacing: -0.7, color: colors.ink },
  createRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingTop: 20 },
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
  createButton: {
    height: 52,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  createLabel: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  list: { paddingHorizontal: 20, paddingVertical: 20, gap: 10 },
  empty: { textAlign: 'center', color: colors.muted, fontFamily: fonts.body, paddingTop: 12 },
  card: {
    minHeight: 84,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardText: { flex: 1, gap: 8 },
  cardTitle: { fontFamily: fonts.displayBold, fontSize: 19, color: colors.ink },
  avatars: { flexDirection: 'row', alignItems: 'center' },
  cardCount: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  footer: { paddingHorizontal: 20, paddingBottom: 8 },
});
