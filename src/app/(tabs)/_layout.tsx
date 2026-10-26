import { Tabs } from 'expo-router';
import { Icon } from '@/components/Icon';
import { colors, fonts } from '@/lib/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 12 },
        tabBarStyle: { backgroundColor: colors.bg, borderTopWidth: 0, elevation: 0 },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ color }) => <Icon name="home" size={22} color={color} strokeWidth={2} /> }}
      />
      <Tabs.Screen
        name="games"
        options={{ title: 'Games', tabBarIcon: ({ color }) => <Icon name="games" size={22} color={color} strokeWidth={2} /> }}
      />
      <Tabs.Screen
        name="gangs"
        options={{ title: 'Gangs', tabBarIcon: ({ color }) => <Icon name="users" size={22} color={color} strokeWidth={2} /> }}
      />
    </Tabs>
  );
}
