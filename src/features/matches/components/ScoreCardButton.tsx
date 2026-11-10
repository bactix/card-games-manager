import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GameSymbol, type GameSymbolName } from '@/features/games';
import { colors, fonts } from '@/lib/theme';

interface Props {
  suit: GameSymbolName;
  rank: string;
  points: number;
  /** How many of this card the player took this round. */
  count: number;
  /** Show the count on a badge (for cards that can be taken several times, like hearts). */
  showCount: boolean;
  /** No more of this card is available for this player. */
  unavailable: boolean;
  /** Smaller card that fits inside a player's row. */
  compact?: boolean;
  label: string;
  onPress: () => void;
  onLongPress: () => void;
}

const RED = '#C0392B';

/** A playing-card shaped button that gives its points to a player. */
export function ScoreCardButton({
  suit,
  rank,
  points,
  count,
  showCount,
  unavailable,
  compact,
  label,
  onPress,
  onLongPress,
}: Props) {
  const taken = count > 0;
  const ink = suit === 'heart' || suit === 'diamond' ? RED : colors.ink;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: taken }}
      delayLongPress={300}
      hitSlop={compact ? 4 : 0}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.card, compact && styles.cardCompact, taken && styles.taken, unavailable && !taken && styles.dim]}
    >
      {rank !== '' && (
        <View style={[styles.corner, compact && styles.cornerCompact]}>
          <Text style={[styles.rank, compact && styles.rankCompact, { color: ink }]}>{rank}</Text>
          <GameSymbol symbol={suit} size={compact ? 7 : 11} color={ink} />
        </View>
      )}
      <View style={styles.center}>
        <GameSymbol symbol={suit} size={compact ? (rank === '' ? 18 : 14) : rank === '' ? 34 : 30} color={ink} />
      </View>
      <Text style={[styles.points, compact && styles.pointsCompact, { color: ink }]}>+{points}</Text>
      {showCount && taken && (
        <View style={[styles.badge, compact && styles.badgeCompact]}>
          <Text style={[styles.badgeText, compact && styles.badgeTextCompact]}>{count}</Text>
        </View>
      )}
    </Pressable>
  );
}

/** A card-shaped button that gives a player the round's penalty (for example −30). */
export function PenaltyCardButton({
  value,
  text,
  selected,
  unavailable,
  compact,
  label,
  onPress,
}: {
  /** A fixed penalty such as -30. */
  value?: number;
  /** Text to show instead, for example "−?" for a number the user types. */
  text?: string;
  selected: boolean;
  unavailable: boolean;
  compact?: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      hitSlop={compact ? 4 : 0}
      onPress={onPress}
      style={[
        styles.card,
        compact && styles.cardCompact,
        styles.penalty,
        selected && styles.penaltyOn,
        unavailable && !selected && styles.dim,
      ]}
    >
      <View style={styles.center}>
        <Text style={[styles.penaltyText, compact && styles.penaltyTextCompact, selected && { color: '#FFFFFF' }]}>
          {text ?? `−${Math.abs(value ?? 0)}`}
        </Text>
      </View>
    </Pressable>
  );
}

/** A card-shaped button that gives the points still left in the round to a player. */
export function RestCardButton({
  amount,
  compact,
  label,
  onPress,
}: {
  amount: number;
  compact?: boolean;
  label: string;
  onPress: () => void;
}) {
  const empty = amount <= 0;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: empty }}
      hitSlop={compact ? 4 : 0}
      onPress={() => !empty && onPress()}
      style={[styles.card, compact && styles.cardCompact, styles.rest, empty && styles.dim]}
    >
      <View style={styles.center}>
        <Text style={[styles.restAmount, compact && styles.restAmountCompact]}>+{amount}</Text>
      </View>
      <Text style={[styles.points, compact && styles.pointsCompact, { color: colors.accent }]}>rest</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  penalty: { borderColor: colors.danger, backgroundColor: '#FDECEA' },
  penaltyOn: { backgroundColor: colors.danger },
  penaltyText: { fontFamily: fonts.displayHeavy, fontSize: 24, color: colors.danger },
  penaltyTextCompact: { fontSize: 12 },
  rest: { borderStyle: 'dashed', borderColor: colors.accent, backgroundColor: colors.bg },
  restAmount: { fontFamily: fonts.displayHeavy, fontSize: 24, color: colors.ink },
  restAmountCompact: { fontSize: 12 },
  card: {
    width: 64,
    height: 92,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  cardCompact: { width: 32, height: 46, borderRadius: 6, borderWidth: 1.5, paddingVertical: 2 },
  cornerCompact: { top: 1, left: 2, gap: 0 },
  rankCompact: { fontSize: 9, lineHeight: 10 },
  pointsCompact: { fontSize: 9 },
  badgeCompact: { top: -8, right: -7, minWidth: 18, height: 18, borderRadius: 9 },
  badgeTextCompact: { fontSize: 10 },
  taken: { borderColor: colors.accent, backgroundColor: colors.leadBg, transform: [{ translateY: -4 }] },
  dim: { opacity: 0.35 },
  corner: { position: 'absolute', top: 5, left: 6, alignItems: 'center', gap: 1 },
  rank: { fontFamily: fonts.displayBold, fontSize: 15, lineHeight: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  points: { textAlign: 'center', fontFamily: fonts.displayBold, fontSize: 13 },
  badge: {
    position: 'absolute',
    top: -9,
    right: -9,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { fontFamily: fonts.displayBold, fontSize: 13, color: '#FFFFFF' },
});
