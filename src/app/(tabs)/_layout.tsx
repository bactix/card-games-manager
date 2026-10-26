import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Matches' }} />
      <Tabs.Screen name="gangs" options={{ title: 'Gangs' }} />
      <Tabs.Screen name="teams" options={{ title: 'Teams' }} />
      <Tabs.Screen name="games" options={{ title: 'Games' }} />
    </Tabs>
  );
}
