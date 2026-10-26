import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { GameTile, shortTarget, useGames } from '@/features/games';
import { colors, fonts } from '@/lib/theme';
import { progress } from '../scoring';
import { useMatches } from '../useMatches';

export function HomeScreen() {
  const { items: matches } = useMatches();
  const { items: games } = useGames();

  const current = [...matches].reverse().find((m) => m.status === 'active');
  const bar = current && progress(current);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>Home</Text>

        {current && bar && (
          <View style={styles.current}>
            <View style={styles.currentHead}>
              <Text style={styles.currentKicker}>Current game</Text>
              <Text style={styles.currentName}>{current.gameName}</Text>
              <Text style={styles.currentSub}>
                Round {current.rounds.length + 1} · {current.players.length} players
              </Text>
            </View>
            <View style={styles.progress}>
              <View style={styles.progressRow}>
                <Text style={styles.currentSub}>{bar.label}</Text>
                <Text style={styles.progressValue}>
                  {bar.current} / {bar.max}
                </Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${Math.min(100, (bar.current / bar.max) * 100)}%` }]} />
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push(`/match/${current.id}`)}
              style={styles.continue}
            >
              <Text style={styles.continueLabel}>Continue game</Text>
              <Icon name="arrow-right" size={18} color={colors.ink} />
            </Pressable>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Start a game</Text>
          </View>
          {games.length === 0 ? (
            <Text style={styles.empty}>No games yet. Create one in the Games tab.</Text>
          ) : (
            <View style={styles.tiles}>
              {games.slice(0, 3).map((game) => (
                <Pressable
                  key={game.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Start ${game.name}`}
                  onPress={() => router.push({ pathname: '/match/new', params: { gameId: game.id } })}
                  style={styles.tileWrap}
                >
                  <GameTile name={game.name} color={game.color} symbol={game.symbol} />
                  <Text style={styles.tileCaption}>{shortTarget(game.rules)}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 20, gap: 24 },
  title: { fontFamily: fonts.displayHeavy, fontSize: 34, letterSpacing: -0.7, color: colors.ink },
  current: { backgroundColor: colors.ink, borderRadius: 24, padding: 18, gap: 14 },
  currentHead: { gap: 3 },
  currentKicker: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  currentName: { fontFamily: fonts.displayHeavy, fontSize: 28, color: '#FFFFFF' },
  currentSub: { fontFamily: fonts.body, fontSize: 13, color: colors.darkMuted },
  progress: { gap: 8 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  progressValue: { fontFamily: fonts.displayBold, fontSize: 15, color: '#FFFFFF' },
  track: { height: 8, borderRadius: 4, backgroundColor: '#2A2D35', overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4, backgroundColor: colors.accent },
  continue: {
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueLabel: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  section: { gap: 12 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  sectionTitle: { fontFamily: fonts.displayBold, fontSize: 18, color: colors.ink },
  tiles: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 4 },
  tileWrap: { alignItems: 'center', gap: 8, width: 96 },
  tileCaption: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
  empty: { fontFamily: fonts.body, color: colors.muted },
});
