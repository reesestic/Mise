import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { MealDbError, MealDbMeal, searchMeals } from '@/src/data/themealdb';
import { colors } from '@/src/theme/colors';

export default function CookNowScreen() {
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState<MealDbMeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSearch() {
    const searchTerm = query.trim();
    if (!searchTerm) {
      setMessage('Type an ingredient or meal name to explore recipes.');
      setMeals([]);
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setMessage('');
    try {
      const results = await searchMeals(searchTerm);
      setMeals(results);
      setMessage(results.length ? '' : 'No recipes found. Try another ingredient or dish.');
    } catch (error) {
      setMeals([]);
      setMessage(error instanceof MealDbError ? error.message : 'Recipe search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            <View style={styles.brandRow}>
              <View>
                <Text style={styles.brand}>mise</Text>
                <Text style={styles.eyebrow}>A little more thought in every shop.</Text>
              </View>
              <View style={styles.potBadge}>
                <Text style={styles.potEmoji}>🍲</Text>
              </View>
            </View>

            <Text style={styles.pageTitle}>Cook Now</Text>
            <Text style={styles.subtitle}>Find something good to make from what you have.</Text>

            <View style={styles.pantryNote}>
              <Text style={styles.noteTitle}>Your Pantry is the starting point</Text>
              <Text style={styles.noteBody}>
                Ready to Make options will use confirmed Pantry items. Recipe search below is broad
                discovery and does not mean a meal is ready yet.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Explore recipes</Text>
            <View style={styles.searchRow}>
              <TextInput
                accessibilityLabel="Search recipes"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
                placeholder="Try chicken, pasta, or curry"
                placeholderTextColor={colors.muted}
                returnKeyType="search"
                style={styles.searchInput}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Search TheMealDB recipes"
                onPress={handleSearch}
                style={({ pressed }) => [styles.searchButton, pressed && styles.pressed]}>
                <Text style={styles.searchButtonText}>Search</Text>
              </Pressable>
            </View>

            {loading ? (
              <View style={styles.statusRow}>
                <ActivityIndicator color={colors.herb} />
                <Text style={styles.statusText}>Looking through recipes…</Text>
              </View>
            ) : null}

            {!loading && message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}
            {!loading && !meals.length && !message ? (
              <Text style={styles.helperText}>Search the catalog to find a new idea.</Text>
            ) : null}

            {meals.length > 0 ? <Text style={styles.resultsHeading}>{meals.length} recipes</Text> : null}
          </>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/meals/[id]', params: { id: item.id } })}
            style={({ pressed }) => [styles.mealCard, pressed && styles.pressed]}>
            {item.thumbnailUrl ? (
              <Image source={{ uri: item.thumbnailUrl }} style={styles.mealImage} />
            ) : (
              <View style={[styles.mealImage, styles.imageFallback]}>
                <Text style={styles.potEmoji}>🥗</Text>
              </View>
            )}
            <View style={styles.mealText}>
              <Text style={styles.mealName}>{item.name}</Text>
              <Text style={styles.mealMeta}>
                {[item.category, item.cuisine].filter(Boolean).join(' · ') || 'Recipe idea'}
              </Text>
              <Text style={styles.mealAttribution}>Recipe data: TheMealDB</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        )}
        ListFooterComponent={meals.length ? <Text style={styles.footer}>Recipe data and images provided by TheMealDB.</Text> : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 32 },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  brand: { color: colors.herb, fontSize: 28, fontWeight: '800', letterSpacing: -1 },
  eyebrow: { color: colors.muted, fontSize: 12, marginTop: 1 },
  potBadge: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' },
  potEmoji: { fontSize: 24 },
  pageTitle: { color: colors.ink, fontSize: 30, fontWeight: '800', letterSpacing: -0.7 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 5 },
  pantryNote: { backgroundColor: colors.sage, borderRadius: 18, padding: 16, marginTop: 20, marginBottom: 25 },
  noteTitle: { color: colors.deepHerb, fontSize: 15, fontWeight: '700' },
  noteBody: { color: colors.ink, fontSize: 13, lineHeight: 19, marginTop: 6 },
  sectionTitle: { color: colors.ink, fontSize: 21, fontWeight: '700', marginBottom: 12 },
  searchRow: { flexDirection: 'row', gap: 9, marginBottom: 8 },
  searchInput: { flex: 1, backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, minHeight: 50, color: colors.ink, fontSize: 14 },
  searchButton: { backgroundColor: colors.herb, borderRadius: 14, minHeight: 50, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  searchButtonText: { color: colors.surface, fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.78 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 14 },
  statusText: { color: colors.muted, fontSize: 13 },
  message: { color: colors.deepHerb, fontSize: 13, lineHeight: 19, marginTop: 12 },
  helperText: { color: colors.muted, fontSize: 13, marginTop: 10 },
  resultsHeading: { color: colors.muted, fontSize: 12, fontWeight: '700', marginTop: 20, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.7 },
  mealCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 17, padding: 10, marginBottom: 10, borderColor: colors.line, borderWidth: 1 },
  mealImage: { width: 76, height: 76, borderRadius: 12, backgroundColor: colors.sage },
  imageFallback: { alignItems: 'center', justifyContent: 'center' },
  mealText: { flex: 1, paddingHorizontal: 12 },
  mealName: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  mealMeta: { color: colors.muted, fontSize: 12, marginTop: 4 },
  mealAttribution: { color: colors.herb, fontSize: 10, fontWeight: '600', marginTop: 6 },
  chevron: { color: colors.herb, fontSize: 27, paddingHorizontal: 6 },
  footer: { color: colors.muted, fontSize: 11, textAlign: 'center', marginTop: 8 },
});


