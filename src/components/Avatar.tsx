import { StyleSheet, Text, View } from 'react-native';
import { fonts } from '@/lib/theme';

interface Props {
  name: string;
  color: string;
  size?: number;
  /** White ring, used when avatars overlap. */
  ring?: boolean;
}

export function Avatar({ name, color, size = 40, ring }: Props) {
  return (
    <View
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        ring && styles.ring,
      ]}
    >
      <Text style={[styles.text, { fontSize: Math.round(size * 0.37) }]}>
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  ring: { borderWidth: 2, borderColor: '#FFFFFF' },
  text: { color: '#FFFFFF', fontFamily: fonts.semibold },
});
