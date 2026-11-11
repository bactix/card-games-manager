import { StyleSheet, Text, View } from 'react-native';
import { Icon, type IconName } from '@/components/Icon';
import { colors, fonts } from '@/lib/theme';
import { describeRules } from '../rules';
import type { GameRules } from '../types';

interface Row {
  icon: IconName;
  label: string;
  value: string;
}

function rowsFor(r: GameRules): Row[] {
  const rows: Row[] = [
    { icon: 'users', label: 'Players', value: String(r.playerLimit) },
    r.endMode === 'score'
      ? { icon: 'target', label: 'Game ends at', value: `${r.targetScore} pts` }
      : { icon: 'layers', label: 'Game ends after', value: `${r.rounds} ${r.rounds === 1 ? 'round' : 'rounds'}` },
    { icon: 'trophy', label: 'Winner has the', value: r.winner === 'least' ? 'Least' : 'Most' },
  ];
  if (r.roundTotal > 0) {
    rows.push({ icon: 'sum', label: 'Points per round', value: String(r.roundTotal) });
  }
  if ((r.maxPerPlayer ?? 0) > 0) {
    rows.push({ icon: 'sum', label: 'Max points per player in a round', value: String(r.maxPerPlayer) });
  }
  if (r.penalties?.length) {
    rows.push({
      icon: 'minus',
      label: 'One player each round takes',
      value: r.penalties.map((p) => (p < 0 ? `−${-p}` : String(p))).join(' / '),
    });
  }
  if (r.bids?.length) {
    rows.push({
      icon: 'target',
      label: 'Bid each round: made = +, missed = −',
      value: `${Math.min(...r.bids)}–${Math.max(...r.bids)}`,
    });
  }
  if (r.takeAllBonus && r.roundTotal > 0) {
    rows.push({ icon: 'plus', label: `Taking all ${r.roundTotal} points counts as`, value: String(r.roundTotal + 1) });
  }
  if (r.badMoveTakesAll && r.roundTotal > 0) {
    rows.push({ icon: 'close', label: 'Bad move', value: `All ${r.roundTotal}` });
  }
  if (r.resetScore) {
    rows.push({ icon: 'refresh', label: 'Next round starts from 0 after', value: `${r.resetAt ?? 100} pts` });
  }
  return rows;
}

/** The rules of a game as one list of icon, label and big value lines, instead of a paragraph. */
export function RulesInfographic({ rules }: { rules: GameRules }) {
  return (
    <View accessible accessibilityLabel={describeRules(rules)}>
      {rowsFor(rules).map((row, i) => (
        <View key={row.label} style={[styles.row, i > 0 && styles.divider]}>
          <Icon name={row.icon} size={20} color={colors.muted} strokeWidth={2} />
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 },
  divider: { borderTopWidth: 1, borderTopColor: colors.line },
  label: { flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.muted },
  value: { fontFamily: fonts.displayHeavy, fontSize: 22, letterSpacing: -0.3, color: colors.ink },
});
