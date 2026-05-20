import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSearchStore } from '../../src/store/searchStore';
import { getAllWords } from '../../src/services/dictionaryService';
import { useSearch } from '../../src/hooks/useSearch';
import { useMemo, useState } from 'react';
import { addSavedWord, removeSavedWord } from '../../src/services/storageService';
import { SearchResult } from '../../src/types';
import { useColorScheme } from 'react-native';
import { getThemeColors } from '../../src/theme/colors';
import { useSettingsStore } from '../../src/store/settingsStore';

const MAX_BROWSE_PREVIEW = 200;

export default function SearchScreen() {
  const router = useRouter();
  const systemScheme = useColorScheme();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const colors = getThemeColors(themeMode, systemScheme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [inputValue, setInputValue] = useState('');
  const { debouncedSearch } = useSearch();
  const results = useSearchStore((state) => state.results);
  const allWords = getAllWords();
  const savedWords = useSearchStore((state) => state.savedWords);
  const setSavedWords = useSearchStore((state) => state.setSavedWords);
  const searchHistory = useSearchStore((state) => state.searchHistory);
  const setSearchQuery = useSearchStore((state) => state.setSearchQuery);

  const savedWordIds = useMemo(() => new Set(savedWords.map((w) => w.id)), [savedWords]);

  const handleSearch = (text: string) => {
    setInputValue(text);
    debouncedSearch(text);
  };

  const handleHistoryTap = (query: string) => {
    setInputValue(query);
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSaveWord = async (word: typeof allWords[0]) => {
    try {
      if (savedWordIds.has(word.id)) {
        // Remove
        await removeSavedWord(word.id);
        setSavedWords(savedWords.filter((w) => w.id !== word.id));
      } else {
        // Add
        await addSavedWord(word);
        setSavedWords([word, ...savedWords]);
      }
    } catch (error) {
      console.error('Error saving word:', error);
    }
  };

  const isSearching = !!inputValue.trim();
  const displayData: SearchResult[] = isSearching ? results : allWords.slice(0, MAX_BROWSE_PREVIEW);
  const showHistory = !inputValue.trim() && searchHistory.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>LexiSearch</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/settings')}>
          <MaterialIcons name="settings" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search words..."
        placeholderTextColor="#999"
        value={inputValue}
        onChangeText={handleSearch}
      />

      {showHistory && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyLabel}>Recent Searches</Text>
          <View style={styles.historyChips}>
            {searchHistory.slice(0, 5).map((query, idx) => (
              <TouchableOpacity
                key={`${query}-${idx}`}
                style={styles.historyChip}
                onPress={() => handleHistoryTap(query)}
              >
                <Text style={styles.historyChipText}>{query}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <Text style={styles.count}>
        {isSearching
          ? `${displayData.length} found`
          : `Showing ${displayData.length} of ${allWords.length} words`}
        {' '}✓
      </Text>

      {displayData.length === 0 && inputValue ? (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>No words found</Text>
          <Text style={styles.noResultsSubtext}>Try a different search</Text>
        </View>
      ) : (
        <FlatList
          data={displayData}
          keyExtractor={(item) => item.id}
          initialNumToRender={20}
          maxToRenderPerBatch={24}
          windowSize={10}
          removeClippedSubviews
          renderItem={({ item }) => {
            const isSaved = savedWordIds.has(item.id);
            return (
              <View style={styles.wordRowContainer}>
                <TouchableOpacity
                  style={styles.wordRow}
                  onPress={() => router.push(`/word/${item.id}`)}
                >
                  <View style={styles.wordContent}>
                    <Text style={styles.word}>{item.word}</Text>
                    <Text style={styles.def} numberOfLines={1}>
                      {item.definition}
                    </Text>
                  </View>
                  {item.distance !== undefined && (
                    <Text style={styles.distance}>~{item.distance}</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleSaveWord(item)}
                >
                  <MaterialIcons
                    name={isSaved ? 'bookmark' : 'bookmark-border'}
                    size={24}
                    color={isSaved ? colors.primary : colors.iconInactive}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

function createStyles(colors: ReturnType<typeof getThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 20,
      paddingHorizontal: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 12,
      color: colors.textPrimary,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    settingsButton: {
      paddingHorizontal: 8,
      paddingVertical: 8,
    },
    searchInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      marginBottom: 12,
      color: colors.textPrimary,
      backgroundColor: colors.surface,
    },
    historyContainer: {
      marginBottom: 12,
    },
    historyLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      marginBottom: 8,
    },
    historyChips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    historyChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.surfaceMuted,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    historyChipText: {
      fontSize: 12,
      color: colors.textPrimary,
    },
    count: {
      fontSize: 12,
      color: colors.primary,
      marginBottom: 12,
      fontWeight: '500',
    },
    wordRowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 8,
    },
    wordRow: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: colors.surfaceMuted,
      borderRadius: 8,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
      alignItems: 'center',
    },
    wordContent: {
      flex: 1,
    },
    word: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
      color: colors.textPrimary,
    },
    def: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    distance: {
      fontSize: 11,
      color: colors.textMuted,
      paddingHorizontal: 8,
    },
    saveButton: {
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    noResults: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noResultsText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    noResultsSubtext: {
      fontSize: 14,
      color: colors.textMuted,
    },
  });
}