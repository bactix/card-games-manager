import { Pressable, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme';
import { Icon, type IconName } from './Icon';

interface Props {
  icon: IconName;
  label: string;
  onPress: () => void;
  size?: number;
  radius?: number;
  disabled?: boolean;
  dark?: boolean;
}

/** Round bordered icon button used in headers and action rows. */
export function IconButton({ icon, label, onPress, size = 44, radius, disabled, dark }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: radius ?? size / 2,
          borderColor: dark ? colors.darkLine : colors.line,
          backgroundColor: dark ? 'transparent' : colors.card,
          opacity: disabled ? 0.4 : 1,
        },
      ]}
    >
      <Icon name={icon} color={dark ? '#FFFFFF' : colors.ink} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
