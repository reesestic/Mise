import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';

import { getMealById, MealDbError, MealDbMeal } from '@/src/data/themealdb';
import { colors } from '@/src/theme/colors';

export default function MealDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const mealId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [meal, setMeal] = useState<MealDbMeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    async function loadMeal() {
      if (!mealId) {
        setMessage('This recipe could not be found.');
        setLoading(false);
        return;
      }
      try {
        const result = await getMealById(mealId);
        if (active) {
          setMeal(result);
          if (!result) setMessage('This recipe could not be found.');
        }
      } catch (error) {
        if (active) setMessage(error instanceof MealDbError ? error.message : 'Could not load this recipe.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadMeal();
    return () => { active = false; };
  }, [mealId]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Stack.Screen options={{ title: meal?.name ?? 'Recipe', headerBackTitle: 'Back' }} />
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? <ActivityIndicator color={colors.herb} size="large" /> : null}
        {!loading && message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}
        {meal ? (
          <>
            {meal.thumbnailUrl ? <Image source={{ uri: meal.thumbnailUrl }} style={styles.heroImage} /> : null}
            <Text style={styles.title}>{meal.name}</Text>
            <Text style={styles.meta}>{[meal.category, meal.cuisine].filter(Boolean).join(' · ')}</Text>
            <View style={styles.notice}>
              <Text style={styles.noticeText}>
                Catalog recipe. Check Pantry before deciding what you can cook; this page does not
                confirm that you own these ingredients.
              </Text>
            </View>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {meal.ingredients.map((ingredient, index) => (
              <View style={styles.ingredientRow} key={`${ingredient.name}-${index}`}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.measure}>{ingredient.measure || '—'}</Text>
              </View>
            ))}
            <Text style={styles.sectionTitle}>Instructions</Text>
            {meal.instructions.map((step, index) => (
              <View style={styles.stepRow} key={`${index}-${step.slice(0, 12)}`}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
            <Text
              accessibilityRole="link"
              onPress={() => Linking.openURL('https://www.themealdb.com')}
              style={styles.attribution}>
              Recipe data and imagery by TheMealDB
            </Text>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: 20, paddingBottom: 40 },
  heroImage: { width: '100%', aspectRatio: 1.45, borderRadius: 20, backgroundColor: colors.sage },
  title: { color: colors.ink, fontSize: 27, lineHeight: 33, fontWeight: '800', marginTop: 18 },
  meta: { color: colors.muted, fontSize: 13, marginTop: 5 },
  notice: { backgroundColor: colors.sage, borderRadius: 15, padding: 14, marginTop: 18 },
  noticeText: { color: colors.deepHerb, fontSize: 13, lineHeight: 19 },
  sectionTitle: { color: colors.ink, fontSize: 20, fontWeight: '700', marginTop: 24, marginBottom: 10 },
  ingredientRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 11, borderBottomColor: colors.line, borderBottomWidth: 1 },
  ingredientName: { color: colors.ink, fontSize: 14, flex: 1 },
  measure: { color: colors.muted, fontSize: 13, marginLeft: 16 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  stepNumber: { color: colors.herb, fontWeight: '800', fontSize: 14, width: 24, paddingTop: 1 },
  stepText: { color: colors.ink, fontSize: 14, lineHeight: 21, flex: 1 },
  attribution: { color: colors.herb, fontSize: 12, fontWeight: '700', marginTop: 18 },
  message: { color: colors.deepHerb, fontSize: 14, lineHeight: 20 },
});


