import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/lib/theme';

interface Props<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}

/** Two-or-more option switch. */
export function Segmented<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.track}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o.value)}
            style={[styles.segment, on && styles.segmentOn]}
          >
            <Text style={[styles.label, on ? styles.labelOn : styles.labelOff]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.segment,
    padding: 4,
    flexDirection: 'row',
    gap: 4,
  },
  segment: { flex: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  segmentOn: { backgroundColor: colors.card },
  label: { fontSize: 14 },
  labelOn: { fontFamily: fonts.semibold, color: colors.ink },
  labelOff: { fontFamily: fonts.medium, color: colors.muted },
});
