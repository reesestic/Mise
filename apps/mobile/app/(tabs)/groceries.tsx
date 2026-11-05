import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/src/theme/colors';

export default function GroceriesScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.brand}>mise</Text>
        <Text style={styles.title}>Groceries</Text>
        <Text style={styles.subtitle}>One flexible list, connected to meals you might make.</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your list will live here</Text>
          <Text style={styles.body}>
            Suggested items will stay as proposals until you choose Add. You will be able to edit
            the shared list and see which meals each item supports.
          </Text>
        </View>
        <Text style={styles.note}>Items on this list are intended purchases, not Pantry stock.</Text>
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
  card: { backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: 20, padding: 18, marginTop: 24 },
  cardTitle: { color: colors.ink, fontSize: 17, fontWeight: '700' },
  body: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 8 },
  note: { color: colors.herb, fontSize: 13, lineHeight: 19, marginTop: 18 },
});
