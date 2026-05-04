import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTrending } from '../../src/hooks/useTrending';
import { useSearchStore } from '../../src/store/searchStore';
import { getAllWords } from '../../src/services/dictionaryService';
import { useSettingsStore } from '../../src/store/settingsStore';
import { getThemeColors } from '../../src/theme/colors';

export default function TrendingScreen() {
  const router = useRouter();
  const { stats, mostSearched, mostSaved } = useTrending();
  const allWords = getAllWords();

  const systemScheme = useColorScheme();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const colors = getThemeColors(themeMode, systemScheme);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const searchedWords = mostSearched
    .map((name) => allWords.find((w) => w.word === name))
    .filter(Boolean);

  const savedWordsDisplay = mostSaved
    .map((name) => allWords.find((w) => w.word === name))
    .filter(Boolean);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trending</Text>
        <Text style={styles.subtitle}>Your learning stats</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialIcons name="book" size={28} color={colors.primary} />
            <Text style={styles.statValue}>{stats.totalWords}</Text>
            <Text style={styles.statLabel}>Total Words</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="bookmark" size={28} color={colors.primary} />
            <Text style={styles.statValue}>{stats.savedCount}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="search" size={28} color={colors.primary} />
            <Text style={styles.statValue}>{stats.searchedCount}</Text>
            <Text style={styles.statLabel}>Searched</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="trending-up" size={28} color={colors.primary} />
            <Text style={styles.statValue}>{stats.masterScore}%</Text>
            <Text style={styles.statLabel}>Mastery</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            <MaterialIcons name="bookmark" size={14} color={colors.primary} /> Most Saved
          </Text>
          {savedWordsDisplay.length === 0 ? (
            <Text style={styles.emptyText}>No saved words yet</Text>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={savedWordsDisplay}
              keyExtractor={(item) => item!.id}
              renderItem={({ item, index }) => (
                <TouchableOpacity style={styles.trendingRow} onPress={() => router.push(`/word/${item!.id}`)}>
                  <View style={styles.ranking}>
                    <Text style={styles.rankingNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.trendingInfo}>
                    <Text style={styles.trendingWord}>{item!.word}</Text>
                    <Text style={styles.trendingDef} numberOfLines={1}>
                      {item!.definition}
                    </Text>
                  </View>
                  <MaterialIcons name="arrow-forward" size={20} color={colors.iconInactive} />
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            <MaterialIcons name="trending-up" size={14} color={colors.primary} /> Most Searched
          </Text>
          {searchedWords.length === 0 ? (
            <Text style={styles.emptyText}>No searches yet</Text>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={searchedWords}
              keyExtractor={(item) => item!.id}
              renderItem={({ item, index }) => (
                <TouchableOpacity style={styles.trendingRow} onPress={() => router.push(`/word/${item!.id}`)}>
                  <View style={styles.ranking}>
                    <Text style={styles.rankingNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.trendingInfo}>
                    <Text style={styles.trendingWord}>{item!.word}</Text>
                    <Text style={styles.trendingDef} numberOfLines={1}>
                      {item!.definition}
                    </Text>
                  </View>
                  <MaterialIcons name="arrow-forward" size={20} color={colors.iconInactive} />
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
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8,
    },
    statCard: {
      flexBasis: '48%',
      paddingVertical: 16,
      paddingHorizontal: 12,
      backgroundColor: colors.surface,
      borderRadius: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    statValue: { fontSize: 24, fontWeight: '800', color: colors.primary, marginVertical: 6 },
    statLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '700', textTransform: 'uppercase' },
    section: { paddingHorizontal: 16, paddingVertical: 16 },
    sectionLabel: {
      fontSize: 12,
      fontWeight: '800',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      marginBottom: 12,
      letterSpacing: 0.5,
    },
    trendingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      marginBottom: 8,
      backgroundColor: colors.surface,
      borderRadius: 10,
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    ranking: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rankingNumber: { fontSize: 16, fontWeight: '800', color: colors.surface },
    trendingInfo: { flex: 1 },
    trendingWord: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
    trendingDef: { fontSize: 12, color: colors.textSecondary },
    emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingVertical: 20 },
  });
}

