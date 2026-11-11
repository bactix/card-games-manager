import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { colors, fonts } from '@/lib/theme';

export interface PodiumEntry {
  name: string;
  color: string;
  score: number;
}

const BLOCK = [
  { height: 112, color: colors.accent, text: colors.ink }, // 1st
  { height: 84, color: '#AEB4C0', text: colors.ink }, // 2nd
  { height: 62, color: '#C58A5B', text: colors.ink }, // 3rd
];

/** The top players on a podium. `entries` goes from 1st place down; at most the first three are shown. */
export function Podium({ entries }: { entries: PodiumEntry[] }) {
  const top = entries.slice(0, 3);
  // 2nd on the left, 1st in the middle, 3rd on the right
  const arranged = top.length >= 3 ? [1, 0, 2] : top.length === 2 ? [1, 0] : [0];

  return (
    <View style={styles.row} accessible accessibilityLabel={`Podium. ${top.map((e, i) => `${i + 1}. ${e.name}, ${e.score}`).join('. ')}`}>
      {arranged.map((place) => {
        const entry = top[place];
        const block = BLOCK[place];
        return (
          <View key={place} style={styles.column}>
            <Avatar name={entry.name} color={entry.color} size={place === 0 ? 52 : 44} />
            <Text style={styles.name} numberOfLines={1}>
              {entry.name}
            </Text>
            <Text style={styles.score}>{entry.score}</Text>
            <View style={[styles.block, { height: block.height, backgroundColor: block.color }]}>
              <Text style={[styles.place, { color: block.text }]}>{place + 1}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  column: { flex: 1, alignItems: 'center', gap: 4 },
  name: { fontFamily: fonts.semibold, fontSize: 14, color: '#FFFFFF', maxWidth: '100%' },
  score: { fontFamily: fonts.displayHeavy, fontSize: 18, color: colors.darkMuted, marginBottom: 4 },
  block: {
    width: '100%',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  place: { fontFamily: fonts.displayHeavy, fontSize: 40 },
});
