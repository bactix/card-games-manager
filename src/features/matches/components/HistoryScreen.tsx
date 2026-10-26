import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { colors, fonts } from '@/lib/theme';
import { ranking, totals } from '../scoring';
import { useMatches } from '../useMatches';

function when(iso: string) {
  const d = new Date(iso);
  const day = d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${day} · ${time}`;
}

/** Every game that was played or is still running, newest first. */
export function HistoryScreen() {
  const { items } = useMatches();
  const matches = [...items].reverse();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.count}>{matches.length} played</Text>
        <Text style={styles.title}>Games</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {matches.length === 0 && (
          <View style={styles.emptyWrap}>
            <Text style={styles.empty}>No games yet. Your finished games will show up here.</Text>
            <PrimaryButton label="Start a game" icon="arrow-right" onPress={() => router.push('/match/new')} />
          </View>
        )}
        {matches.map((m) => {
          const sums = totals(m);
          const leader = ranking(m)[0];
          const finished = m.status === 'finished';
          const status = finished ? (m.endedEarly ? 'Ended early' : 'Finished') : 'In progress';
          return (
            <Pressable
              key={m.id}
              accessibilityRole="button"
              accessibilityLabel={`${m.gameName}, ${status}`}
              onPress={() => router.push(finished ? `/match/${m.id}/winner` : `/match/${m.id}`)}
              style={styles.card}
            >
              <View style={styles.cardHead}>
                <View style={styles.cardTitleWrap}>
                  <Text style={styles.cardTitle}>{m.gameName}</Text>
                  <Text style={styles.sub}>
                    {when(m.createdAt)} · {m.rounds.length} {m.rounds.length === 1 ? 'round' : 'rounds'}
                  </Text>
                </View>
                <View style={[styles.badge, finished ? styles.badgeDone : styles.badgeLive]}>
                  <Text style={[styles.badgeText, !finished && { color: colors.ink }]}>{status}</Text>
                </View>
              </View>

              <View style={styles.footerRow}>
                <View style={styles.avatars}>
                  {m.players.map((p, i) => (
                    <View key={p.id} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                      <Avatar name={p.name} color={p.color} size={28} ring />
                    </View>
                  ))}
                </View>
                {m.rounds.length > 0 && (
                  <Text style={styles.result} numberOfLines={1}>
                    {finished ? 'Winner' : 'Leading'}: {m.players[leader].name} · {sums[leader]}
                  </Text>
                )}
                <Icon name="chevron-right" size={18} color={colors.faint} />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 28, gap: 2 },
  count: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
  title: { fontFamily: fonts.displayHeavy, fontSize: 34, letterSpacing: -0.7, color: colors.ink },
  list: { paddingHorizontal: 20, paddingVertical: 20, gap: 12 },
  emptyWrap: { gap: 16, paddingTop: 12 },
  empty: { textAlign: 'center', fontFamily: fonts.body, color: colors.muted },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    padding: 16,
    gap: 14,
  },
  cardHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  cardTitleWrap: { flex: 1, gap: 4 },
  cardTitle: { fontFamily: fonts.displayHeavy, fontSize: 22, color: colors.ink },
  sub: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
  badgeDone: { backgroundColor: colors.ink },
  badgeLive: { backgroundColor: colors.accent },
  badgeText: { fontFamily: fonts.semibold, fontSize: 12, color: '#FFFFFF' },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatars: { flexDirection: 'row' },
  result: { flex: 1, textAlign: 'right', fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
});
