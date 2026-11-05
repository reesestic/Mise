import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/src/theme/colors';

export default function PantryScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.brand}>mise</Text>
        <Text style={styles.title}>Pantry</Text>
        <Text style={styles.subtitle}>A simple view of the food you actually own.</Text>
        <View style={styles.shelf}>
          <Text style={styles.shelfEmoji}>🥬  🥚  🥫</Text>
          <Text style={styles.shelfTitle}>Your shelves are ready</Text>
          <Text style={styles.body}>
            Add food you have at home to see Pantry-based meal ideas. Only confirmed owned food
            belongs here; your grocery list will stay separate.
          </Text>
        </View>
        <View style={styles.locationRow}>
          <View style={styles.location}><Text style={styles.locationLabel}>Fridge</Text></View>
          <View style={styles.location}><Text style={styles.locationLabel}>Freezer</Text></View>
          <View style={styles.location}><Text style={styles.locationLabel}>Cabinet</Text></View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: 22, paddingTop: 18 },
  brand: { color: colors.herb, fontSize: 27, fontWeight: '800' },
  title: { color: colors.ink, fontSize: 30, fontWeight: '800', marginTop: 28 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 6 },
  shelf: { alignItems: 'center', backgroundColor: colors.sage, borderRadius: 22, padding: 22, marginTop: 24 },
  shelfEmoji: { fontSize: 32, marginBottom: 14 },
  shelfTitle: { color: colors.deepHerb, fontSize: 18, fontWeight: '700' },
  body: { color: colors.ink, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 9 },
  locationRow: { flexDirection: 'row', gap: 9, marginTop: 18 },
  location: { flex: 1, backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  locationLabel: { color: colors.ink, fontSize: 13, fontWeight: '700' },
});
