import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '@/lib/theme';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

/** Pill used to pick one option from a short list (games, gangs). */
export function Chip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected ? styles.on : styles.off]}
    >
      <Text style={[styles.label, { color: selected ? '#FFFFFF' : colors.ink }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { height: 44, paddingHorizontal: 16, borderRadius: 22, borderWidth: 1, justifyContent: 'center' },
  on: { backgroundColor: colors.ink, borderColor: colors.ink },
  off: { backgroundColor: colors.card, borderColor: colors.line },
  label: { fontFamily: fonts.semibold, fontSize: 14 },
});
