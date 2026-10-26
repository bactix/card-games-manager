import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/lib/theme';

interface Props {
  children: ReactNode;
  /** Leave room for the bottom safe area (screens without a tab bar). */
  bottomInset?: boolean;
  background?: string;
  style?: StyleProp<ViewStyle>;
}

/** Full-screen container that respects the device's safe areas. */
export function Screen({ children, bottomInset, background = colors.bg, style }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.root,
        { backgroundColor: background, paddingTop: insets.top, paddingBottom: bottomInset ? insets.bottom : 0 },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
