import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/lib/theme';
import { Icon, type IconName } from './Icon';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'accent' | 'ink' | 'outline' | 'outline-dark' | 'soft';
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  height?: number;
  fontSize?: number;
  disabled?: boolean;
}

const palette = {
  accent: { bg: colors.accent, fg: colors.ink, border: colors.accent },
  ink: { bg: colors.ink, fg: '#FFFFFF', border: colors.ink },
  outline: { bg: 'transparent', fg: colors.ink, border: colors.line },
  'outline-dark': { bg: 'transparent', fg: '#FFFFFF', border: colors.darkLine },
  soft: { bg: colors.bg, fg: colors.ink, border: colors.line },
} as const;

export function PrimaryButton({
  label,
  onPress,
  variant = 'accent',
  icon,
  iconPosition = 'right',
  height = 56,
  fontSize = 16,
  disabled,
}: Props) {
  const p = palette[variant];
  const iconEl = icon ? <Icon name={icon} size={18} color={p.fg} /> : null;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.base,
        { height, backgroundColor: p.bg, borderColor: p.border, opacity: disabled ? 0.4 : 1 },
      ]}
    >
      <View style={styles.row}>
        {iconPosition === 'left' && iconEl}
        <Text style={[styles.label, { color: p.fg, fontSize }]}>{label}</Text>
        {iconPosition === 'right' && iconEl}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontFamily: fonts.semibold },
});
