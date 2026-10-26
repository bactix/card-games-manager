import type { ColorValue } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'home'
  | 'games'
  | 'users'
  | 'back'
  | 'close'
  | 'plus'
  | 'minus'
  | 'check'
  | 'arrow-right'
  | 'chevron-right'
  | 'more'
  | 'undo'
  | 'play'
  | 'trophy'
  | 'refresh';

interface Props {
  name: IconName;
  size?: number;
  color: ColorValue;
  strokeWidth?: number;
}

function Shapes({ name, color }: { name: IconName; color: ColorValue }) {
  switch (name) {
    case 'home':
      return (
        <>
          <Path d="M3 11l9-8 9 8" />
          <Path d="M5 9.5V20h14V9.5" />
        </>
      );
    case 'games':
      return (
        <>
          <Rect x="3" y="3" width="7" height="7" rx="1.5" />
          <Rect x="14" y="3" width="7" height="7" rx="1.5" />
          <Rect x="3" y="14" width="7" height="7" rx="1.5" />
          <Rect x="14" y="14" width="7" height="7" rx="1.5" />
        </>
      );
    case 'users':
      return (
        <>
          <Circle cx="9" cy="8" r="3.5" />
          <Path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
          <Path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.2a6.5 6.5 0 0 1 3.5 5.8" />
        </>
      );
    case 'back':
      return <Path d="M15 6l-6 6 6 6" />;
    case 'close':
      return <Path d="M6 6l12 12M18 6L6 18" />;
    case 'plus':
      return <Path d="M12 5v14M5 12h14" />;
    case 'minus':
      return <Path d="M5 12h14" />;
    case 'check':
      return <Path d="M5 12.5l4.5 4.5L19 7.5" />;
    case 'arrow-right':
      return <Path d="M5 12h14M13 6l6 6-6 6" />;
    case 'chevron-right':
      return <Path d="M9 6l6 6-6 6" />;
    case 'more':
      return (
        <>
          <Circle cx="5" cy="12" r="1.6" fill={color} stroke="none" />
          <Circle cx="12" cy="12" r="1.6" fill={color} stroke="none" />
          <Circle cx="19" cy="12" r="1.6" fill={color} stroke="none" />
        </>
      );
    case 'undo':
      return (
        <>
          <Path d="M3 7v6h6" />
          <Path d="M3.5 13a9 9 0 1 0 2.6-6.4L3 9.5" />
        </>
      );
    case 'play':
      return <Path d="M7 4.5l13 7.5-13 7.5z" fill={color} stroke="none" />;
    case 'trophy':
      return (
        <>
          <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <Path d="M4 22h16M10 14.7V17c0 .6-.5 1-1 1.2C7.9 18.8 7 20.2 7 22M14 14.7V17c0 .6.5 1 1 1.2 1.1.6 2 2 2 3.8" />
          <Path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
        </>
      );
    case 'refresh':
      return (
        <>
          <Path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5" />
          <Path d="M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" />
        </>
      );
  }
}

export function Icon({ name, size = 20, color, strokeWidth = 2.2 }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Shapes name={name} color={color} />
    </Svg>
  );
}
