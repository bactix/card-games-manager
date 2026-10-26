import Svg, { Circle, Path } from 'react-native-svg';
import type { GameSymbolName } from '../types';

export const GAME_SYMBOLS: { value: GameSymbolName; label: string }[] = [
  { value: 'spade', label: 'Spade' },
  { value: 'heart', label: 'Heart' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'club', label: 'Club' },
];

/** A filled card suit drawn on a 24-unit grid. */
export function GameSymbol({ symbol, size, color }: { symbol: GameSymbolName; size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      {symbol === 'spade' && (
        <Path d="M12 2.5c-3.2 4.3-7.5 6.5-7.5 10.7a4.2 4.2 0 0 0 6.7 3.3c-.2 1.9-.9 3.5-2.4 5h6.4c-1.5-1.5-2.2-3.1-2.4-5a4.2 4.2 0 0 0 6.7-3.3c0-4.2-4.3-6.4-7.5-10.7z" />
      )}
      {symbol === 'heart' && <Path d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z" />}
      {symbol === 'diamond' && <Path d="M12 2.5l7 9.5-7 9.5-7-9.5z" />}
      {symbol === 'club' && (
        <>
          <Circle cx="12" cy="7.5" r="4" />
          <Circle cx="7.2" cy="13.2" r="4" />
          <Circle cx="16.8" cy="13.2" r="4" />
          <Path d="M10.5 13h3l1.5 8h-6z" />
        </>
      )}
    </Svg>
  );
}
