import {
  BricolageGrotesque_500Medium,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { colors } from '@/lib/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    BricolageGrotesque_500Medium,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
  });

  // No splash: the launch screen goes away as soon as the first screen is drawn.
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  // The app opens straight on Home without waiting for the fonts. The key redraws it once they are
  // ready, so every text switches to its real font.
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        key={fontsLoaded ? 'fonts-ready' : 'fonts-loading'}
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}
      />
    </>
  );
}
