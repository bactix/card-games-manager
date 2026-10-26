import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts } from '@/lib/theme';
import { Icon } from './Icon';

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  /** When false the number is shown but only the buttons change it. */
  editable?: boolean;
  /** Background of the − and + buttons. */
  buttonBackground?: string;
}

/** A − [number] + control with a label above it. */
export function Stepper({
  label,
  value,
  onChange,
  step = 1,
  min = 1,
  max = 9999,
  editable = true,
  buttonBackground = colors.bg,
}: Props) {
  const [text, setText] = useState(String(value));
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  useEffect(() => {
    if (Number(text) !== value) setText(String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const change = (n: number) => onChange(clamp(n));

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label}`}
          onPress={() => change(value - step)}
          style={[styles.button, { backgroundColor: buttonBackground }]}
        >
          <Icon name="minus" color={colors.ink} strokeWidth={2.4} />
        </Pressable>
        {editable ? (
          <TextInput
            accessibilityLabel={label}
            style={styles.center}
            keyboardType="number-pad"
            value={text}
            onChangeText={(t) => {
              const digits = t.replace(/[^0-9]/g, '');
              setText(digits);
              if (digits) onChange(Number(digits));
            }}
            onBlur={() => {
              const n = clamp(Number(text) || min);
              setText(String(n));
              onChange(n);
            }}
          />
        ) : (
          <View style={styles.centerBox}>
            <Text style={styles.centerText}>{value}</Text>
          </View>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label}`}
          onPress={() => change(value + step)}
          style={[styles.button, { backgroundColor: buttonBackground }]}
        >
          <Icon name="plus" color={colors.ink} strokeWidth={2.4} />
        </Pressable>
      </View>
    </View>
  );
}

const centerBase = {
  flex: 1,
  height: 52,
  borderRadius: 14,
  borderWidth: 1.5,
  borderColor: colors.ink,
  backgroundColor: colors.card,
} as const;

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  label: { fontFamily: fonts.semibold, fontSize: 13, color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  button: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    ...centerBase,
    textAlign: 'center',
    fontFamily: fonts.displayHeavy,
    fontSize: 24,
    color: colors.ink,
    padding: 0,
  },
  centerBox: { ...centerBase, alignItems: 'center', justifyContent: 'center' },
  centerText: { fontFamily: fonts.displayHeavy, fontSize: 24, color: colors.ink },
});
