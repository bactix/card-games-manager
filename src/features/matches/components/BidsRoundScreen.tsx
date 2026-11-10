import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useGames } from '@/features/games';
import { colors, fonts } from '@/lib/theme';
import { reachedEnd, totals } from '../scoring';
import { useMatches } from '../useMatches';

const MADE = '#237032';
const MISSED = colors.danger;

/**
 * Rounds with bids. Step 1, at the start of the round: every player locks in one bid and it can't be edited.
 * Step 2, when the round ends: each bid is marked made (counts +) or missed (counts −).
 */
export function BidsRoundScreen({ matchId }: { matchId: string }) {
  const { items, loading, update } = useMatches();
  const { items: games } = useGames();
  const match = items.find((m) => m.id === matchId);
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState<(number | undefined)[]>([]);
  const [made, setMade] = useState<(boolean | undefined)[]>([]);

  if (loading) return null;
  if (!match) {
    return (
      <Screen>
        <Text style={styles.message}>Game not found.</Text>
      </Screen>
    );
  }

  const options = match.rules.bids ?? games.find((g) => g.id === match.gameId)?.rules.bids ?? [];
  const locked = match.bids; // set once the bids of this round are locked in
  const sums = totals(match);
  const roundNumber = match.rounds.length + 1;

  // ---- Step 1: choose and lock the bids -------------------------------------------------------------------
  if (!locked) {
    const allPicked = match.players.every((_, i) => picked[i] !== undefined);

    const choose = (bid: number) => {
      const next = match.players.map((_, i) => picked[i]);
      next[active] = bid;
      setPicked(next);
      // move on to the next player who still has no bid
      const following = [...match.players.keys()].find((i) => i !== active && next[i] === undefined);
      if (following !== undefined) setActive(following);
    };

    const lock = () =>
      Alert.alert('Lock the bids?', 'Once locked, the bids of this round cannot be changed.', [
        { text: 'Keep choosing', style: 'cancel' },
        {
          text: 'Lock bids',
          onPress: async () => {
            await update({ ...match, bids: match.players.map((_, i) => picked[i] as number) });
            router.back();
          },
        },
      ]);

    return (
      <Screen bottomInset>
        <View style={styles.header}>
          <IconButton icon="close" label="Cancel" onPress={() => router.back()} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Round {roundNumber} · bids</Text>
            <Text style={styles.sub}>Tap a player, then pick their bid</Text>
          </View>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.rows}>
          {match.players.map((p, i) => {
            const on = active === i;
            return (
              <Pressable
                key={p.id}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`${p.name}, bid ${picked[i] ?? 'not chosen'}`}
                onPress={() => setActive(i)}
                style={[styles.row, on ? styles.rowOn : styles.rowOff]}
              >
                <Avatar name={p.name} color={p.color} size={36} />
                <View style={styles.rowText}>
                  <Text style={styles.name}>{p.name}</Text>
                  <Text style={styles.next}>Total {sums[i]}</Text>
                </View>
                <Text style={[styles.bigValue, picked[i] === undefined && { color: colors.faint }]}>
                  {picked[i] ?? '–'}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.pad}>
          <View style={styles.bidGrid}>
            {options.map((bid) => {
              const on = picked[active] === bid;
              return (
                <Pressable
                  key={bid}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`Bid ${bid}`}
                  onPress={() => choose(bid)}
                  style={[styles.bid, on && styles.bidOn]}
                >
                  <Text style={[styles.bidText, on && styles.bidTextOn]}>{bid}</Text>
                </Pressable>
              );
            })}
          </View>
          <PrimaryButton
            label={allPicked ? 'Lock bids' : 'Everyone needs a bid'}
            icon="check"
            iconPosition="left"
            disabled={!allPicked}
            onPress={lock}
          />
        </View>
      </Screen>
    );
  }

  // ---- Step 2: mark each bid as made or missed -----------------------------------------------------------
  const decided = match.players.every((_, i) => made[i] !== undefined);
  const roundValue = (i: number) => (made[i] ? locked[i] : -locked[i]);

  const save = async () => {
    if (!decided) return;
    const round = match.players.map((_, i) => roundValue(i));
    const rounds = [...match.rounds, round];
    const finished = reachedEnd({ ...match, rounds });
    await update({ ...match, rounds, bids: undefined, status: finished ? 'finished' : 'active' });
    if (finished) router.replace(`/match/${match.id}/winner`);
    else router.back();
  };

  return (
    <Screen bottomInset>
      <View style={styles.header}>
        <IconButton icon="close" label="Cancel" onPress={() => router.back()} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Round {roundNumber} · results</Text>
          <Text style={styles.sub}>Did each player make their bid?</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.rows}>
        {match.players.map((p, i) => {
          const result = made[i];
          return (
            <View key={p.id} style={[styles.row, styles.rowOff, styles.resultRow]}>
              <View style={styles.resultTop}>
                <Avatar name={p.name} color={p.color} size={36} />
                <View style={styles.rowText}>
                  <Text style={styles.name}>{p.name}</Text>
                  <Text style={styles.next}>
                    Bid {locked[i]} · total {sums[i]}
                    {result !== undefined ? ` → ${sums[i] + roundValue(i)}` : ''}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.bigValue,
                    { color: result === undefined ? colors.faint : result ? MADE : MISSED },
                  ]}
                >
                  {result === undefined ? '?' : result ? `+${locked[i]}` : `−${locked[i]}`}
                </Text>
              </View>
              <View style={styles.choiceRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: result === true }}
                  accessibilityLabel={`${p.name} made the bid of ${locked[i]}`}
                  onPress={() => setMade((prev) => match.players.map((_, k) => (k === i ? true : prev[k])))}
                  style={[styles.choice, result === true && { backgroundColor: MADE, borderColor: MADE }]}
                >
                  <Icon name="check" size={18} color={result === true ? '#FFFFFF' : colors.ink} />
                  <Text style={[styles.choiceText, result === true && styles.choiceTextOn]}>Made it</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: result === false }}
                  accessibilityLabel={`${p.name} missed the bid of ${locked[i]}`}
                  onPress={() => setMade((prev) => match.players.map((_, k) => (k === i ? false : prev[k])))}
                  style={[styles.choice, result === false && { backgroundColor: MISSED, borderColor: MISSED }]}
                >
                  <Icon name="close" size={18} color={result === false ? '#FFFFFF' : colors.ink} />
                  <Text style={[styles.choiceText, result === false && styles.choiceTextOn]}>Missed</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={decided ? 'Save round' : 'Mark every player'}
          icon="check"
          iconPosition="left"
          disabled={!decided}
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
  scroll: { flex: 1 },
  rows: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, gap: 8 },
  row: {
    minHeight: 64,
    borderRadius: 18,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowOn: { borderWidth: 2, borderColor: colors.ink },
  rowOff: { borderWidth: 1, borderColor: colors.line },
  rowText: { flex: 1, gap: 2, minWidth: 0 },
  name: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  next: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
  bigValue: { fontFamily: fonts.displayHeavy, fontSize: 28, minWidth: 56, textAlign: 'right', color: colors.ink },
  resultRow: { flexDirection: 'column', alignItems: 'stretch', gap: 10 },
  resultTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  choiceRow: { flexDirection: 'row', gap: 8 },
  choice: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  choiceText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  choiceTextOn: { color: '#FFFFFF' },
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
  bidGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bid: {
    width: '23%',
    flexGrow: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bidOn: { backgroundColor: colors.ink },
  bidText: { fontFamily: fonts.displayBold, fontSize: 22, color: colors.ink },
  bidTextOn: { color: '#FFFFFF' },
  footer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
});
