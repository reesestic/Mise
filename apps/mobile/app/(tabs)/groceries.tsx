import { useMemo, useState } from 'react';
import {
  Alert,
  Image,
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

import { colors } from '@/src/theme/colors';

type MealIngredient = { itemId: string; amount: number; unit: string };
type Meal = {
  id: string;
  name: string;
  image: string;
  time: string;
  servings: number;
  status: 'shop' | 'pantry';
  ingredients: MealIngredient[];
  summary: string;
};
type GroceryItem = {
  id: string;
  name: string;
  unit: string;
  pantryQty: number;
  listQty: number;
  mealQty: number;
  manualQty: number;
  cartQty: number;
  removed: boolean;
  priceLow?: number;
  priceHigh?: number;
  packageLabel?: string;
};

const initialMeals: Meal[] = [
  {
    id: 'fajitas', name: 'Chicken Fajitas',
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=700&q=80',
    time: '25 min', servings: 4, status: 'shop',
    ingredients: [
      { itemId: 'chicken', amount: 12, unit: 'oz' },
      { itemId: 'peppers', amount: 2, unit: 'peppers' },
      { itemId: 'tortillas', amount: 4, unit: 'tortillas' },
      { itemId: 'onion', amount: 1, unit: 'onion' },
    ],
    summary: 'Chicken is part of the shared amount for both selected meals.',
  },
  {
    id: 'alfredo', name: 'Creamy Chicken Alfredo',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=700&q=80',
    time: '30 min', servings: 4, status: 'shop',
    ingredients: [
      { itemId: 'chicken', amount: 6, unit: 'oz' },
      { itemId: 'pasta', amount: 12, unit: 'oz' },
      { itemId: 'spinach', amount: 2, unit: 'cups' },
      { itemId: 'parmesan', amount: 1, unit: 'portion' },
    ],
    summary: 'The 18 oz chicken total is calculated once across both meals.',
  },
  {
    id: 'chickpea', name: 'Crispy Chickpea Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80',
    time: '20 min', servings: 2, status: 'pantry',
    ingredients: [
      { itemId: 'chickpeas', amount: 1, unit: 'can' },
      { itemId: 'greens', amount: 2, unit: 'cups' },
      { itemId: 'lemon', amount: 1, unit: 'lemon' },
      { itemId: 'yogurt', amount: 1, unit: 'portion' },
    ],
    summary: 'Confirmed Pantry stock covers this option; it adds nothing to the list.',
  },
];

const initialItems: GroceryItem[] = [
  { id: 'chicken', name: 'Chicken breast', unit: 'oz', pantryQty: 10, listQty: 8, mealQty: 8, manualQty: 0, cartQty: 8, removed: false, priceLow: 4, priceHigh: 6, packageLabel: '8 oz' },
  { id: 'peppers', name: 'Bell peppers', unit: 'peppers', pantryQty: 1, listQty: 1, mealQty: 1, manualQty: 0, cartQty: 0, removed: false, priceLow: 1, priceHigh: 3, packageLabel: '1 pepper' },
  { id: 'tortillas', name: 'Flour tortillas', unit: 'tortillas', pantryQty: 0, listQty: 4, mealQty: 4, manualQty: 0, cartQty: 0, removed: false, priceLow: 2, priceHigh: 4, packageLabel: '1 pack' },
  { id: 'pasta', name: 'Fettuccine', unit: 'oz', pantryQty: 0, listQty: 12, mealQty: 12, manualQty: 0, cartQty: 0, removed: false, priceLow: 2, priceHigh: 4, packageLabel: '1 box' },
  { id: 'spinach', name: 'Baby spinach', unit: 'cups', pantryQty: 0, listQty: 2, mealQty: 2, manualQty: 0, cartQty: 0, removed: false, priceLow: 3, priceHigh: 5, packageLabel: '1 small bag' },
  { id: 'onion', name: 'Yellow onion', unit: 'onions', pantryQty: 1, listQty: 0, mealQty: 0, manualQty: 0, cartQty: 0, removed: false },
  { id: 'parmesan', name: 'Parmesan', unit: 'portions', pantryQty: 1, listQty: 0, mealQty: 0, manualQty: 0, cartQty: 0, removed: false },
  { id: 'chickpeas', name: 'Chickpeas', unit: 'cans', pantryQty: 2, listQty: 0, mealQty: 0, manualQty: 0, cartQty: 0, removed: false },
  { id: 'greens', name: 'Mixed greens', unit: 'cups', pantryQty: 4, listQty: 0, mealQty: 0, manualQty: 0, cartQty: 0, removed: false },
  { id: 'lemon', name: 'Lemon', unit: 'lemons', pantryQty: 2, listQty: 0, mealQty: 0, manualQty: 0, cartQty: 0, removed: false },
  { id: 'yogurt', name: 'Greek yogurt', unit: 'portions', pantryQty: 2, listQty: 0, mealQty: 0, manualQty: 0, cartQty: 0, removed: false },
];

function mealDemand(meals: Meal[], itemId: string) {
  return meals.filter((meal) => meal.status === 'shop')
    .flatMap((meal) => meal.ingredients)
    .filter((ingredient) => ingredient.itemId === itemId)
    .reduce((sum, ingredient) => sum + ingredient.amount, 0);
}

function recalculate(items: GroceryItem[], meals: Meal[]) {
  return items.map((item) => {
    const demand = mealDemand(meals, item.id);
    const needFromShop = Math.max(0, demand - item.pantryQty);
    const mealQty = item.removed ? 0 : needFromShop;
    return { ...item, mealQty, listQty: item.removed ? 0 : mealQty + item.manualQty };
  });
}

function amountText(amount: number, unit: string) {
  const rounded = Number.isInteger(amount) ? `${amount}` : `${Number(amount.toFixed(1))}`;
  return `${rounded} ${unit}`;
}

export default function GroceriesScreen() {
  const { width } = useWindowDimensions();
  const [meals, setMeals] = useState(initialMeals);
  const [items, setItems] = useState(initialItems);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [expandedMeals, setExpandedMeals] = useState<string[]>([]);
  const [mealsCollapsed, setMealsCollapsed] = useState(false);
  const [unlockExpanded, setUnlockExpanded] = useState(false);
  const [request, setRequest] = useState('');
  const [notice, setNotice] = useState('');
  const [dialog, setDialog] = useState<'removeMeal' | 'cart' | null>(null);
  const [pendingMeal, setPendingMeal] = useState<Meal | null>(null);

  const selectedMeals = meals.filter((meal) => meal.status === 'shop');
  const visibleItems = useMemo(() => items.filter((item) => {
    const demand = mealDemand(meals, item.id);
    const shortfall = Math.max(0, demand - item.pantryQty - Math.max(item.listQty, item.cartQty));
    return item.listQty > 0 || item.cartQty > 0 || shortfall > 0;
  }), [items, meals]);
  const estimatedLow = visibleItems.reduce((sum, item) => sum + (item.listQty > 0 ? item.priceLow ?? 0 : 0), 0);
  const estimatedHigh = visibleItems.reduce((sum, item) => sum + (item.listQty > 0 ? item.priceHigh ?? 0 : 0), 0);
  const inCartCount = items.filter((item) => item.cartQty > 0).length;
  const gridColumns = width >= 760 ? 3 : 2;
  const cardWidth = width >= 700 ? 315 : Math.min(width * 0.78, 310);

  function toggleCart(itemId: string) {
    setItems((current) => current.map((item) => {
      if (item.id !== itemId) return item;
      const nextQty = item.cartQty > 0 ? 0 : item.listQty;
      return { ...item, cartQty: nextQty };
    }));
  }

  function handleRequest() {
    const text = request.trim();
    if (!text) return;
    setRequest('');
    if (/meal|recipe|dinner|lunch|breakfast/i.test(text)) {
      Alert.alert(
        'Meal request received',
        'Meal search is not connected in this prototype. Meals you add will be combined with Pantry and list quantities here.',
      );
      return;
    }
    const cleanName = text.replace(/^(please\s+)?(add|put|buy|get)\s+/i, '').replace(/[.!?]+$/, '').trim();
    if (!cleanName) return;
    const id = `quick-${Date.now()}`;
    setItems((current) => [...current, {
      id, name: cleanName[0].toUpperCase() + cleanName.slice(1), unit: 'items', pantryQty: 0,
      listQty: 1, mealQty: 0, manualQty: 1, cartQty: 0, removed: false,
    }]);
    setNotice(`${cleanName} added to your list`);
    setTimeout(() => setNotice(''), 2200);
  }

  function addUnlockItems() {
    const suggestions = [
      { id: 'mushrooms', name: 'Mushrooms', unit: 'packages' },
      { id: 'feta', name: 'Feta', unit: 'packages' },
    ];
    setItems((current) => {
      let updated = [...current];
      suggestions.forEach((suggestion) => {
        const existing = updated.find((item) => item.id === suggestion.id || item.name.toLowerCase() === suggestion.name.toLowerCase());
        if (existing) {
          updated = updated.map((item) => item.id === existing.id
            ? { ...item, manualQty: item.manualQty + 1, removed: false }
            : item);
        } else {
          updated.push({ ...suggestion, pantryQty: 0, listQty: 1, mealQty: 0, manualQty: 1, cartQty: 0, removed: false });
        }
      });
      return recalculate(updated, meals);
    });
    setUnlockExpanded(false);
    setNotice('Mushrooms and feta added to your list');
    setTimeout(() => setNotice(''), 2200);
  }

  function requestMealRemoval(meal: Meal) {
    setPendingMeal(meal);
    setDialog('removeMeal');
  }

  function getRemovalChanges(meal: Meal) {
    const nextMeals = meals.filter((item) => item.id !== meal.id);
    return items.flatMap((item) => {
      const oldNeed = Math.max(0, mealDemand(meals, item.id) - item.pantryQty);
      const newNeed = Math.max(0, mealDemand(nextMeals, item.id) - item.pantryQty);
      return oldNeed !== newNeed ? [`${item.name}: ${amountText(oldNeed, item.unit)} → ${amountText(newNeed, item.unit)} for selected meals`] : [];
    });
  }

  function removeMeal(updateAmounts: boolean) {
    if (!pendingMeal) return;
    const nextMeals = meals.filter((meal) => meal.id !== pendingMeal.id);
    setItems((current) => {
      if (updateAmounts) return recalculate(current, nextMeals);
      const preserveCurrentQuantities = current.map((item) => {
        const newNeed = Math.max(0, mealDemand(nextMeals, item.id) - item.pantryQty);
        return { ...item, manualQty: Math.max(item.manualQty, item.listQty - newNeed) };
      });
      return recalculate(preserveCurrentQuantities, nextMeals);
    });
    setMeals(nextMeals);
    setPendingMeal(null);
    setDialog(null);
  }

  function removeFromList(item: GroceryItem) {
    Alert.alert(
      `Remove ${item.name}?`,
      item.cartQty > 0 ? 'It is marked as physically in your cart. Remove that amount from the cart too?' : 'Meals that still need it will show the shortfall.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => {
          setItems((current) => current.map((candidate) => candidate.id === item.id
            ? { ...candidate, listQty: 0, manualQty: 0, mealQty: 0, cartQty: 0, removed: true }
            : candidate));
        } },
      ],
    );
  }

  function addMissing(item: GroceryItem) {
    setItems((current) => current.map((candidate) => {
      if (candidate.id !== item.id) return candidate;
      const needed = Math.max(0, mealDemand(meals, candidate.id) - candidate.pantryQty);
      return { ...candidate, removed: false, mealQty: needed, listQty: Math.max(candidate.listQty, needed), cartQty: candidate.cartQty };
    }));
  }

  function confirmPurchase() {
    const picked = items.filter((item) => item.cartQty > 0);
    if (!picked.length) return;
    setItems((current) => recalculate(current.map((item) => item.cartQty > 0
      ? { ...item, pantryQty: item.pantryQty + item.cartQty, listQty: Math.max(0, item.listQty - item.cartQty), manualQty: Math.max(0, item.manualQty - item.cartQty), cartQty: 0 }
      : item), meals));
    setDialog(null);
    setNotice('Sample purchase confirmed · Pantry coverage updated on this screen');
    setTimeout(() => setNotice(''), 3000);
  }

  function itemStatuses(item: GroceryItem) {
    const demand = mealDemand(meals, item.id);
    const shortfall = Math.max(0, demand - item.pantryQty - Math.max(item.listQty, item.cartQty));
    return { demand, shortfall };
  }

  function renderItem(item: GroceryItem) {
    const { demand, shortfall } = itemStatuses(item);
    const expanded = expandedItems.includes(item.id);
    const usedMeals = meals.filter((meal) => meal.ingredients.some((ingredient) => ingredient.itemId === item.id));
    return (
      <View key={item.id} style={[styles.itemCard, item.cartQty > 0 && styles.itemCardPicked, view === 'grid' && styles.itemCardGrid, { width: view === 'grid' ? `${100 / gridColumns - 2}%` : '100%' }]}>
        <View style={styles.itemTop}>
          <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: item.cartQty > 0 }} accessibilityLabel={`${item.name} physically in cart`} onPress={() => toggleCart(item.id)} style={[styles.itemCheck, item.cartQty > 0 && styles.itemCheckSelected]}>
            <Text style={[styles.checkmark, item.cartQty > 0 && styles.checkmarkSelected]}>{item.cartQty > 0 ? '✓' : ''}</Text>
          </Pressable>
          <View style={styles.itemMain}>
            <Text numberOfLines={2} style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>
              {item.listQty > 0 ? `${item.packageLabel ?? amountText(item.listQty, item.unit)} · ` : ''}
              {item.cartQty > 0 ? `${amountText(item.cartQty, item.unit)} in cart` : shortfall > 0 ? `Short ${amountText(shortfall, item.unit)}` : demand > 0 && item.pantryQty >= demand ? 'Pantry covers selected meals' : 'Extra grocery'}
            </Text>
            <View style={styles.chipRow}>
              {item.pantryQty > 0 ? <StatusChip label={`Pantry ${amountText(item.pantryQty, item.unit)}`} tone="pantry" /> : null}
              {item.listQty > 0 ? <StatusChip label={`List ${amountText(item.listQty, item.unit)}`} tone="list" /> : null}
              {item.cartQty > 0 ? <StatusChip label="✓ In cart" tone="cart" /> : null}
              {shortfall > 0 ? <StatusChip label={`Short ${amountText(shortfall, item.unit)}`} tone="missing" /> : null}
            </View>
          </View>
          <View style={styles.priceBlock}><Text style={styles.itemPrice}>{item.priceLow !== undefined ? `$${item.priceLow}${item.priceHigh !== undefined && item.priceHigh !== item.priceLow ? `–$${item.priceHigh}` : ''}` : '—'}</Text><Text style={styles.estimateLabel}>{item.priceLow !== undefined ? 'estimate' : 'no estimate'}</Text></View>
          <Pressable accessibilityRole="button" accessibilityLabel={`${expanded ? 'Hide' : 'Show'} ${item.name} details`} onPress={() => setExpandedItems((current) => expanded ? current.filter((id) => id !== item.id) : [...current, item.id])} style={styles.moreButton}><Text style={styles.moreGlyph}>{expanded ? '⌃' : '···'}</Text></Pressable>
        </View>
        {expanded ? (
          <View style={styles.itemDetails}>
            <Text style={styles.detailText}><Text style={styles.detailStrong}>Combined need:</Text> {demand > 0 ? `${amountText(demand, item.unit)} across ${usedMeals.length} meal${usedMeals.length === 1 ? '' : 's'}` : 'No selected meal currently needs this item.'}</Text>
            <Text style={styles.detailText}><Text style={styles.detailStrong}>Coverage:</Text> {amountText(item.pantryQty, item.unit)} in Pantry · {amountText(Math.max(item.listQty, item.cartQty), item.unit)} intended to buy.</Text>
            <Text style={styles.detailMeals}>Used in: {usedMeals.length ? usedMeals.map((meal) => meal.name).join(' · ') : 'Added by you'}</Text>
            {shortfall > 0 ? <Pressable onPress={() => addMissing(item)} style={styles.smallAction}><Text style={styles.smallActionText}>＋ Add missing amount</Text></Pressable> : null}
            <Pressable onPress={() => removeFromList(item)} style={styles.removeTextButton}><Text style={styles.removeText}>Remove from list</Text></Pressable>
          </View>
        ) : null}
      </View>
    );
  }

  function renderMeal(meal: Meal) {
    const expanded = expandedMeals.includes(meal.id);
    const mealShortfalls = meal.ingredients.flatMap((ingredient) => {
      const item = items.find((candidate) => candidate.id === ingredient.itemId);
      if (!item) return [`${ingredient.itemId} data unavailable`];
      const { shortfall } = itemStatuses(item);
      return shortfall > 0 ? [`${item.name} short ${amountText(shortfall, item.unit)}`] : [];
    });
    const badgeLabel = meal.status === 'pantry' ? 'Ready now' : mealShortfalls.length ? 'Shared shortfall' : 'Covered by this shop';
    const sharedChicken = items.find((item) => item.id === 'chicken');
    const chickenNeed = mealDemand(meals, 'chicken');
    const chickenCoverage = sharedChicken ? Math.max(sharedChicken.listQty, sharedChicken.cartQty) : 0;
    return (
      <View key={meal.id} style={[styles.mealCard, { width: cardWidth }]}>
        <View style={styles.mealImageWrap}>
          <Image source={{ uri: meal.image }} style={styles.mealImage} resizeMode="cover" />
          <View style={[styles.mealBadge, meal.status === 'shop' && !mealShortfalls.length && styles.mealBadgeShop, mealShortfalls.length > 0 && styles.mealBadgeMissing]}><Text style={styles.mealBadgeText}>{badgeLabel}</Text></View>
          {meal.status === 'shop' ? <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${meal.name} from this shop`} onPress={() => requestMealRemoval(meal)} style={styles.mealRemove}><Text style={styles.mealRemoveText}>×</Text></Pressable> : null}
        </View>
        <View style={styles.mealBody}>
          <Text style={styles.mealName}>{meal.name}</Text>
          <Text style={styles.mealMeta}>{meal.time} · {meal.servings} servings · {meal.status === 'shop' ? 'added to this shop' : 'Pantry option'}</Text>
          {meal.status === 'shop' && meal.ingredients.some((ingredient) => ingredient.itemId === 'chicken') ? (
            <View style={styles.sharedNote}><Text style={styles.sharedNoteText}><Text style={styles.sharedNoteStrong}>Chicken is shared:</Text> {amountText(chickenNeed, 'oz')} needed across {selectedMeals.length} selected meals. Pantry adds {amountText(sharedChicken?.pantryQty ?? 0, 'oz')}; list/cart covers {amountText(chickenCoverage, 'oz')}.</Text></View>
          ) : <View style={styles.sharedNote}><Text style={styles.sharedNoteText}><Text style={styles.sharedNoteStrong}>Ready from Pantry:</Text> This meal adds nothing to your grocery list.</Text></View>}
          <View style={styles.mealChipRow}>
            {meal.ingredients.slice(0, 3).map((ingredient) => {
              const item = items.find((candidate) => candidate.id === ingredient.itemId);
              if (!item) return null;
              const { shortfall } = itemStatuses(item);
              const tone = shortfall > 0 ? 'missing' : item.pantryQty >= ingredient.amount ? 'pantry' : 'list';
              const label = shortfall > 0 ? `Short ${amountText(shortfall, item.unit)}` : item.pantryQty >= ingredient.amount ? `${item.name} · Pantry` : `${item.name} · List`;
              return <StatusChip key={ingredient.itemId} label={label} tone={tone} />;
            })}
          </View>
          <Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={() => setExpandedMeals((current) => expanded ? current.filter((id) => id !== meal.id) : [...current, meal.id])} style={styles.mealDetailsButton}>
            <Text style={styles.mealDetailsText}>{expanded ? 'Hide ingredients' : 'Ingredients & status'} {expanded ? '⌃' : '⌄'}</Text>
          </Pressable>
          {expanded ? (
            <View style={styles.mealIngredients}>
              {meal.ingredients.map((ingredient) => {
                const item = items.find((candidate) => candidate.id === ingredient.itemId);
                if (!item) return null;
                const { shortfall } = itemStatuses(item);
                const label = shortfall > 0 ? `Short ${amountText(shortfall, item.unit)}` : item.pantryQty >= ingredient.amount ? `Pantry ${amountText(Math.min(item.pantryQty, ingredient.amount), item.unit)}` : item.cartQty > 0 ? `In cart · ${amountText(item.cartQty, item.unit)}` : `On list · ${amountText(item.listQty, item.unit)}`;
                return <View key={ingredient.itemId} style={styles.ingredientLine}><Text style={styles.ingredientName}>{item.name} · {amountText(ingredient.amount, ingredient.unit)}</Text><Text style={styles.ingredientState}>{label}</Text></View>;
              })}
              <Text style={styles.ingredientFootnote}>{meal.summary}</Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.screenContent}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.brandRow}><Text style={styles.brand}>No Crumbs</Text><Pressable accessibilityRole="button" accessibilityLabel="Profile" style={styles.profile}><Text style={styles.profileText}>R</Text></Pressable></View>
          <View style={styles.titleRow}>
            <View style={styles.titleCopy}><Text style={styles.pageTitle}>Groceries</Text><Text style={styles.subtitle}>A good shop, with your next meal in mind.</Text></View>
            <Pressable accessibilityRole="button" onPress={() => setDialog('cart')} style={({ pressed }) => [styles.reviewButton, pressed && styles.pressed]}><Text style={styles.reviewIcon}>🛒</Text><View><Text style={styles.reviewLabel}>Review cart</Text><Text style={styles.reviewCount}>{inCartCount} picked up</Text></View></Pressable>
          </View>
        </View>

        <View style={styles.requestPanel}>
          <View style={styles.requestBox}>
            <View style={styles.ollyCircle}><Image source={require('../../assets/images/olly-pot.png')} resizeMode="contain" style={styles.ollyImage} /></View>
            <TextInput
              value={request}
              onChangeText={setRequest}
              onSubmitEditing={handleRequest}
              returnKeyType="send"
              placeholder="What should be in your cart?"
              placeholderTextColor={colors.muted}
              accessibilityLabel="Ask for groceries or meals"
              style={styles.requestInput}
            />
            <Pressable accessibilityRole="button" accessibilityLabel="Voice request" onPress={() => Alert.alert('Voice request', 'Voice input will be connected later. You can type a request here for now.')} style={styles.voiceButton}><Text style={styles.voiceGlyph}>⌁</Text></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Send request" onPress={handleRequest} style={styles.sendButton}><Text style={styles.sendGlyph}>➜</Text></Pressable>
          </View>
          <View style={styles.requestHint}><Text style={styles.hintText}>Ask for groceries or meals in your own words.</Text><Text style={styles.hintExample}>Try “4 chicken meals around $40”</Text></View>
          <View style={styles.pantryNote}><View style={styles.pantryDot} /><Text style={styles.pantryNoteText}><Text style={styles.pantryNoteStrong}>Pantry-aware list</Text> · only confirmed food counts as owned</Text></View>
        </View>

        <View style={styles.content}>
          <View style={styles.listHeader}>
            <View style={styles.listTitleBlock}><Text style={styles.sectionTitle}>Your list <Text style={styles.tomatoDot}>·</Text> {visibleItems.length} items</Text><Text style={styles.sectionSubtitle}>{selectedMeals.length} meals · shared amounts included</Text></View>
            <View style={styles.listTools}>
              <View style={styles.estimatedTotal}><Text style={styles.estimatedValue}>{estimatedLow ? `$${estimatedLow}–$${estimatedHigh}` : '—'}</Text><Text style={styles.estimatedCaption}>estimated</Text></View>
              <View style={styles.viewToggle} accessibilityRole="toolbar" accessibilityLabel="Grocery list layout">
                <Pressable accessibilityRole="button" accessibilityLabel="List view" accessibilityState={{ selected: view === 'list' }} onPress={() => setView('list')} style={[styles.viewButton, view === 'list' && styles.viewSelected]}><Text style={[styles.viewGlyph, view === 'list' && styles.viewGlyphSelected]}>☰</Text></Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel="Grid view" accessibilityState={{ selected: view === 'grid' }} onPress={() => setView('grid')} style={[styles.viewButton, view === 'grid' && styles.viewSelected]}><Text style={[styles.viewGlyph, view === 'grid' && styles.viewGlyphSelected]}>▦</Text></Pressable>
              </View>
            </View>
          </View>

          <View style={[styles.itemsWrap, view === 'grid' && styles.itemsGrid]}>
            {visibleItems.map(renderItem)}
            {!visibleItems.length ? <Text style={styles.emptyList}>Your list is clear. Add an item or request meal ideas above.</Text> : null}
          </View>

          <View style={styles.mealSectionHeader}>
            <View style={styles.mealSectionCopy}><Text style={styles.sectionTitle}>Meals you can make</Text><Text style={styles.sectionSubtitle}>{selectedMeals.length} added to this shop · Pantry + list coverage</Text></View>
            <Pressable accessibilityRole="button" accessibilityLabel={mealsCollapsed ? 'Show meals' : 'Hide meals'} accessibilityState={{ expanded: !mealsCollapsed }} onPress={() => setMealsCollapsed((value) => !value)} style={styles.collapseButton}><Text style={styles.collapseGlyph}>{mealsCollapsed ? '⌄' : '⌃'}</Text></Pressable>
          </View>
          {!mealsCollapsed ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mealRail}>
              {meals.map(renderMeal)}
            </ScrollView>
          ) : null}

          <View style={styles.unlockCard}>
            <View style={styles.unlockIcon}><Text style={styles.unlockIconText}>✦</Text></View>
            <View style={styles.unlockCopy}><Text style={styles.unlockTitle}>Olly spotted another possibility</Text><Text style={styles.unlockDescription}>Add mushrooms + feta to open up 3 more meal ideas.</Text></View>
            <Pressable accessibilityRole="button" accessibilityState={{ expanded: unlockExpanded }} onPress={() => setUnlockExpanded((value) => !value)} style={styles.unlockButton}><Text style={styles.unlockButtonText}>{unlockExpanded ? 'Hide' : 'See meals'}</Text></Pressable>
          </View>
          {unlockExpanded ? (
            <View style={styles.unlockDetails}>
              <Text style={styles.unlockMeals}><Text style={styles.bold}>Could unlock:</Text> Mushroom toast · spinach feta pasta · roasted veggie bowls</Text>
              <Text style={styles.unlockEstimate}>Optional idea · estimated cost shown after price data is available</Text>
              <Pressable accessibilityRole="button" onPress={addUnlockItems} style={styles.unlockAdd}><Text style={styles.unlockAddText}>＋ Add mushrooms + feta</Text></Pressable>
            </View>
          ) : null}
          {notice ? <View accessibilityRole="status" style={styles.notice}><Text style={styles.noticeText}>{notice}</Text></View> : null}
          <View style={{ height: 18 }} />
        </View>
      </ScrollView>

      <Modal transparent visible={dialog === 'removeMeal'} animationType="fade" onRequestClose={() => setDialog(null)}>
        <View style={styles.modalScrim}>
          <View style={styles.modalCard}>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => setDialog(null)} style={styles.modalClose}><Text style={styles.modalCloseText}>×</Text></Pressable>
            <View style={styles.modalTop}><View style={styles.modalOlly}><Image source={require('../../assets/images/olly-pot.png')} resizeMode="contain" style={styles.modalOllyImage} /></View><View style={styles.modalTitleBlock}><Text style={styles.modalTitle}>Remove this meal from the shop?</Text><Text style={styles.modalSubtitle}>I’ll recalculate the shared ingredient amounts. Your list changes only after you choose.</Text></View></View>
            <View style={styles.changeList}>
              <Text style={styles.changeMealName}>{pendingMeal?.name}</Text>
              {(pendingMeal ? getRemovalChanges(pendingMeal) : []).map((change) => <Text key={change} style={styles.changeLine}>• {change}</Text>)}
              <Text style={styles.changeNote}>Already picked-up groceries stay visible as extras.</Text>
            </View>
            <View style={styles.modalActions}><Pressable onPress={() => removeMeal(false)} style={styles.keepButton}><Text style={styles.keepButtonText}>Keep quantities</Text></Pressable><Pressable onPress={() => removeMeal(true)} style={styles.updateButton}><Text style={styles.updateButtonText}>Update meal amounts</Text></Pressable></View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={dialog === 'cart'} animationType="slide" onRequestClose={() => setDialog(null)}>
        <View style={styles.modalScrim}>
          <View style={styles.modalCard}>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => setDialog(null)} style={styles.modalClose}><Text style={styles.modalCloseText}>×</Text></Pressable>
            <Text style={styles.modalTitle}>Review what’s in your cart</Text><Text style={styles.modalSubtitle}>Picked-up items are still separate from confirmed Pantry stock.</Text>
            <View style={styles.cartReviewList}>
              {items.filter((item) => item.cartQty > 0).map((item) => <View key={item.id} style={styles.cartReviewRow}><Text style={styles.cartReviewName}>{item.name}<Text style={styles.cartReviewQty}>{'\n'}{amountText(item.cartQty, item.unit)}</Text></Text><Text style={styles.cartReviewPrice}>{item.priceLow !== undefined ? `$${item.priceLow}–$${item.priceHigh}` : '—'}</Text></View>)}
              {!items.some((item) => item.cartQty > 0) ? <Text style={styles.emptyList}>No items picked up yet.</Text> : null}
            </View>
            <View style={styles.modalActions}><Pressable onPress={() => setDialog(null)} style={styles.keepButton}><Text style={styles.keepButtonText}>Keep shopping</Text></Pressable><Pressable disabled={!inCartCount} onPress={confirmPurchase} style={[styles.updateButton, !inCartCount && styles.disabledButton]}><Text style={styles.updateButtonText}>Confirm purchase</Text></Pressable></View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function StatusChip({ label, tone }: { label: string; tone: 'pantry' | 'list' | 'cart' | 'missing' }) {
  const style = tone === 'pantry' ? styles.chipPantry : tone === 'list' ? styles.chipList : tone === 'cart' ? styles.chipCart : styles.chipMissing;
  return <View style={[styles.statusChip, style]}><Text numberOfLines={1} style={styles.statusChipText}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  screen: { flex: 1, backgroundColor: colors.canvas },
  screenContent: { paddingBottom: 12 },
  header: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 11, backgroundColor: colors.canvas, borderBottomWidth: 1, borderBottomColor: '#EFE5D4' },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { color: colors.herb, fontSize: 19, fontWeight: '900', letterSpacing: -0.8 },
  profile: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#D9CCB8', backgroundColor: '#F3E8D5', alignItems: 'center', justifyContent: 'center' },
  profileText: { color: colors.deepHerb, fontWeight: '900', fontSize: 13 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 7 },
  titleCopy: { flex: 1, minWidth: 0 },
  pageTitle: { color: colors.ink, fontSize: 25, fontWeight: '900', letterSpacing: -1.1, lineHeight: 29 },
  subtitle: { color: colors.muted, fontSize: 10, marginTop: 2 },
  reviewButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.herb, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 13, shadowColor: colors.deepHerb, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 0, elevation: 2 },
  reviewIcon: { fontSize: 15 },
  reviewLabel: { color: '#FFFDF7', fontWeight: '900', fontSize: 9 },
  reviewCount: { color: '#DCE9D9', fontSize: 7, marginTop: 1 },
  requestPanel: { paddingHorizontal: 13, paddingTop: 9, paddingBottom: 9, backgroundColor: colors.canvas, borderBottomWidth: 1, borderColor: '#EFE5D4' },
  requestBox: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 7, padding: 5, borderWidth: 1, borderColor: '#E8DDCA', borderRadius: 30, backgroundColor: colors.surface, shadowColor: '#806D4F', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 0, elevation: 2 },
  ollyCircle: { height: 46, width: 46, borderRadius: 23, backgroundColor: '#F5DFC4', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  ollyImage: { width: 52, height: 52 },
  requestInput: { flex: 1, minWidth: 0, paddingVertical: 7, paddingHorizontal: 0, fontSize: 12, fontWeight: '800', color: colors.ink },
  voiceButton: { height: 33, width: 33, borderRadius: 17, backgroundColor: '#F4ECDD', alignItems: 'center', justifyContent: 'center' },
  voiceGlyph: { color: colors.herb, fontSize: 19, lineHeight: 22, fontWeight: '800' },
  sendButton: { height: 35, width: 35, borderRadius: 18, backgroundColor: colors.tomato, alignItems: 'center', justifyContent: 'center', shadowColor: '#A74637', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.45, shadowRadius: 0, elevation: 2 },
  sendGlyph: { color: 'white', fontSize: 18, fontWeight: '900', marginTop: -2 },
  requestHint: { flexDirection: 'row', justifyContent: 'space-between', gap: 7, paddingHorizontal: 5, paddingTop: 5 },
  hintText: { flexShrink: 1, color: colors.muted, fontSize: 8 },
  hintExample: { flexShrink: 1, color: colors.herb, fontSize: 8, fontWeight: '900', textAlign: 'right' },
  pantryNote: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingTop: 8, paddingHorizontal: 3 },
  pantryDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.celadon, borderWidth: 2, borderColor: colors.sage },
  pantryNoteText: { color: colors.muted, fontSize: 8 },
  pantryNoteStrong: { color: colors.deepHerb, fontWeight: '900' },
  content: { paddingHorizontal: 13, paddingTop: 7 },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 7, marginHorizontal: 2, marginBottom: 8 },
  listTitleBlock: { minWidth: 0, flex: 1 },
  sectionTitle: { color: colors.ink, fontSize: 16, fontWeight: '900', letterSpacing: -0.45 },
  tomatoDot: { color: colors.tomato },
  sectionSubtitle: { color: colors.muted, fontSize: 8, marginTop: 2 },
  listTools: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  estimatedTotal: { alignItems: 'flex-end' },
  estimatedValue: { color: colors.deepHerb, fontSize: 10, fontWeight: '900' },
  estimatedCaption: { color: colors.muted, fontSize: 7 },
  viewToggle: { flexDirection: 'row', padding: 3, gap: 2, borderRadius: 12, backgroundColor: '#F1E8D8', borderWidth: 1, borderColor: '#E5D8C4' },
  viewButton: { width: 29, height: 27, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  viewSelected: { backgroundColor: colors.surface, shadowColor: '#51442A', shadowOpacity: 0.12, shadowRadius: 3, elevation: 1 },
  viewGlyph: { color: '#7B8981', fontSize: 14 },
  viewGlyphSelected: { color: colors.herb, fontWeight: '900' },
  itemsWrap: { gap: 7 },
  itemsGrid: { flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start', columnGap: 7, rowGap: 7 },
  itemCard: { minHeight: 70, paddingHorizontal: 9, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: '#E7D8C0', backgroundColor: colors.surface, shadowColor: '#51442A', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 0, elevation: 2 },
  itemCardPicked: { backgroundColor: '#EDF3E8', borderColor: '#ADC4A9' },
  itemCardGrid: { minHeight: 130, paddingHorizontal: 8 },
  itemTop: { flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 0 },
  itemCheck: { width: 25, height: 25, borderRadius: 13, borderWidth: 2, borderColor: '#AAB5AA', backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  itemCheckSelected: { backgroundColor: colors.herb, borderColor: colors.herb },
  checkmark: { color: 'transparent', fontSize: 13, fontWeight: '900' },
  checkmarkSelected: { color: 'white' },
  itemMain: { flex: 1, minWidth: 0 },
  itemName: { color: colors.ink, fontSize: 11, lineHeight: 14, fontWeight: '900' },
  itemQuantity: { color: '#68766F', fontSize: 8, lineHeight: 11, marginTop: 3 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 5 },
  statusChip: { maxWidth: '100%', alignSelf: 'flex-start', borderRadius: 99, paddingHorizontal: 6, paddingVertical: 3 },
  statusChipText: { fontSize: 7, lineHeight: 9, fontWeight: '900' },
  chipPantry: { backgroundColor: colors.sage },
  chipList: { backgroundColor: '#FFF0D4' },
  chipCart: { backgroundColor: '#DCECED' },
  chipMissing: { backgroundColor: '#F9E1D7' },
  priceBlock: { alignSelf: 'flex-start', alignItems: 'flex-end', minWidth: 42, paddingTop: 1 },
  itemPrice: { color: colors.deepHerb, fontSize: 9, fontWeight: '900' },
  estimateLabel: { color: colors.muted, fontSize: 6, marginTop: 2 },
  moreButton: { width: 20, alignItems: 'flex-end', justifyContent: 'flex-start', alignSelf: 'stretch' },
  moreGlyph: { color: '#829087', fontSize: 17, fontWeight: '900', lineHeight: 18 },
  itemDetails: { borderTopWidth: 1, borderStyle: 'dashed', borderColor: '#D7C9B4', marginTop: 8, paddingTop: 7 },
  detailText: { color: '#586962', fontSize: 8, lineHeight: 13, marginBottom: 3 },
  detailStrong: { color: colors.ink, fontWeight: '900' },
  detailMeals: { color: colors.herb, fontWeight: '900', fontSize: 8, lineHeight: 13 },
  smallAction: { alignSelf: 'flex-start', backgroundColor: colors.herb, borderRadius: 9, paddingHorizontal: 8, paddingVertical: 6, marginTop: 7 },
  smallActionText: { color: 'white', fontSize: 8, fontWeight: '900' },
  removeTextButton: { alignSelf: 'flex-end', padding: 4, marginTop: 2 },
  removeText: { color: colors.tomato, fontSize: 8, fontWeight: '900' },
  emptyList: { padding: 16, color: colors.muted, textAlign: 'center', fontSize: 10, lineHeight: 15 },
  mealSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 17, marginHorizontal: 2, marginBottom: 6 },
  mealSectionCopy: { flex: 1 },
  collapseButton: { height: 30, width: 30, borderRadius: 15, backgroundColor: '#F4ECDD', alignItems: 'center', justifyContent: 'center' },
  collapseGlyph: { color: colors.herb, fontSize: 16, fontWeight: '900' },
  mealRail: { gap: 9, paddingHorizontal: 2, paddingTop: 2, paddingBottom: 8 },
  mealCard: { borderWidth: 1, borderColor: '#E7DCC9', borderRadius: 18, backgroundColor: '#FFFCF5', overflow: 'hidden', shadowColor: '#51442A', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 0, elevation: 2 },
  mealImageWrap: { height: 94, backgroundColor: colors.sage, position: 'relative' },
  mealImage: { height: '100%', width: '100%' },
  mealBadge: { position: 'absolute', top: 7, left: 8, borderRadius: 99, backgroundColor: colors.sage, paddingHorizontal: 7, paddingVertical: 4 },
  mealBadgeShop: { backgroundColor: '#DCECED' },
  mealBadgeMissing: { backgroundColor: '#F9E1D7' },
  mealBadgeText: { color: colors.deepHerb, fontSize: 7, fontWeight: '900' },
  mealRemove: { position: 'absolute', top: 6, right: 7, width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFFEFAE8', alignItems: 'center', justifyContent: 'center' },
  mealRemoveText: { color: colors.muted, fontSize: 17, lineHeight: 20, fontWeight: '900' },
  mealBody: { padding: 9 },
  mealName: { color: colors.ink, fontSize: 13, lineHeight: 16, fontWeight: '900', letterSpacing: -0.25 },
  mealMeta: { color: colors.muted, fontSize: 7, marginTop: 3 },
  sharedNote: { backgroundColor: '#F5EFDF', borderRadius: 10, padding: 7, marginTop: 7 },
  sharedNoteText: { color: '#596B62', fontSize: 7, lineHeight: 11 },
  sharedNoteStrong: { color: colors.deepHerb, fontWeight: '900' },
  mealChipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 7 },
  mealDetailsButton: { alignSelf: 'flex-start', paddingTop: 7, paddingBottom: 1 },
  mealDetailsText: { color: colors.herb, fontSize: 8, fontWeight: '900' },
  mealIngredients: { borderTopWidth: 1, borderStyle: 'dashed', borderColor: '#D6C9B6', marginTop: 6, paddingTop: 6, gap: 5 },
  ingredientLine: { flexDirection: 'row', justifyContent: 'space-between', gap: 7 },
  ingredientName: { flex: 1, color: '#586962', fontSize: 7 },
  ingredientState: { color: colors.deepHerb, fontSize: 7, fontWeight: '900', textAlign: 'right' },
  ingredientFootnote: { color: colors.muted, fontSize: 7, lineHeight: 10, marginTop: 2 },
  unlockCard: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, padding: 8, borderRadius: 15, borderWidth: 1, borderColor: '#D5E2D0', backgroundColor: '#EAF1E5' },
  unlockIcon: { width: 29, height: 29, borderRadius: 10, backgroundColor: '#DCE9D9', alignItems: 'center', justifyContent: 'center' },
  unlockIconText: { color: colors.herb, fontSize: 15, fontWeight: '900' },
  unlockCopy: { flex: 1, minWidth: 0 },
  unlockTitle: { color: colors.deepHerb, fontSize: 9, fontWeight: '900' },
  unlockDescription: { color: '#61736A', fontSize: 7, lineHeight: 10, marginTop: 2 },
  unlockButton: { flexShrink: 0, backgroundColor: colors.herb, borderRadius: 9, paddingHorizontal: 8, paddingVertical: 7 },
  unlockButtonText: { color: 'white', fontSize: 7, fontWeight: '900' },
  unlockDetails: { marginTop: 6, padding: 9, borderRadius: 13, borderWidth: 1, borderStyle: 'dashed', borderColor: '#B4C9B3', backgroundColor: colors.surface },
  unlockMeals: { color: '#51655B', fontSize: 8, lineHeight: 12 },
  bold: { color: colors.deepHerb, fontWeight: '900' },
  unlockEstimate: { color: colors.muted, fontSize: 7, marginTop: 4 },
  unlockAdd: { alignSelf: 'flex-start', marginTop: 6, borderRadius: 9, backgroundColor: colors.herb, paddingHorizontal: 9, paddingVertical: 7 },
  unlockAddText: { color: 'white', fontSize: 8, fontWeight: '900' },
  notice: { alignSelf: 'center', marginTop: 8, backgroundColor: colors.ink, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  noticeText: { color: 'white', fontSize: 8, fontWeight: '900' },
  modalScrim: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#1D2927A6' },
  modalCard: { width: '100%', maxWidth: 390, borderWidth: 1, borderColor: '#E5D6BD', borderRadius: 22, padding: 16, backgroundColor: colors.canvas },
  modalClose: { alignSelf: 'flex-end', marginTop: -8, marginRight: -5, paddingHorizontal: 5 },
  modalCloseText: { color: colors.muted, fontSize: 20, fontWeight: '700' },
  modalTop: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  modalOlly: { width: 43, height: 43, borderRadius: 22, backgroundColor: '#F2DEC4', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  modalOllyImage: { width: 48, height: 48 },
  modalTitleBlock: { flex: 1 },
  modalTitle: { color: colors.ink, fontSize: 15, lineHeight: 19, fontWeight: '900' },
  modalSubtitle: { color: colors.muted, fontSize: 9, lineHeight: 13, marginTop: 4 },
  changeList: { marginTop: 12, padding: 10, borderWidth: 1, borderColor: colors.line, borderRadius: 13, backgroundColor: colors.surface },
  changeMealName: { color: colors.deepHerb, fontSize: 9, fontWeight: '900', marginBottom: 4 },
  changeLine: { color: '#586962', fontSize: 8, lineHeight: 13 },
  changeNote: { color: colors.muted, fontSize: 7, marginTop: 6 },
  modalActions: { flexDirection: 'row', gap: 7, marginTop: 12 },
  keepButton: { flex: 1, minHeight: 38, justifyContent: 'center', alignItems: 'center', borderRadius: 11, backgroundColor: '#EEE5D6', paddingHorizontal: 7 },
  keepButtonText: { color: '#54645D', fontSize: 8, fontWeight: '900', textAlign: 'center' },
  updateButton: { flex: 1, minHeight: 38, justifyContent: 'center', alignItems: 'center', borderRadius: 11, backgroundColor: colors.herb, paddingHorizontal: 7 },
  updateButtonText: { color: 'white', fontSize: 8, fontWeight: '900', textAlign: 'center' },
  disabledButton: { opacity: 0.45 },
  cartReviewList: { maxHeight: 250, marginTop: 10 },
  cartReviewRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderColor: colors.line },
  cartReviewName: { color: colors.ink, fontSize: 9, fontWeight: '900' },
  cartReviewQty: { color: colors.muted, fontSize: 8, fontWeight: '400' },
  cartReviewPrice: { color: colors.deepHerb, fontSize: 9, fontWeight: '900' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
});
