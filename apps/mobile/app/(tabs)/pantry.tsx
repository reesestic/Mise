import { useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/src/theme/colors';

type Location = 'Fridge' | 'Freezer' | 'Pantry' | 'Other';
type PantryItem = {
  id: string;
  name: string;
  amount: string;
  location: Location;
  soon: boolean;
  note?: string;
  daysToExpire?: number;
};

const locations: Location[] = ['Fridge', 'Freezer', 'Pantry'];
const startingItems: PantryItem[] = [
  { id: 'milk', name: 'Milk', amount: 'About ½ gallon', location: 'Fridge', soon: true, note: 'Check date soon', daysToExpire: 1 },
  { id: 'spinach', name: 'Baby spinach', amount: '1 bag', location: 'Fridge', soon: true, note: 'Added 5 days ago', daysToExpire: 0 },
  { id: 'yogurt', name: 'Greek yogurt', amount: '1 tub', location: 'Fridge', soon: false, daysToExpire: 6 },
  { id: 'eggs', name: 'Eggs', amount: '8 left', location: 'Fridge', soon: false, daysToExpire: 14 },
  { id: 'lemon', name: 'Lemon', amount: '2', location: 'Fridge', soon: true, note: 'Use in the next few days', daysToExpire: 3 },
  { id: 'peas', name: 'Frozen peas', amount: '1 bag', location: 'Freezer', soon: false, daysToExpire: 90 },
  { id: 'chicken', name: 'Chicken thighs', amount: '4 pieces', location: 'Freezer', soon: false, daysToExpire: 45 },
  { id: 'bread', name: 'Bread', amount: '½ loaf', location: 'Freezer', soon: false, daysToExpire: 30 },
  { id: 'chickpeas', name: 'Chickpeas', amount: '2 cans', location: 'Pantry', soon: false, daysToExpire: 240 },
  { id: 'penne', name: 'Penne', amount: '1 box', location: 'Pantry', soon: false },
  { id: 'rice', name: 'Rice', amount: 'About 2 cups', location: 'Pantry', soon: false },
  { id: 'oil', name: 'Olive oil', amount: '1 bottle', location: 'Pantry', soon: false, daysToExpire: 180 },
];

function expiry(item: PantryItem) {
  const days = item.daysToExpire;
  if (days === undefined) return { label: '—', color: colors.muted };
  if (days < 0) return { label: 'EX', color: colors.tomato };
  if (days === 0) return { label: '0d', color: colors.tomato };
  if (days <= 2) return { label: `${days}d`, color: '#E9975C' };
  if (days <= 5) return { label: `${days}d`, color: '#E2C358' };
  if (days <= 10) return { label: `${days}d`, color: '#A7BE70' };
  return { label: `${days}d`, color: '#70A77C' };
}

export default function PantryScreen() {
  const [items, setItems] = useState(startingItems);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState<Location | 'All'>('All');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [collapsed, setCollapsed] = useState(false);
  const [sortNewest, setSortNewest] = useState(true);
  const [editing, setEditing] = useState<PantryItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location>('Fridge');

  const shown = useMemo(() => {
    const search = query.trim().toLowerCase();
    const filtered = items.filter((item) =>
      (location === 'All' || item.location === location) &&
      (!search || `${item.name} ${item.location} ${item.amount}`.toLowerCase().includes(search)));
    return sortNewest ? filtered : [...filtered].reverse();
  }, [items, location, query, sortNewest]);
  const soonItems = shown.filter((item) => item.soon);
  const otherItems = shown.filter((item) => !item.soon);

  function openItem(item?: PantryItem) {
    setEditing(item ?? null);
    setIsAdding(!item);
    setName(item?.name ?? '');
    setAmount(item?.amount ?? '');
    setSelectedLocation(item?.location ?? 'Fridge');
  }

  function closeEditor() {
    setIsAdding(false);
    setEditing(null);
  }

  function saveItem() {
    const cleanName = name.trim();
    if (!cleanName) return;
    if (editing) {
      setItems((current) => current.map((item) => item.id === editing.id
        ? { ...item, name: cleanName, amount: amount.trim(), location: selectedLocation }
        : item));
    } else {
      setItems((current) => [{ id: `${Date.now()}`, name: cleanName, amount: amount.trim(), location: selectedLocation, soon: false }, ...current]);
    }
    setLocation('All');
    closeEditor();
  }

  function renderRows(rows: PantryItem[]) {
    if (!rows.length) return <Text style={styles.empty}>Nothing to show here.</Text>;
    return (
      <View style={[styles.foodList, view === 'grid' && styles.foodGrid]}>
        {rows.map((item) => {
          const expiryInfo = expiry(item);
          return view === 'grid' ? (
            <Pressable key={item.id} accessibilityRole="button" onPress={() => openItem(item)} style={({ pressed }) => [styles.tile, locationStyle(item.location), pressed && styles.pressed]}>
              <View style={styles.tileTop}>
                <Text numberOfLines={2} style={styles.tileName}>{item.name}</Text>
                <View style={[styles.expiryBadge, { backgroundColor: expiryInfo.color }]}><Text style={styles.expiryText}>{expiryInfo.label}</Text></View>
              </View>
              <View style={styles.tileBottom}>
                <Text numberOfLines={1} style={styles.tileAmount}>{item.amount || 'Amount not set'}</Text>
                <Text numberOfLines={1} style={styles.tileLocation}>{item.location}</Text>
              </View>
            </Pressable>
          ) : (
            <Pressable key={item.id} accessibilityRole="button" onPress={() => openItem(item)} style={({ pressed }) => [styles.foodRow, locationStyle(item.location), pressed && styles.pressed]}>
              <View style={styles.foodCopy}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodMeta}>{item.location}{item.note ? ` · ${item.note}` : ''}</Text>
              </View>
              <Text style={styles.foodAmount}>{item.amount || 'Amount not set'}<Text style={styles.amountHint}>{'\n'}in Pantry</Text></Text>
              <Text style={styles.rowMenu}>···</Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={(event) => setCollapsed(event.nativeEvent.contentOffset.y > 85)}
        scrollEventThrottle={16}>
        <View style={styles.brandRow}><Text style={styles.brand}>No Crumbs</Text><Pressable accessibilityRole="button" accessibilityLabel="Profile" style={styles.profile}><Text style={styles.profileText}>R</Text></Pressable></View>
        <View style={styles.stickyTools}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Your Pantry</Text>
            <Text style={styles.itemTotal}>{items.length} items</Text>
            <View style={styles.viewToggle}>
              <Pressable accessibilityRole="button" accessibilityLabel="List view" accessibilityState={{ selected: view === 'list' }} onPress={() => setView('list')} style={[styles.viewButton, view === 'list' && styles.viewSelected]}><Text style={[styles.viewIcon, view === 'list' && styles.viewIconSelected]}>☰</Text></Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Grid view" accessibilityState={{ selected: view === 'grid' }} onPress={() => setView('grid')} style={[styles.viewButton, view === 'grid' && styles.viewSelected]}><Text style={[styles.viewIcon, view === 'grid' && styles.viewIconSelected]}>▦</Text></Pressable>
            </View>
          </View>
          {!collapsed ? <Text style={styles.chooseLabel}>CHOOSE A SPACE</Text> : null}
          <View style={[styles.storageStage, collapsed && styles.storageStageCollapsed]}>
            {!collapsed ? <Image source={require('../../assets/images/pantry-storage-fridge-freezer-pantry.png')} resizeMode="contain" style={styles.storageImage} /> : null}
            {locations.map((space) => {
              const count = items.filter((item) => item.location === space).length;
              const active = location === space;
              return (
                <Pressable key={space} accessibilityRole="button" accessibilityLabel={`Show ${space}; tap again to show all`} accessibilityState={{ selected: active }} onPress={() => setLocation(location === space ? 'All' : space)} style={styles.storageButton}>
                  <Text style={[styles.locationPill, space === 'Fridge' ? styles.fridgePill : space === 'Freezer' ? styles.freezerPill : styles.pantryPill, collapsed && styles.compactPill, active && styles.activePill]}>{space}</Text>
                  {!collapsed ? <Text style={styles.storageCount}>{count} items</Text> : null}
                </Pressable>
              );
            })}
          </View>
          <View style={styles.searchRow}>
            <Text style={styles.searchGlyph}>⌕</Text>
            <TextInput value={query} onChangeText={setQuery} placeholder="Search your food" placeholderTextColor={colors.muted} accessibilityLabel="Search inventory" style={styles.searchInput} returnKeyType="search" />
            <Pressable accessibilityRole="button" onPress={() => openItem()} style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}><Text style={styles.addText}>＋ Add</Text></Pressable>
          </View>
        </View>

        <View style={styles.inventory}>
          {soonItems.length ? (
            <View style={styles.group}>
              <View style={styles.groupTitleRow}><View style={styles.clock}><Text style={styles.clockText}>◷</Text></View><View><Text style={styles.groupTitle}>Use soon</Text><Text style={styles.groupSubtitle}>Based on dates you’ve added</Text></View><Text style={styles.groupCount}>{soonItems.length} items</Text></View>
              {renderRows(soonItems)}
            </View>
          ) : null}
          <View style={[styles.group, styles.everythingGroup]}>
            <View style={styles.groupTitleRow}><Text style={styles.groupTitle}>Everything else</Text><Pressable accessibilityRole="button" onPress={() => setSortNewest((value) => !value)}><Text style={styles.sort}>{sortNewest ? 'Recently added⌄' : 'Oldest added⌄'}</Text></Pressable></View>
            {renderRows(otherItems)}
          </View>
        </View>
      </ScrollView>

      <Modal visible={isAdding || !!editing} transparent animationType="slide" onRequestClose={closeEditor}>
        <KeyboardAvoidingView style={styles.modalScrim} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeEditor} accessibilityLabel="Close item editor" />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{editing ? 'Edit Pantry item' : 'Add to your Pantry'}</Text>
            <Text style={styles.sheetSubtitle}>Choose a location if you know where it lives. You can change this later.</Text>
            <Text style={styles.fieldLabel}>Food name</Text><TextInput value={name} onChangeText={setName} placeholder="e.g. Greek yogurt" placeholderTextColor={colors.muted} style={styles.field} autoFocus />
            <Text style={styles.fieldLabel}>Amount</Text><TextInput value={amount} onChangeText={setAmount} placeholder="e.g. 1 tub, about 2 cups" placeholderTextColor={colors.muted} style={styles.field} />
            <Text style={styles.fieldLabel}>Storage location</Text>
            <View style={styles.locationChoices}>{[...locations, 'Other' as Location].map((space) => <Pressable key={space} onPress={() => setSelectedLocation(space)} style={[styles.choice, selectedLocation === space && styles.choiceSelected]}><Text style={[styles.choiceText, selectedLocation === space && styles.choiceTextSelected]}>{space === 'Other' ? 'Other / not sure' : space}</Text></Pressable>)}</View>
            <View style={styles.sheetActions}><Pressable onPress={closeEditor} style={[styles.action, styles.cancel]}><Text style={styles.cancelText}>Cancel</Text></Pressable><Pressable onPress={saveItem} style={[styles.action, styles.save]}><Text style={styles.saveText}>{editing ? 'Save changes' : 'Add item'}</Text></Pressable></View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function locationStyle(location: Location) {
  if (location === 'Fridge') return styles.fridgeRow;
  if (location === 'Freezer') return styles.freezerRow;
  if (location === 'Pantry') return styles.pantryRow;
  return styles.otherRow;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F1E7D9' },
  brandRow: { height: 46, paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F1E7D9' },
  brand: { color: colors.herb, fontSize: 19, fontWeight: '900', letterSpacing: -0.7 },
  profile: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  profileText: { color: colors.herb, fontSize: 12, fontWeight: '900' },
  screen: { flex: 1, backgroundColor: '#F1E7D9' },
  scrollContent: { paddingBottom: 24 },
  stickyTools: { paddingHorizontal: 13, paddingTop: 8, paddingBottom: 9, backgroundColor: '#F1E7D9', zIndex: 3 },
  titleRow: { minHeight: 31, flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 },
  title: { color: colors.ink, fontSize: 23, fontWeight: '900', letterSpacing: -0.8 },
  itemTotal: { color: colors.muted, fontSize: 9, fontWeight: '800', flex: 1, textAlign: 'right' },
  viewToggle: { flexDirection: 'row', gap: 2, padding: 2, borderRadius: 9, borderWidth: 1, borderColor: '#D8CDB9', backgroundColor: '#FFFAF1' },
  viewButton: { width: 25, height: 23, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  viewSelected: { backgroundColor: colors.herb },
  viewIcon: { color: colors.muted, fontSize: 13, lineHeight: 17 },
  viewIconSelected: { color: '#FFFFFF' },
  chooseLabel: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 0.8, marginLeft: 2 },
  storageStage: { height: 149, position: 'relative', flexDirection: 'row', alignItems: 'stretch', marginTop: 1, overflow: 'hidden' },
  storageStageCollapsed: { height: 32, marginTop: 0 },
  storageImage: { position: 'absolute', left: 0, right: 0, top: 0, width: '100%', height: 124 },
  storageButton: { flex: 1, minWidth: 0, zIndex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 2 },
  locationPill: { overflow: 'hidden', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, fontSize: 9, fontWeight: '900' },
  fridgePill: { color: '#FFFFFF', backgroundColor: colors.tomato },
  freezerPill: { color: colors.ink, backgroundColor: '#A9CFE0' },
  pantryPill: { color: '#FFFFFF', backgroundColor: colors.celadon },
  activePill: { borderWidth: 1, borderColor: colors.deepHerb },
  compactPill: { color: colors.ink, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, fontSize: 8, paddingVertical: 4 },
  storageCount: { color: colors.muted, fontSize: 7, marginTop: 2 },
  searchRow: { height: 38, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 10, borderRadius: 13, borderWidth: 1, borderColor: '#D9DFD1', backgroundColor: colors.surface },
  searchGlyph: { color: colors.herb, fontSize: 16 },
  searchInput: { flex: 1, minWidth: 0, paddingVertical: 0, color: colors.ink, fontSize: 11 },
  addButton: { height: 29, paddingHorizontal: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.herb },
  addText: { color: '#FFFFFF', fontSize: 9, fontWeight: '900' },
  inventory: { paddingHorizontal: 8, paddingTop: 9, gap: 10 },
  group: { padding: 8, borderWidth: 1, borderColor: '#EAD8B8', borderRadius: 17, backgroundColor: '#FFF4E2' },
  everythingGroup: { marginBottom: 18 },
  groupTitleRow: { minHeight: 32, flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 2, marginBottom: 6 },
  clock: { width: 29, height: 29, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.apricot },
  clockText: { color: '#634E32', fontSize: 15 },
  groupTitle: { color: colors.ink, fontSize: 14, fontWeight: '900', letterSpacing: -0.3 },
  groupSubtitle: { color: colors.muted, fontSize: 8, marginTop: 1 },
  groupCount: { color: colors.muted, fontSize: 8, fontWeight: '900', marginLeft: 'auto' },
  sort: { color: colors.herb, fontSize: 8, fontWeight: '900' },
  foodList: { gap: 5 },
  foodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  foodRow: { minHeight: 45, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 7, paddingHorizontal: 9, borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  foodCopy: { flex: 1, minWidth: 0 },
  foodName: { color: colors.ink, fontSize: 10, fontWeight: '900' },
  foodMeta: { color: colors.muted, fontSize: 8, marginTop: 3 },
  foodAmount: { color: colors.deepHerb, fontSize: 9, fontWeight: '900', textAlign: 'right' },
  amountHint: { color: colors.muted, fontSize: 7, fontWeight: '600' },
  rowMenu: { color: '#819087', fontSize: 15, fontWeight: '900', paddingHorizontal: 2 },
  fridgeRow: { backgroundColor: '#FBEAE0', borderColor: '#E8B49A' },
  freezerRow: { backgroundColor: '#EDF5F5', borderColor: '#B7D2DC' },
  pantryRow: { backgroundColor: '#EDF3E9', borderColor: '#BDD0BE' },
  otherRow: { backgroundColor: '#FFF3D2', borderColor: '#E5D18E' },
  tile: { width: '31.5%', aspectRatio: 1, minWidth: 0, padding: 6, borderRadius: 12, borderWidth: 1, borderColor: colors.line, justifyContent: 'space-between', overflow: 'hidden' },
  tileTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 },
  tileName: { flex: 1, color: colors.ink, fontSize: 8, lineHeight: 10, fontWeight: '900' },
  expiryBadge: { width: 23, height: 23, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  expiryText: { color: colors.ink, fontSize: 7, fontWeight: '900' },
  tileBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 3 },
  tileAmount: { flex: 1, color: colors.ink, fontSize: 7, fontWeight: '900' },
  tileLocation: { maxWidth: '42%', color: colors.deepHerb, fontSize: 6, fontWeight: '900', textAlign: 'right' },
  empty: { padding: 14, color: colors.muted, textAlign: 'center', fontSize: 10 },
  pressed: { opacity: 0.78 },
  modalScrim: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#1F2C2866' },
  sheet: { padding: 18, paddingBottom: 28, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: colors.canvas },
  sheetTitle: { color: colors.ink, fontSize: 18, fontWeight: '900' },
  sheetSubtitle: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 4, marginBottom: 12 },
  fieldLabel: { color: colors.deepHerb, fontSize: 9, fontWeight: '900', marginBottom: 5, marginTop: 7 },
  field: { height: 40, borderWidth: 1, borderColor: colors.line, borderRadius: 11, backgroundColor: colors.surface, paddingHorizontal: 11, color: colors.ink, fontSize: 11 },
  locationChoices: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  choice: { borderWidth: 1, borderColor: colors.line, borderRadius: 14, paddingVertical: 7, paddingHorizontal: 9, backgroundColor: colors.surface },
  choiceSelected: { borderColor: colors.herb, backgroundColor: '#E4EEE5' },
  choiceText: { color: colors.ink, fontSize: 8, fontWeight: '700' },
  choiceTextSelected: { color: colors.deepHerb, fontWeight: '900' },
  sheetActions: { flexDirection: 'row', gap: 8, marginTop: 16 },
  action: { flex: 1, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancel: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  save: { backgroundColor: colors.herb },
  cancelText: { color: colors.deepHerb, fontSize: 10, fontWeight: '900' },
  saveText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
});
