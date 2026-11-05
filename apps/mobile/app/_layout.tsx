import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { colors } from '@/src/theme/colors';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.canvas },
          headerTintColor: colors.herb,
          headerStyle: { backgroundColor: colors.canvas },
          headerTitleStyle: { color: colors.ink, fontWeight: '700' },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="meals/[id]" options={{ title: 'Recipe' }} />
      </Stack>
    </>
  );
}
