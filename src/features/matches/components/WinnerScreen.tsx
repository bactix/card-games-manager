import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { newId } from '@/lib/id';
import { colors, fonts } from '@/lib/theme';
import { biggestRound, ranking, totals } from '../scoring';
import { useMatches } from '../useMatches';

export function WinnerScreen({ matchId }: { matchId: string }) {
  const { items, loading, add } = useMatches();
  const match = items.find((m) => m.id === matchId);

  if (loading) return null;
  if (!match) {
    return (
      <Screen background={colors.ink}>
        <Text style={styles.message}>Game not found.</Text>
      </Screen>
    );
  }
  if (match.status !== 'finished') return <Redirect href={`/match/${match.id}`} />;

  const sums = totals(match);
  const order = ranking(match);
  const winner = match.players[order[0]];
  const points = sums[order[0]];
  const roundsPlayed = match.rounds.length;
  const best = biggestRound(match);

  const reason = match.endedEarly
    ? `${points} points · ended early after ${roundsPlayed} ${roundsPlayed === 1 ? 'round' : 'rounds'}`
    : match.rules.endMode === 'score'
      ? `${points} points · game reached ${match.rules.targetScore} in round ${roundsPlayed}`
      : `${points} points · after ${roundsPlayed} ${roundsPlayed === 1 ? 'round' : 'rounds'}`;

  const rematch = async () => {
    const id = newId();
    await add({ ...match, id, rounds: [], status: 'active', endedEarly: undefined, createdAt: new Date().toISOString() });
    router.replace(`/match/${id}`);
  };

  return (
    <Screen background={colors.ink} bottomInset>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.hero}>
          <View style={styles.trophy}>
            <Icon name="trophy" size={52} color={colors.ink} strokeWidth={1.8} />
          </View>
          <Text style={styles.kicker}>Game over</Text>
          <Text style={styles.headline}>{winner.name} wins!</Text>
          <Text style={styles.reason}>{reason}</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Rounds played</Text>
            <Text style={styles.statValue}>{roundsPlayed}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Biggest round</Text>
            <Text style={styles.statValue}>
              {best ? best.value : '–'}
              {best && (
                <Text style={styles.statNote}>
                  {'  '}
                  {match.players[best.playerIndex].name}, R{best.round}
                </Text>
              )}
            </Text>
          </View>
        </View>

        <View style={styles.standingsWrap}>
          <Text style={styles.standingsTitle}>Final standings</Text>
          <View style={styles.standings}>
            {order.map((playerIndex, pos) => {
              const p = match.players[playerIndex];
              return (
                <View key={p.id} style={[styles.standing, pos > 0 && styles.standingBorder]}>
                  <Text style={styles.pos}>{pos + 1}</Text>
                  <Avatar name={p.name} color={p.color} size={32} />
                  <Text style={styles.standingName}>{p.name}</Text>
                  <Text style={styles.standingScore}>{sums[playerIndex]}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.half}>
          <PrimaryButton label="Done" variant="outline-dark" onPress={() => router.dismissTo('/')} />
        </View>
        <View style={styles.half}>
          <PrimaryButton label="Rematch" icon="refresh" iconPosition="left" onPress={rematch} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  message: { padding: 20, fontFamily: fonts.body, color: colors.darkMuted },
  body: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 16, gap: 28 },
  hero: { alignItems: 'center', gap: 14 },
  trophy: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kicker: { fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.accent },
  headline: { fontFamily: fonts.displayHeavy, fontSize: 48, lineHeight: 50, letterSpacing: -1.4, color: '#FFFFFF', textAlign: 'center' },
  reason: { fontFamily: fonts.body, fontSize: 15, color: colors.darkMuted, textAlign: 'center' },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, borderRadius: 18, backgroundColor: colors.darkCard, paddingVertical: 14, paddingHorizontal: 16, gap: 4 },
  statLabel: { fontFamily: fonts.body, fontSize: 12, color: colors.darkMuted },
  statValue: { fontFamily: fonts.displayHeavy, fontSize: 26, color: '#FFFFFF' },
  statNote: { fontFamily: fonts.medium, fontSize: 13, color: colors.darkMuted },
  standingsWrap: { gap: 10 },
  standingsTitle: { fontFamily: fonts.displayBold, fontSize: 18, color: '#FFFFFF' },
  standings: { borderRadius: 20, backgroundColor: colors.darkCard },
  standing: { height: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16 },
  standingBorder: { borderTopWidth: 1, borderTopColor: '#2E323B' },
  pos: { width: 20, fontFamily: fonts.displayBold, fontSize: 15, color: colors.darkMuted },
  standingName: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: '#FFFFFF' },
  standingScore: { fontFamily: fonts.displayHeavy, fontSize: 20, color: '#FFFFFF' },
  footer: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  half: { flex: 1 },
});
