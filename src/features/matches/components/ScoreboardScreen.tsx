import { Redirect, router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { shortTarget } from '@/features/games';
import { colors, fonts } from '@/lib/theme';
import { ranking, totals } from '../scoring';
import { useMatches } from '../useMatches';

const ROUND_COL = 52;

export function ScoreboardScreen({ matchId }: { matchId: string }) {
  const { items, loading, update } = useMatches();
  const match = items.find((m) => m.id === matchId);

  if (loading) return null;
  if (!match) {
    return (
      <Screen>
        <Text style={styles.message}>Game not found.</Text>
      </Screen>
    );
  }
  if (match.status === 'finished') return <Redirect href={`/match/${match.id}/winner`} />;

  const sums = totals(match);
  const order = ranking(match);
  const lead = order[0];
  const last = order[order.length - 1];
  const hasRounds = match.rounds.length > 0;
  const columnBg = (i: number) =>
    !hasRounds ? undefined : i === lead ? colors.leadBg : i === last ? colors.lastBg : undefined;
  const tag = (i: number) => (!hasRounds ? '' : i === lead ? '1st' : i === last ? 'Last' : '');

  const confirmEnd = () =>
    Alert.alert('End game now?', 'The player in the lead wins. You can\'t add more rounds afterwards.', [
      { text: 'Keep playing', style: 'cancel' },
      {
        text: 'End game now',
        style: 'destructive',
        onPress: async () => {
          await update({ ...match, status: 'finished', endedEarly: true });
          router.replace(`/match/${match.id}/winner`);
        },
      },
    ]);

  const confirmReset = () =>
    Alert.alert(
      'Reset the whole game?',
      'Every round is erased and all scores go back to 0. The players and rules stay the same.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset game', style: 'destructive', onPress: () => void update({ ...match, rounds: [], bids: undefined }) },
      ],
    );

  const options = () =>
    Alert.alert('Game options', undefined, [
      { text: 'Reset game', style: 'destructive', onPress: confirmReset },
      { text: 'End game now', onPress: confirmEnd },
      { text: 'Cancel', style: 'cancel' },
    ]);

  return (
    <Screen bottomInset>
      <View style={styles.header}>
        <IconButton icon="back" label="Back to home" onPress={() => router.dismissTo('/')} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Scoreboard</Text>
          <Text style={styles.sub}>
            {match.rounds.length} {match.rounds.length === 1 ? 'round' : 'rounds'} played ·{' '}
            {shortTarget(match.rules).toLowerCase()}
          </Text>
        </View>
        <IconButton icon="more" label="Game options" onPress={options} />
      </View>

      <View style={styles.cardWrap}>
        <View style={styles.card}>
          <View style={[styles.row, styles.headRow]}>
            <Text style={[styles.roundCell, styles.headLabel]}>Round</Text>
            {match.players.map((p, i) => (
              <View key={p.id} style={[styles.cell, { backgroundColor: columnBg(i) }]}>
                <Text style={[styles.playerName, { color: p.color }]} numberOfLines={1}>
                  {p.name}
                </Text>
                <Text style={[styles.tag, { color: i === lead ? '#9A3412' : '#3F4450' }]}>{tag(i)}</Text>
              </View>
            ))}
          </View>

          <ScrollView style={styles.rounds}>
            {match.rounds.map((round, r) => (
              <View
                key={r}
                style={[
                  styles.row,
                  styles.roundRow,
                  r === match.rounds.length - 1 && { backgroundColor: colors.lastRowBg },
                  r > 0 && r < match.rounds.length - 1 && styles.roundBorder,
                ]}
              >
                <Text style={[styles.roundCell, styles.roundNumber]}>{r + 1}</Text>
                {match.players.map((p, i) => (
                  <View key={p.id} style={[styles.cell, { backgroundColor: columnBg(i) }]}>
                    <Text style={round[i] ? styles.value : styles.zero}>{round[i] ? round[i] : '–'}</Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>

          <View style={[styles.row, styles.totalRow]}>
            <Text style={[styles.roundCell, styles.totalLabel]}>Total</Text>
            {match.players.map((p, i) => (
              <View key={p.id} style={[styles.cell, { backgroundColor: columnBg(i) }]}>
                <Text style={styles.total}>{sums[i]}</Text>
              </View>
            ))}
          </View>
        </View>
        {match.bids && (
          <Text style={styles.bidsLine}>
            Round {match.rounds.length + 1} bids:{' '}
            {match.players.map((p, i) => `${p.name} ${match.bids?.[i]}`).join(' · ')}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <IconButton
          icon="undo"
          label="Undo last round"
          size={56}
          radius={16}
          disabled={!hasRounds}
          onPress={() =>
            Alert.alert('Undo last round?', `Round ${match.rounds.length} will be removed from the scoreboard.`, [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Undo round',
                style: 'destructive',
                onPress: () => void update({ ...match, rounds: match.rounds.slice(0, -1) }),
              },
            ])
          }
        />
        <View style={styles.addWrap}>
          <PrimaryButton
            label={
              match.rules.bids?.length
                ? match.bids
                  ? `End round ${match.rounds.length + 1}`
                  : `Start round ${match.rounds.length + 1}`
                : `Add round ${match.rounds.length + 1}`
            }
            icon={match.bids ? 'check' : 'plus'}
            iconPosition="left"
            onPress={() => router.push(`/match/${match.id}/round`)}
          />
        </View>
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
  cardWrap: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  card: {
    flexShrink: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  headRow: { height: 56, borderBottomWidth: 1, borderBottomColor: colors.line },
  roundCell: { width: ROUND_COL, paddingLeft: 8 },
  headLabel: { fontFamily: fonts.semibold, fontSize: 12, color: colors.muted },
  cell: { flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', gap: 2 },
  playerName: { fontFamily: fonts.semibold, fontSize: 12 },
  tag: { minHeight: 12, fontFamily: fonts.semibold, fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase' },
  rounds: { flexGrow: 0 },
  roundRow: { height: 38 },
  roundBorder: { borderTopWidth: 1, borderTopColor: '#F0F1EC' },
  roundNumber: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  value: { fontFamily: fonts.displayBold, fontSize: 15, color: colors.ink },
  zero: { fontFamily: fonts.display, fontSize: 15, color: colors.muted },
  totalRow: { height: 52, borderTopWidth: 2, borderTopColor: colors.ink, backgroundColor: colors.bg },
  totalLabel: { fontFamily: fonts.displayBold, fontSize: 13, color: colors.ink },
  total: { fontFamily: fonts.displayHeavy, fontSize: 19, color: colors.ink },
  bidsLine: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink, paddingTop: 12 },
  footer: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  addWrap: { flex: 1 },
});
