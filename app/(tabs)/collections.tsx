import { View, Text, ScrollView, TouchableOpacity, FlatList, StyleSheet, useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useCollections } from '../../src/hooks/useCollections';
import { useSearchStore } from '../../src/store/searchStore';
import { getAllCategories, getWordsByDifficulty, getWordsByCategory } from '../../src/services/dictionaryService';
import { useSettingsStore } from '../../src/store/settingsStore';
import { getThemeColors } from '../../src/theme/colors';

const MAX_COLLECTION_RESULTS = 400;

export default function CollectionsScreen() {
  const router = useRouter();
  const difficulty = useSearchStore((state) => state.currentDifficulty);
  const setDifficulty = useSearchStore((state) => state.setDifficulty);
  const category = useSearchStore((state) => state.currentCategory);
  const setCategory = useSearchStore((state) => state.setCategory);
  const { filteredWords } = useCollections();

  const systemScheme = useColorScheme();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const colors = getThemeColors(themeMode, systemScheme);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const difficulties = ['beginner', 'intermediate', 'advanced'] as const;
  const categories = getAllCategories();
  const displayedWords = filteredWords.slice(0, MAX_COLLECTION_RESULTS);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner':
        return '#27AE60';
      case 'intermediate':
        return '#F39C12';
      case 'advanced':
        return '#E74C3C';
      default:
        return colors.textMuted;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Collections</Text>
        <Text style={styles.subtitle}>Learn by difficulty and category</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>By Difficulty</Text>
          <View style={styles.filterRow}>
            {difficulties.map((diff) => {
              const count = getWordsByDifficulty(diff).length;
              const isActive = difficulty === diff;
              return (
                <TouchableOpacity
                  key={diff}
                  style={[styles.filterButton, isActive && styles.filterButtonActive]}
                  onPress={() => setDifficulty(diff)}
                >
                  <View style={[styles.difficultyDot, { backgroundColor: getDifficultyColor(diff) }]} />
                  <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </Text>
                  <Text style={styles.filterButtonCount}>{count}</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={[styles.filterButton, difficulty === 'all' && styles.filterButtonActive]}
              onPress={() => setDifficulty('all')}
            >
              <Text style={[styles.filterButtonText, difficulty === 'all' && styles.filterButtonTextActive]}>All</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>By Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => {
              const count = getWordsByCategory(cat).length;
              const isActive = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryButton, isActive && styles.categoryButtonActive]}
                  onPress={() => setCategory(isActive ? null : cat)}
                >
                  <Text style={[styles.categoryButtonText, isActive && styles.categoryButtonTextActive]}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                  <Text style={[styles.categoryCount, isActive && styles.categoryCountActive]}>{count}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Showing {displayedWords.length} of {filteredWords.length} Word{filteredWords.length !== 1 ? 's' : ''}
          </Text>
          {displayedWords.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="inbox" size={48} color={colors.iconInactive} />
              <Text style={styles.emptyText}>No words found</Text>
            </View>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={displayedWords}
              keyExtractor={(item) => item.id}
              initialNumToRender={30}
              maxToRenderPerBatch={30}
              windowSize={8}
              removeClippedSubviews
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.wordRow}
                  onPress={() => router.push(`/word/${item.id}`)}
                  activeOpacity={0.7}
                >
                  <View style={styles.wordInfo}>
                    <Text style={styles.wordName}>{item.word}</Text>
                    <Text style={styles.wordDef} numberOfLines={1}>
                      {item.definition}
                    </Text>
                  </View>
                  {!!item.difficulty && (
                    <View style={[styles.diffBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
                      <Text style={styles.diffBadgeText}>{item.difficulty.charAt(0).toUpperCase()}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof getThemeColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: 20,
      paddingHorizontal: 16,
      paddingBottom: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: { fontSize: 32, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
    subtitle: { fontSize: 12, color: colors.textMuted },
    section: { paddingHorizontal: 16, paddingVertical: 16 },
    sectionLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      marginBottom: 12,
      letterSpacing: 0.5,
    },
    filterRow: { flexDirection: 'row', gap: 8 },
    filterButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    filterButtonText: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
    filterButtonTextActive: { color: colors.surface },
    filterButtonCount: { fontSize: 10, color: colors.textMuted, fontWeight: '700' },
    difficultyDot: { width: 8, height: 8, borderRadius: 4 },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    categoryButton: {
      flexBasis: '48%',
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    categoryButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    categoryButtonText: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
    categoryButtonTextActive: { color: colors.surface },
    categoryCount: { fontSize: 11, color: colors.textMuted, fontWeight: '700' },
    categoryCountActive: { color: colors.surface, opacity: 0.9 },
    wordRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      marginBottom: 8,
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
    },
    wordInfo: { flex: 1 },
    wordName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
    wordDef: { fontSize: 12, color: colors.textSecondary },
    diffBadge: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    diffBadgeText: { fontSize: 14, fontWeight: '800', color: '#fff' },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
    emptyText: { fontSize: 14, color: colors.textMuted, marginTop: 12 },
  });
}

