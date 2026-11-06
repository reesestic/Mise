import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { MealDbError, MealDbMeal, searchMeals } from '@/src/data/themealdb';
import { colors } from '@/src/theme/colors';

type Section = 'ready' | 'almost' | 'explore';
type SampleMeal = {
  id: string; name: string; image: string; time: string; tags: string[]; badge: 'crown' | 'new' | 'tried';
  status: string; cleanup: number; ingredients: string[]; missing?: string[]; equipment: string; macros: string;
  instructions: string[]; swap?: string; cost: number;
};

const sampleMeals: Record<Section, SampleMeal[]> = {
  ready: [
    { id: 'r1', name: 'Spicy Arrabbiata Penne', image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg', time: '25 min', tags: ['Italian', 'Fastest'], badge: 'crown', status: 'Top pick for you', cleanup: 2, ingredients: ['Penne', 'Tomatoes', 'Garlic', 'Olive oil', 'Basil', 'Chili flakes'], equipment: 'Pot · skillet', macros: '420 cal · 14g protein', instructions: ['Boil the pasta until just tender.', 'Warm olive oil, then soften garlic and chili.', 'Stir in tomatoes and basil; toss with pasta.'], cost: 4.2 },
    { id: 'r2', name: 'Crispy Chickpea Bowl', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=82', time: '20 min', tags: ['High Fiber', 'Low Cleanup'], badge: 'new', status: 'New for you', cleanup: 1, ingredients: ['Chickpeas', 'Cucumber', 'Greens', 'Lemon', 'Yogurt'], equipment: 'Sheet pan · bowl', macros: '390 cal · 18g protein', instructions: ['Roast seasoned chickpeas until crisp.', 'Chop cucumber and greens.', 'Layer everything in a bowl with lemon yogurt.'], cost: 6.4 },
    { id: 'r3', name: 'Cozy Garden Soup', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82', time: '30 min', tags: ['Low Carb', 'Vegetarian'], badge: 'tried', status: 'Tried before', cleanup: 2, ingredients: ['Carrot', 'Celery', 'Tomatoes', 'Stock', 'Herbs'], equipment: 'Soup pot', macros: '280 cal · 9g protein', instructions: ['Soften vegetables in a little oil.', 'Add stock and tomatoes; simmer until tender.', 'Season with herbs and serve warm.'], cost: 5.1 },
    { id: 'r4', name: 'Lemon Herb Pasta', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=82', time: '22 min', tags: ['Fastest', 'Italian'], badge: 'crown', status: 'Top pick for you', cleanup: 2, ingredients: ['Pasta', 'Lemon', 'Spinach', 'Parmesan'], equipment: 'Pot · zester', macros: '440 cal · 17g protein', instructions: ['Cook pasta and reserve a little water.', 'Fold in spinach, lemon, and cheese.', 'Loosen with pasta water and serve.'], cost: 4.8 },
  ],
  almost: [
    { id: 'a1', name: 'Lemon Chicken Plate', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=82', time: '28 min', tags: ['High Protein', 'Low Cleanup'], badge: 'new', status: 'New for you', cleanup: 2, missing: ['Chicken', 'Broccoli'], ingredients: ['Rice', 'Lemon', 'Garlic', 'Chicken', 'Broccoli'], equipment: 'Sheet pan · pot', macros: '510 cal · 39g protein', swap: 'No broccoli? Green beans could work in this sample recipe.', instructions: ['Cook rice according to its package.', 'Roast chicken and broccoli with lemon and garlic.', 'Serve together with pan juices.'], cost: 7.3 },
    { id: 'a2', name: 'Greek Tomato Toast', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=82', time: '12 min', tags: ['Fastest', 'Greek'], badge: 'tried', status: 'Tried before', cleanup: 1, missing: ['Feta'], ingredients: ['Bread', 'Tomatoes', 'Olive oil', 'Feta'], equipment: 'Toaster · knife', macros: '330 cal · 12g protein', swap: 'No feta? A little ricotta is shown as a sample swap.', instructions: ['Toast the bread.', 'Chop tomatoes and dress with olive oil.', 'Pile onto toast and finish with feta.'], cost: 3.9 },
    { id: 'a3', name: 'One-Pan Salmon', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=82', time: '24 min', tags: ['High Protein', 'Low Carb'], badge: 'crown', status: 'Top pick for you', cleanup: 3, missing: ['Salmon', 'Green beans', 'Lemon'], ingredients: ['Potatoes', 'Salmon', 'Green beans', 'Lemon'], equipment: 'Sheet pan', macros: '540 cal · 36g protein', swap: 'Sample swap: asparagus could stand in for green beans.', instructions: ['Start potatoes on a sheet pan.', 'Add salmon and vegetables.', 'Roast until cooked through; finish with lemon.'], cost: 9.2 },
    { id: 'a4', name: 'Creamy Mushroom Orzo', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=82', time: '27 min', tags: ['Comfort', 'Vegetarian'], badge: 'new', status: 'New for you', cleanup: 2, missing: ['Mushrooms', 'Cream'], ingredients: ['Orzo', 'Mushrooms', 'Cream', 'Stock', 'Parmesan'], equipment: 'Deep skillet', macros: '470 cal · 16g protein', swap: 'Sample swap: milk can replace cream for a lighter sauce.', instructions: ['Toast the orzo in a little oil.', 'Add stock gradually and stir until tender.', 'Fold in mushrooms, cream, and parmesan.'], cost: 6.8 },
  ],
  explore: [
    { id: 'e1', name: 'Roasted Veggie Flatbread', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=82', time: '35 min', tags: ['Vegetarian', 'Comfort'], badge: 'new', status: 'New for you', cleanup: 3, missing: ['Flatbread', 'Zucchini', 'Pepper', 'Feta'], ingredients: ['Flatbread', 'Zucchini', 'Pepper', 'Feta', 'Tomato sauce'], equipment: 'Oven · sheet pan', macros: '460 cal · 19g protein', instructions: ['Spread sauce over flatbread.', 'Add vegetables and feta.', 'Bake until crisp at the edges.'], cost: 5.6 },
    { id: 'e2', name: 'Golden Coconut Curry', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82', time: '40 min', tags: ['Low Carb', 'High Fiber'], badge: 'tried', status: 'Tried before', cleanup: 3, missing: ['Coconut milk', 'Curry paste', 'Lentils', 'Spinach'], ingredients: ['Coconut milk', 'Curry paste', 'Lentils', 'Spinach', 'Onion'], equipment: 'Soup pot', macros: '430 cal · 20g protein', instructions: ['Soften onion and curry paste.', 'Add lentils and coconut milk; simmer.', 'Fold in spinach before serving.'], cost: 6.1 },
    { id: 'e3', name: 'Berry Yogurt Parfait', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=82', time: '8 min', tags: ['Dessert', 'Fastest'], badge: 'crown', status: 'Top pick for you', cleanup: 1, missing: ['Berries', 'Granola', 'Honey', 'Yogurt'], ingredients: ['Berries', 'Granola', 'Honey', 'Yogurt'], equipment: 'Glass · spoon', macros: '290 cal · 13g protein', instructions: ['Layer yogurt and berries in a glass.', 'Add granola between layers.', 'Finish with a little honey.'], cost: 2.9 },
    { id: 'e4', name: 'Herby Stuffed Peppers', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=82', time: '45 min', tags: ['High Fiber', 'Vegetarian'], badge: 'new', status: 'New for you', cleanup: 3, missing: ['Bell peppers', 'Rice', 'Beans', 'Parsley'], ingredients: ['Bell peppers', 'Rice', 'Beans', 'Parsley', 'Tomato'], equipment: 'Oven · baking dish', macros: '380 cal · 15g protein', instructions: ['Cook rice and mix with beans and herbs.', 'Fill the peppers.', 'Bake until tender.'], cost: 4.7 },
  ],
};

const filterGroups = [
  { id: 'type', title: 'Meal Type', options: ['Quick meal', 'Snack', 'Dessert'] },
  { id: 'time', title: 'Time', options: ['Fastest', 'Under 15 min', 'Under 30 min'] },
  { id: 'effort', title: 'Effort', options: ['Low cleanup', 'One pot/pan', 'Few appliances', 'No-cook'] },
  { id: 'cuisine', title: 'Cuisine', options: ['Italian', 'Greek', 'German', 'Spanish', 'Japanese', 'Indian'] },
  { id: 'diet', title: 'Diet', options: ['Vegetarian', 'Vegan', 'Keto', 'Low carb'] },
  { id: 'nutrition', title: 'Nutrition', options: ['High protein', 'Low protein', 'High calorie', 'Low calorie', 'High fiber'] },
  { id: 'budget', title: 'Budget', options: ['Under $5/serving', 'Under $10/serving', 'Under $15/serving', 'Under $20/serving'] },
];

function matchesOption(meal: SampleMeal, option: string) {
  const tags = meal.tags.map((tag) => tag.toLowerCase());
  const minutes = Number(meal.time.match(/\d+/)?.[0] ?? 999);
  const protein = Number(meal.macros.match(/(\d+)g protein/i)?.[1] ?? 0);
  const calories = Number(meal.macros.match(/(\d+) cal/i)?.[1] ?? 0);
  if (option === 'Quick meal') return minutes <= 30;
  if (option === 'Snack') return /toast|parfait|bowl/i.test(meal.name) || tags.includes('snack');
  if (option === 'Dessert') return tags.includes('dessert') || /parfait|dessert/i.test(meal.name);
  if (option === 'Fastest' || option === 'Under 15 min') return minutes <= 15;
  if (option === 'Under 30 min') return minutes <= 30;
  if (option === 'Low cleanup') return meal.cleanup <= 2;
  if (option === 'One pot/pan') return /pot|pan|skillet/i.test(meal.equipment);
  if (option === 'Few appliances') return meal.equipment.split(/[·,]/).filter(Boolean).length <= 1;
  if (option === 'No-cook') return minutes <= 10;
  if (['Italian', 'Greek', 'German', 'Spanish', 'Japanese', 'Indian'].includes(option)) return tags.includes(option.toLowerCase());
  if (option === 'Vegetarian') return tags.includes('vegetarian');
  if (option === 'Vegan') return tags.includes('vegan');
  if (option === 'Keto' || option === 'Low carb') return tags.includes('low carb') || tags.includes('keto');
  if (option === 'High protein') return protein >= 25;
  if (option === 'Low protein') return protein > 0 && protein < 15;
  if (option === 'High calorie') return calories >= 500;
  if (option === 'Low calorie') return calories > 0 && calories < 350;
  if (option === 'High fiber') return tags.includes('high fiber') || /chickpea|lentil|bean/i.test(meal.ingredients.join(' '));
  if (option.startsWith('Under $')) return meal.cost < Number(option.match(/\$(\d+)/)?.[1] ?? 0);
  return true;
}

export default function CookNowScreen() {
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [apiMeals, setApiMeals] = useState<MealDbMeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [filterOpen, setFilterOpen] = useState<string | null>(null);
  const [meal, setMeal] = useState<SampleMeal | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [insightOpen, setInsightOpen] = useState(false);
  const cardWidth = Math.max(152, Math.min(190, (width - 45) / 2));

  const visibleMeals = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = (section: Section) => sampleMeals[section].filter((item) => {
      const queryMatch = !q || `${item.name} ${item.tags.join(' ')} ${item.ingredients.join(' ')}`.toLowerCase().includes(q);
      const filtersMatch = filterGroups.every((group) => {
        const choices = selected[group.id] ?? [];
        return !choices.length || choices.some((option) => matchesOption(item, option));
      });
      return queryMatch && filtersMatch;
    });
    return { ready: filtered('ready'), almost: filtered('almost'), explore: filtered('explore') };
  }, [query, selected]);

  async function searchCatalog() {
    const text = query.trim();
    if (!text) {
      setApiMessage('Type an ingredient or meal name to search TheMealDB.');
      setApiMeals([]);
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    setApiMessage('');
    try {
      const results = await searchMeals(text);
      setApiMeals(results);
      setApiMessage(results.length ? '' : 'No TheMealDB recipes found for that search.');
    } catch (error) {
      setApiMeals([]);
      setApiMessage(error instanceof MealDbError ? error.message : 'Recipe search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function toggleOption(groupId: string, option: string) {
    setSelected((current) => {
      const active = current[groupId] ?? [];
      const next = groupId === 'budget'
        ? (active.includes(option) ? [] : [option])
        : (active.includes(option) ? active.filter((item) => item !== option) : [...active, option]);
      return { ...current, [groupId]: next };
    });
  }

  function openMeal(item: SampleMeal) {
    setMeal(item);
    setShowInstructions(false);
    setShowChecklist(false);
    setCheckedItems(item.missing ?? []);
  }

  function renderCarousel(title: string, subtitle: string, section: Section, icon?: string) {
    const list = visibleMeals[section];
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}><View style={styles.sectionHeading}><Text style={styles.sectionTitle}>{title}{icon ? <Text style={styles.titleExclaim}>{icon}</Text> : null}</Text><Text style={styles.sectionSubtitle}>{subtitle}</Text></View><Pressable onPress={() => Alert.alert(title, 'This is a sample carousel. Full browse view is a later screen.')}><Text style={styles.seeAll}>{section === 'explore' ? 'Explore all →' : 'See all →'}</Text></Pressable></View>
        {list.length ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {list.map((item) => (
            <Pressable key={item.id} onPress={() => openMeal(item)} style={({ pressed }) => [styles.mealCard, { width: cardWidth }, section === 'almost' && styles.almostCard, pressed && styles.pressed]}>
              <View style={styles.photoWrap}><Image source={{ uri: item.image }} style={styles.mealPhoto} /><View style={[styles.badge, item.badge === 'new' && styles.newBadge, item.badge === 'tried' && styles.triedBadge]}><Text style={styles.badgeText}>{item.badge === 'crown' ? '♛' : item.badge === 'new' ? '●' : '↻'}</Text></View></View>
              <Text numberOfLines={2} style={styles.mealName}>{item.name}</Text>
              <View style={styles.mealMeta}><Text style={styles.mealTime}>◷ {item.time}</Text>{section === 'almost' ? <Text style={styles.missingText}>{item.missing?.length} missing</Text> : null}</View>
              <View style={styles.tags}>{item.tags.slice(0, 2).map((tag, index) => <Text key={tag} numberOfLines={1} style={[styles.mealTag, index === 1 && styles.altTag]}>{tag}</Text>)}</View>
              {section === 'almost' ? <Text numberOfLines={1} style={styles.missingMini}>＋ {item.missing?.length} to go · {item.missing?.slice(0, 2).join(' + ')}</Text> : null}
            </Pressable>
          ))}
        </ScrollView> : <Text style={styles.empty}>No sample meals match those filters.</Text>}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.screen}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={(event) => setCollapsed(event.nativeEvent.contentOffset.y > 82)}
        scrollEventThrottle={16}>
        <View style={styles.intro}>
          <Text style={styles.brand}>No Crumbs</Text>
          <View style={styles.welcome}><Text style={styles.welcomeTitle}>Your Kitchen</Text><Text style={styles.welcomeTagline}>Click it, make it, love it!</Text></View>
          <Pressable accessibilityRole="button" accessibilityLabel="Profile" onPress={() => Alert.alert('Profile', 'Profile settings are a later screen.')} style={styles.profile}><Text style={styles.profileText}>R</Text></Pressable>
        </View>
        <View style={styles.stickyTools}>
          <View style={[styles.moodPanel, collapsed && styles.moodPanelCollapsed]}>
            {!collapsed ? <View style={styles.ollyBadge}><Image source={require('../../assets/images/olly-pot.png')} style={styles.olly} resizeMode="contain" /></View> : null}
            <View style={[styles.moodBar, collapsed && styles.moodBarCollapsed]}>
              <TextInput accessibilityLabel="What are you in the mood for?" value={query} onChangeText={setQuery} onSubmitEditing={searchCatalog} returnKeyType="search" placeholder="What are you in the mood for?" placeholderTextColor="#9B9E93" style={styles.moodInput} />
              <Pressable accessibilityRole="button" accessibilityLabel="Voice input preview" onPress={() => Alert.alert('Voice input', 'Voice input is a later feature.')} style={styles.mic}><Text style={styles.micText}>⌁</Text></Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Search meals" onPress={searchCatalog} style={styles.send}><Text style={styles.sendText}>↗</Text></Pressable>
            </View>
          </View>
          {!collapsed ? <Text style={styles.filterHeading}>How about something like...</Text> : null}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterNav}>
            {filterGroups.map((group) => {
              const count = selected[group.id]?.length ?? 0;
              return <Pressable key={group.id} onPress={() => setFilterOpen(group.id)} style={[styles.filterLabel, count > 0 && styles.filterLabelActive]}><Text style={[styles.filterLabelText, count > 0 && styles.filterLabelTextActive]}>{group.title}{count ? `  ${count}` : ''}  ⌄</Text></Pressable>;
            })}
          </ScrollView>
        </View>

        <View style={styles.feed}>
          {renderCarousel('Ready to Make!', 'Good ideas for right now', 'ready')}
          {renderCarousel('Almost There', 'One to three little things away', 'almost', '!')}
          <View style={styles.insight}>
            <View style={styles.insightTop}><View style={styles.ollyMini}><Image source={require('../../assets/images/olly-pot.png')} style={styles.ollyMiniImage} resizeMode="contain" /></View><View style={styles.insightCopy}><Text style={styles.insightEyebrow}>OLLY SAYS</Text><Text style={styles.insightTitle}>Add chicken + a green veg</Text><Text style={styles.insightBody}>and you could unlock five more meal ideas.</Text></View></View>
            <Pressable onPress={() => setInsightOpen((open) => !open)} style={styles.insightButton}><Text style={styles.insightButtonText}>{insightOpen ? 'Hide meal ideas ↑' : 'See the meals this could unlock ↓'}</Text></Pressable>
            {insightOpen ? <View style={styles.unlockGrid}>{[...visibleMeals.almost, ...visibleMeals.explore].slice(0, 4).map((item) => <Pressable key={item.id} onPress={() => openMeal(item)} style={styles.unlockCard}><Image source={{ uri: item.image }} style={styles.unlockImage} /><View style={styles.unlockCopy}><Text numberOfLines={2} style={styles.unlockName}>{item.name}</Text><Text numberOfLines={1} style={styles.unlockMissing}>Missing: {item.missing?.slice(0, 2).join(', ') || 'none'}</Text></View></Pressable>)}</View> : null}
          </View>
          {renderCarousel('Explore These Meals', 'A little farther from the Pantry, still worth a look', 'explore')}
          <View style={styles.apiResults}>
            <Text style={styles.apiHeading}>Explore recipes</Text>
            {loading ? <View style={styles.loading}><ActivityIndicator color={colors.herb} /><Text style={styles.helper}>Searching TheMealDB…</Text></View> : null}
            {!loading && apiMessage ? <Text accessibilityRole="alert" style={styles.helper}>{apiMessage}</Text> : null}
            {apiMeals.map((item) => <Pressable key={item.id} onPress={() => router.push({ pathname: '/meals/[id]', params: { id: item.id } })} style={({ pressed }) => [styles.apiMeal, pressed && styles.pressed]}>
              {item.thumbnailUrl ? <Image source={{ uri: item.thumbnailUrl }} style={styles.apiImage} /> : <View style={[styles.apiImage, styles.imageFallback]}><Text>🥗</Text></View>}
              <View style={styles.apiCopy}><Text style={styles.apiName}>{item.name}</Text><Text style={styles.apiMeta}>{[item.category, item.cuisine].filter(Boolean).join(' · ') || 'Recipe idea'}</Text><Text style={styles.attribution}>Recipe data: TheMealDB</Text></View><Text style={styles.apiChevron}>›</Text>
            </Pressable>)}
            {apiMeals.length ? <Text style={styles.attributionFooter}>Recipe data and images provided by TheMealDB.</Text> : null}
          </View>
        </View>
      </ScrollView>

      <Modal visible={filterOpen !== null} transparent animationType="fade" onRequestClose={() => setFilterOpen(null)}>
        <View style={styles.filterScrim}><Pressable style={StyleSheet.absoluteFill} onPress={() => setFilterOpen(null)} /><View style={styles.filterSheet}>
          <View style={styles.filterSheetHead}><Text style={styles.filterSheetTitle}>{filterGroups.find((group) => group.id === filterOpen)?.title}</Text><Pressable onPress={() => filterOpen && setSelected((current) => ({ ...current, [filterOpen]: [] }))}><Text style={styles.clearFilter}>Clear</Text></Pressable></View>
          <ScrollView style={styles.optionsScroll}>
            {(filterGroups.find((group) => group.id === filterOpen)?.options ?? []).map((option) => {
              const active = (selected[filterOpen ?? ''] ?? []).includes(option);
              return <Pressable key={option} onPress={() => filterOpen && toggleOption(filterOpen, option)} style={styles.filterOption}><View style={[styles.checkBox, active && styles.checkBoxActive]}><Text style={styles.checkText}>{active ? '✓' : ''}</Text></View><Text style={styles.filterOptionText}>{option}</Text></Pressable>;
            })}
            {filterOpen === 'budget' ? <Text style={styles.budgetNote}>Estimated cost per serving only. Real prices need reliable ingredient and price data.</Text> : null}
          </ScrollView>
          <Pressable onPress={() => setFilterOpen(null)} style={styles.doneButton}><Text style={styles.doneText}>Done</Text></Pressable>
        </View></View>
      </Modal>

      <Modal visible={!!meal} transparent animationType="fade" onRequestClose={() => setMeal(null)}>
        <View style={styles.mealScrim}><Pressable style={StyleSheet.absoluteFill} onPress={() => setMeal(null)} /><View style={styles.mealModal}>
          <View style={styles.modalTop}><Pressable onPress={() => { setMeal(null); setShowChecklist(false); }} style={styles.backButton}><Text style={styles.backText}>← Back</Text></Pressable><Text style={styles.modalKind}>{showChecklist ? 'GROCERY PREVIEW' : meal?.missing?.length ? 'ALMOST THERE' : 'READY TO MAKE'}</Text></View>
          {showChecklist ? <>
            <Text style={styles.modalTitle}>Add ingredients</Text><Text style={styles.modalHelper}>Missing items are selected. Choose any extras you want.</Text>
            <ScrollView style={styles.checklist}>{meal?.ingredients.map((ingredient) => {const active = checkedItems.includes(ingredient);return <Pressable key={ingredient} onPress={() => setCheckedItems((current) => active ? current.filter((item) => item !== ingredient) : [...current, ingredient])} style={styles.checkRow}><View style={[styles.checkBox, active && styles.checkBoxActive]}><Text style={styles.checkText}>{active ? '✓' : ''}</Text></View><Text style={styles.checkIngredient}>{ingredient}</Text><Text style={styles.checkStatus}>{meal?.missing?.includes(ingredient) ? 'missing' : 'in Pantry'}</Text></Pressable>;})}</ScrollView>
            <View style={styles.modalActions}><Pressable onPress={() => setShowChecklist(false)} style={[styles.actionButton, styles.secondaryAction]}><Text style={styles.secondaryText}>Back</Text></Pressable><Pressable onPress={() => Alert.alert('Preview only', `${checkedItems.length} items selected. Grocery list saving is not connected yet.`)} style={[styles.actionButton, styles.primaryAction]}><Text style={styles.primaryText}>Add selected</Text></Pressable></View>
          </> : <>
            <ScrollView style={styles.detailScroll} contentContainerStyle={styles.detailContent}>
              {showInstructions ? <><Text style={styles.modalTitle}>{meal?.name}</Text><Text style={styles.detailSubhead}>INSTRUCTIONS</Text>{meal?.instructions.map((step, index) => <View key={`${index}-${step}`} style={styles.step}><Text style={styles.stepNumber}>{index + 1}</Text><Text style={styles.stepText}>{step}</Text></View>)}<Pressable onPress={() => setShowInstructions(false)} style={styles.flipButton}><Text style={styles.flipText}>↻ Flip back to details</Text></Pressable></> : <>
                <Text style={styles.modalTitle}>{meal?.name}</Text>{meal?.image ? <Image source={{ uri: meal.image }} style={styles.detailPhoto} /> : null}
                <View style={styles.detailColumns}><View style={styles.ingredientColumn}><Text style={styles.detailSubhead}>INGREDIENTS</Text>{meal?.ingredients.map((ingredient) => {const missing = meal.missing?.includes(ingredient);return <Text key={ingredient} style={[styles.ingredient, missing && styles.missingIngredient]}>{ingredient}{missing ? '  ＋' : ''}</Text>;})}{meal?.swap ? <Text style={styles.swapNote}>Olly’s swap thought: {meal.swap}</Text> : null}</View><View style={styles.metricColumn}><Metric label="TIME" value={meal?.time ?? '—'} /><Metric label={`CLEANUP · ${meal?.cleanup}/5`} value="🟢  ● ● ● ●" /><Metric label="APPLIANCES" value={meal?.equipment ?? '—'} /><Metric label="MACROS · SAMPLE" value={meal?.macros ?? '—'} /></View></View>
                <Pressable onPress={() => setShowInstructions(true)} style={styles.flipButton}><Text style={styles.flipText}>↻ See instructions</Text></Pressable>
              </>}
            </ScrollView>
            <View style={styles.modalActions}><Pressable onPress={() => setMeal(null)} style={[styles.actionButton, styles.secondaryAction]}><Text style={styles.secondaryText}>Back</Text></Pressable><Pressable onPress={() => meal?.missing?.length ? setShowChecklist(true) : Alert.alert('Cook Now', 'Cooking flow is a later screen. Your Pantry will not change until you confirm cooking.')} style={[styles.actionButton, styles.primaryAction]}><Text style={styles.primaryText}>{meal?.missing?.length ? '＋ Add missing items' : 'Cook Now'}</Text></Pressable></View>
          </>}
        </View></View>
      </Modal>
    </SafeAreaView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas }, screen: { flex: 1, backgroundColor: colors.canvas },
  intro: { height: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, backgroundColor: colors.canvas },
  brand: { width: 95, color: colors.herb, fontSize: 19, fontWeight: '900', letterSpacing: -0.8 }, welcome: { alignItems: 'center', flex: 1 }, welcomeTitle: { color: colors.ink, fontSize: 17, lineHeight: 19, fontWeight: '900' }, welcomeTagline: { color: colors.muted, fontSize: 9, fontWeight: '700', marginTop: 2 }, profile: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#D8CDB9', backgroundColor: '#F3E8D5', alignItems: 'center', justifyContent: 'center' }, profileText: { color: colors.deepHerb, fontWeight: '900' },
  stickyTools: { paddingTop: 4, paddingBottom: 7, backgroundColor: colors.canvas, zIndex: 10 }, moodPanel: { height: 112, paddingHorizontal: 13, paddingLeft: 47, justifyContent: 'center' }, moodPanelCollapsed: { height: 53, paddingLeft: 13 }, moodBar: { height: 67, flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: 43, paddingRight: 8, borderWidth: 1.5, borderColor: '#D9DFD1', borderRadius: 25, backgroundColor: colors.surface }, moodBarCollapsed: { height: 43, paddingLeft: 10, borderRadius: 16 }, ollyBadge: { position: 'absolute', left: 8, top: 15, zIndex: 2, width: 83, height: 83, borderRadius: 42, borderWidth: 3, borderColor: colors.canvas, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.butter, overflow: 'hidden' }, olly: { width: '116%', height: '116%' }, moodInput: { flex: 1, minWidth: 0, color: colors.ink, fontSize: 12, fontWeight: '700', paddingVertical: 0 }, mic: { width: 33, height: 33, borderRadius: 11, backgroundColor: '#F6F0E5', alignItems: 'center', justifyContent: 'center' }, micText: { color: colors.herb, fontSize: 17 }, send: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.herb, alignItems: 'center', justifyContent: 'center' }, sendText: { color: '#FFFFFF', fontSize: 17, fontWeight: '900' }, filterHeading: { color: colors.muted, fontSize: 10, fontWeight: '800', marginLeft: 17, marginBottom: 4 }, filterNav: { gap: 6, paddingHorizontal: 14, paddingBottom: 1 }, filterLabel: { borderWidth: 1, borderColor: '#E1DACC', borderRadius: 17, backgroundColor: '#FFFDF8', paddingHorizontal: 9, paddingVertical: 6 }, filterLabelActive: { borderColor: colors.deepHerb, backgroundColor: '#E9F1E8' }, filterLabelText: { color: '#596860', fontSize: 9, fontWeight: '900' }, filterLabelTextActive: { color: colors.deepHerb },
  feed: { paddingTop: 8, paddingBottom: 28 }, section: { marginBottom: 18 }, sectionHeader: { minHeight: 39, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, paddingHorizontal: 16, marginBottom: 8 }, sectionHeading: { flex: 1 }, sectionTitle: { color: colors.ink, fontSize: 19, lineHeight: 22, fontWeight: '900', letterSpacing: -0.7 }, titleExclaim: { color: colors.apricot, fontSize: 19 }, sectionSubtitle: { color: colors.muted, fontSize: 9, fontWeight: '700', marginTop: 2 }, seeAll: { color: colors.herb, fontSize: 9, fontWeight: '900', paddingBottom: 3 }, carousel: { gap: 9, paddingHorizontal: 16, paddingBottom: 5 }, mealCard: { minHeight: 248, padding: 8, borderWidth: 1, borderColor: colors.line, borderRadius: 18, backgroundColor: colors.surface }, almostCard: { minHeight: 263 }, photoWrap: { position: 'relative' }, mealPhoto: { width: '100%', height: 105, borderRadius: 12, backgroundColor: '#E8E4D4' }, badge: { position: 'absolute', top: 5, left: 5, minWidth: 24, height: 24, paddingHorizontal: 6, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFDF0', color: '#8B6F21' }, newBadge: { backgroundColor: '#E4F3DD' }, triedBadge: { backgroundColor: '#FFFDF0' }, badgeText: { color: colors.deepHerb, fontSize: 12, fontWeight: '900' }, mealName: { minHeight: 28, color: colors.ink, fontSize: 12, lineHeight: 14, fontWeight: '900', marginTop: 7 }, mealMeta: { flexDirection: 'row', justifyContent: 'space-between', gap: 4, marginTop: 3 }, mealTime: { color: colors.muted, fontSize: 8, fontWeight: '800' }, missingText: { color: colors.tomato, fontSize: 8, fontWeight: '900' }, tags: { flexDirection: 'row', gap: 4, marginTop: 7 }, mealTag: { maxWidth: '50%', overflow: 'hidden', borderRadius: 20, paddingHorizontal: 6, paddingVertical: 4, backgroundColor: colors.sage, color: colors.deepHerb, fontSize: 7, fontWeight: '900' }, altTag: { backgroundColor: '#FBEFBC', color: '#75611E' }, missingMini: { color: colors.tomato, fontSize: 7, fontWeight: '900', marginTop: 6 }, empty: { paddingHorizontal: 18, paddingVertical: 12, color: colors.muted, fontSize: 11 }, pressed: { opacity: 0.8 },
  insight: { marginHorizontal: 15, marginBottom: 19, padding: 12, borderWidth: 1, borderColor: '#ECD2B0', borderRadius: 19, backgroundColor: '#FFF4E4' }, insightTop: { flexDirection: 'row', alignItems: 'center', gap: 9 }, ollyMini: { width: 45, height: 45, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5DFB7', overflow: 'hidden' }, ollyMiniImage: { width: '130%', height: '130%' }, insightCopy: { flex: 1 }, insightEyebrow: { color: '#8E673B', fontSize: 8, fontWeight: '900', letterSpacing: 1 }, insightTitle: { color: colors.ink, fontSize: 12, fontWeight: '900', marginTop: 3 }, insightBody: { color: '#786750', fontSize: 9, marginTop: 2 }, insightButton: { minHeight: 34, justifyContent: 'center', marginTop: 9, borderRadius: 11, backgroundColor: '#E7BD7D' }, insightButtonText: { color: '#4D422E', fontSize: 9, fontWeight: '900', textAlign: 'center' }, unlockGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }, unlockCard: { width: '48%', minHeight: 47, flexDirection: 'row', alignItems: 'center', gap: 5, padding: 4, borderWidth: 1, borderColor: '#ED DCC4'.replace(' ', ''), borderRadius: 10, backgroundColor: '#FFFCF4' }, unlockImage: { width: 37, height: 37, borderRadius: 8 }, unlockCopy: { flex: 1, minWidth: 0 }, unlockName: { color: colors.ink, fontSize: 8, fontWeight: '900' }, unlockMissing: { color: colors.tomato, fontSize: 6, marginTop: 2 },
  apiResults: { marginHorizontal: 15, marginTop: 3 }, apiHeading: { color: colors.ink, fontSize: 17, fontWeight: '900', marginBottom: 7 }, loading: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 }, helper: { color: colors.muted, fontSize: 10, lineHeight: 15, marginVertical: 5 }, apiMeal: { minHeight: 75, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 7, padding: 7, borderWidth: 1, borderColor: colors.line, borderRadius: 14, backgroundColor: colors.surface }, apiImage: { width: 58, height: 58, borderRadius: 10, backgroundColor: colors.sage }, imageFallback: { alignItems: 'center', justifyContent: 'center' }, apiCopy: { flex: 1 }, apiName: { color: colors.ink, fontSize: 11, fontWeight: '900' }, apiMeta: { color: colors.muted, fontSize: 9, marginTop: 3 }, attribution: { color: colors.herb, fontSize: 8, fontWeight: '700', marginTop: 4 }, apiChevron: { color: colors.herb, fontSize: 22 }, attributionFooter: { color: colors.muted, fontSize: 8, textAlign: 'center', marginTop: 4 },
  filterScrim: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#1F2C2866' }, filterSheet: { maxHeight: '74%', padding: 15, borderTopLeftRadius: 22, borderTopRightRadius: 22, backgroundColor: colors.surface }, filterSheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 9, borderBottomWidth: 1, borderBottomColor: '#EEE8DC' }, filterSheetTitle: { color: colors.ink, fontSize: 15, fontWeight: '900' }, clearFilter: { color: colors.herb, fontSize: 10, fontWeight: '900' }, optionsScroll: { flexGrow: 0 }, filterOption: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 9, borderBottomWidth: 1, borderBottomColor: '#F0ECE3', paddingHorizontal: 5 }, checkBox: { width: 17, height: 17, borderWidth: 1, borderColor: '#C9D2C8', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }, checkBoxActive: { borderColor: colors.deepHerb, backgroundColor: colors.deepHerb }, checkText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' }, filterOptionText: { color: '#45554D', fontSize: 11, fontWeight: '800' }, budgetNote: { color: colors.muted, fontSize: 9, lineHeight: 13, padding: 6 }, doneButton: { height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 11, backgroundColor: colors.herb, marginTop: 9 }, doneText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  mealScrim: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: '5%', paddingVertical: '13%', backgroundColor: '#19211E33' }, mealModal: { width: '100%', height: '100%', paddingBottom: 3, borderRadius: 24, backgroundColor: colors.surface, overflow: 'hidden' }, modalTop: { height: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 }, backButton: { minWidth: 56, height: 29, justifyContent: 'center', paddingHorizontal: 9, borderRadius: 10, backgroundColor: '#F3F0E8' }, backText: { color: colors.deepHerb, fontSize: 9, fontWeight: '900' }, modalKind: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 0.6 }, modalTitle: { color: colors.ink, fontSize: 17, lineHeight: 21, fontWeight: '900', marginBottom: 7 }, detailScroll: { flex: 1 }, detailContent: { paddingHorizontal: 12, paddingBottom: 10 }, detailPhoto: { width: '100%', height: 112, borderRadius: 12, backgroundColor: '#E4DFD1' }, detailColumns: { flexDirection: 'row', gap: 9, marginTop: 9 }, ingredientColumn: { flex: 1.05 }, metricColumn: { flex: 0.95 }, detailSubhead: { color: colors.herb, fontSize: 8, fontWeight: '900', letterSpacing: 0.6, marginBottom: 5 }, ingredient: { color: colors.ink, fontSize: 9, lineHeight: 13, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#EEE9DF' }, missingIngredient: { color: colors.tomato, fontWeight: '900' }, metric: { padding: 7, borderRadius: 9, backgroundColor: '#F5F2E9', marginBottom: 5 }, metricLabel: { color: colors.muted, fontSize: 6, fontWeight: '900', letterSpacing: 0.5 }, metricValue: { color: colors.ink, fontSize: 9, fontWeight: '800', marginTop: 3 }, swapNote: { color: '#755D3E', fontSize: 8, lineHeight: 12, marginTop: 8, padding: 7, borderRadius: 9, backgroundColor: '#FFF1DF' }, flipButton: { minHeight: 34, alignItems: 'center', justifyContent: 'center', marginTop: 8, borderWidth: 1, borderColor: '#C8D8C9', borderRadius: 10, backgroundColor: '#F3F7EF' }, flipText: { color: colors.deepHerb, fontSize: 9, fontWeight: '900' }, step: { flexDirection: 'row', gap: 7, marginBottom: 10 }, stepNumber: { width: 20, color: colors.herb, fontSize: 10, fontWeight: '900' }, stepText: { flex: 1, color: colors.ink, fontSize: 10, lineHeight: 15 }, modalActions: { flexDirection: 'row', gap: 7, paddingHorizontal: 12, paddingVertical: 9 }, actionButton: { flex: 1, minHeight: 37, alignItems: 'center', justifyContent: 'center', borderRadius: 11 }, secondaryAction: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface }, primaryAction: { backgroundColor: colors.herb }, secondaryText: { color: colors.deepHerb, fontSize: 9, fontWeight: '900' }, primaryText: { color: '#FFFFFF', fontSize: 9, fontWeight: '900' }, modalHelper: { color: colors.muted, fontSize: 9, marginBottom: 8 }, checklist: { flex: 1 }, checkRow: { minHeight: 41, flexDirection: 'row', alignItems: 'center', gap: 8, borderBottomWidth: 1, borderBottomColor: colors.line }, checkIngredient: { flex: 1, color: colors.ink, fontSize: 10 }, checkStatus: { color: colors.muted, fontSize: 8 },
});
