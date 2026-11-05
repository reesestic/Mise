import { Tabs } from 'expo-router';

import { colors } from '@/src/theme/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.herb,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Cook Now' }} />
      <Tabs.Screen name="groceries" options={{ title: 'Groceries' }} />
      <Tabs.Screen name="pantry" options={{ title: 'Pantry' }} />
    </Tabs>
  );
}
