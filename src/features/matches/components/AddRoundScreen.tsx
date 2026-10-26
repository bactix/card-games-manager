import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { IconButton } from '@/components/IconButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useGames } from '@/features/games';
import { colors, fonts } from '@/lib/theme';
import { reachedEnd, totals } from '../scoring';
import { useMatches } from '../useMatches';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];

/** Enter every player's points for the next round with a number pad. */
export function AddRoundScreen({ matchId }: { matchId: string }) {
  const { items, loading, update } = useMatches();
  const { items: games } = useGames();
  const match = items.find((m) => m.id === matchId);
  const [active, setActive] = useState(0);
  const [values, setValues] = useState<string[]>([]);

  if (loading) return null;
  if (!match) {
    return (
      <Screen>
        <Text style={styles.message}>Game not found.</Text>
      </Screen>
    );
  }

  const sums = totals(match);
  const valueOf = (i: number) => parseInt(values[i] ?? '0', 10) || 0;

  const setActiveValue = (fn: (current: string) => string) =>
    setValues((prev) => {
      const next = match.players.map((_, i) => prev[i] ?? '0');
      next[active] = fn(next[active]);
      return next;
    });

  // 0 = no limit. Matches started before this rule existed fall back to the game's current setting.
  const limit = match.rules.roundTotal ?? games.find((g) => g.id === match.gameId)?.rules.roundTotal ?? 0;
  const roundSum = match.players.reduce((sum, _, i) => sum + valueOf(i), 0);
  const othersSum = roundSum - valueOf(active);
  const left = limit - roundSum;
  const canSave = limit === 0 || left === 0;

  const press = (key: string) => {
    if (key === 'C') return setActiveValue(() => '0');
    if (key === '⌫') return setActiveValue((s) => (s.length > 1 ? s.slice(0, -1) : '0'));
    setActiveValue((s) => {
      const next = s === '0' ? key : s.length < 4 ? s + key : s;
      // a round can never add up to more than the game's points per round
      return limit > 0 && othersSum + (parseInt(next, 10) || 0) > limit ? s : next;
    });
  };

  const save = async () => {
    if (!canSave) return;
    const round = match.players.map((_, i) => valueOf(i));
    const rounds = [...match.rounds, round];
    const finished = reachedEnd({ ...match, rounds });
    await update({ ...match, rounds, status: finished ? 'finished' : 'active' });
    if (finished) router.replace(`/match/${match.id}/winner`);
    else router.back();
  };

  return (
    <Screen bottomInset>
      <View style={styles.header}>
        <IconButton icon="close" label="Cancel" onPress={() => router.back()} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Round {match.rounds.length + 1}</Text>
          <Text style={styles.sub}>
            {limit > 0
              ? `${limit} points to share · ${left} left`
              : 'Tap a player, then enter points'}
          </Text>
        </View>
      </View>

      <View style={styles.rows}>
        {match.players.map((p, i) => {
          const on = active === i;
          const v = valueOf(i);
          return (
            <Pressable
              key={p.id}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${p.name}, round points ${v}`}
              onPress={() => setActive(i)}
              style={[styles.row, on ? styles.rowOn : styles.rowOff]}
            >
              <Avatar name={p.name} color={p.color} size={36} />
              <View style={styles.rowText}>
                <Text style={styles.name}>{p.name}</Text>
                <Text style={styles.next}>
                  {sums[i]} → {sums[i] + v}
                </Text>
              </View>
              <Text style={[styles.value, { color: v === 0 ? colors.faint : colors.ink }]}>+{v}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.spacer} />

      <View style={styles.pad}>
        <View style={styles.keys}>
          {KEYS.map((k) => (
            <Pressable
              key={k}
              accessibilityRole="button"
              accessibilityLabel={k === 'C' ? 'Clear' : k === '⌫' ? 'Delete' : k}
              onPress={() => press(k)}
              style={styles.key}
            >
              <Text style={styles.keyText}>{k}</Text>
            </Pressable>
          ))}
        </View>
        <PrimaryButton
          label={canSave ? 'Save round' : `${left} points left to give`}
          icon="check"
          iconPosition="left"
          disabled={!canSave}
          onPress={save}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  message: { padding: 20, fontFamily: fonts.body, color: colors.muted },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
  headerText: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.displayHeavy, fontSize: 22, color: colors.ink },
  sub: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  rows: { paddingHorizontal: 20, paddingTop: 16, gap: 8 },
  row: {
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.card,
    paddingLeft: 12,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowOn: { borderWidth: 2, borderColor: colors.ink },
  rowOff: { borderWidth: 1, borderColor: colors.line },
  rowText: { flex: 1, gap: 2 },
  name: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  next: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
  value: { fontFamily: fonts.displayHeavy, fontSize: 28 },
  spacer: { flex: 1 },
  pad: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  keys: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  key: {
    width: '31.5%',
    flexGrow: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: { fontFamily: fonts.displayBold, fontSize: 22, color: colors.ink },
});
