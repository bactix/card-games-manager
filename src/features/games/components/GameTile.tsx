import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, tileShadow } from '@/lib/theme';
import type { GameSymbolName } from '../types';
import { GameSymbol } from './GameSymbol';

interface Props {
  name: string;
  color: string;
  symbol: GameSymbolName;
  size?: number;
  /** 'name' prints the game's name, 'symbol' draws its card suit. */
  variant?: 'name' | 'symbol';
}

/** The coloured rounded square that represents a game. */
export function GameTile({ name, color, symbol, size = 96, variant = 'name' }: Props) {
  return (
    <View style={[styles.tile, tileShadow, { width: size, height: size, backgroundColor: color }]}>
      {variant === 'name' ? (
        <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit>
          {name || 'Game'}
        </Text>
      ) : (
        <>
          <View style={styles.inner} />
          <GameSymbol symbol={symbol} size={size / 2} color={colors.onTile} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { borderRadius: 24, alignItems: 'center', justifyContent: 'center', padding: 6 },
  name: { fontFamily: fonts.displayHeavy, fontSize: 19, color: colors.onTile },
  inner: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 248, 234, 0.35)',
  },
});
