export const colors = {
  bg: '#F3F4EF',
  card: '#FFFFFF',
  ink: '#16181D',
  muted: '#5B606B',
  faint: '#8A8F99',
  line: '#E2E4DD',
  segment: '#E6E8E1',
  accent: '#FF6B2C',
  danger: '#B42318',
  onTile: '#FFF8EA',
  leadBg: '#FFE3D3',
  lastBg: '#E8E9EE',
  lastRowBg: '#FFF4EC',
  darkCard: '#22252D',
  darkLine: '#343843',
  darkMuted: '#B9BDC6',
} as const;

export const fonts = {
  body: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  display: 'BricolageGrotesque_500Medium',
  displayBold: 'BricolageGrotesque_700Bold',
  displayHeavy: 'BricolageGrotesque_800ExtraBold',
} as const;

export const tileShadow = {
  shadowColor: '#16181D',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.18,
  shadowRadius: 10,
  elevation: 6,
} as const;
