import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSearchStore } from '../../src/store/searchStore';
import { getAllWords, isDictionaryReady } from '../../src/services/dictionaryService';
import { useSearch } from '../../src/hooks/useSearch';
import { useState } from 'react';
import { SearchResult } from '../../src/types';

export default function SearchScreen() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const { debouncedSearch } = useSearch();
  const results = useSearchStore((state) => state.results);
  const allWords = getAllWords();
  const isReady = isDictionaryReady();

  const handleSearch = (text: string) => {
    setInputValue(text);
    debouncedSearch(text);
  };

  const displayData: SearchResult[] = inputValue.trim() ? results : allWords;

  if (!isReady) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>LexiSearch</Text>
        <Text style={styles.loadingText}>Loading dictionary...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LexiSearch</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search words..."
        placeholderTextColor="#999"
        value={inputValue}
        onChangeText={handleSearch}
      />

      <Text style={styles.count}>
        {displayData.length} {inputValue ? 'found' : 'words'} ✓
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
          renderItem={({ item }) => (
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
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  count: {
    fontSize: 12,
    color: '#0F6E56',
    marginBottom: 12,
    fontWeight: '500',
  },
  wordRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0F6E56',
    alignItems: 'center',
  },
  wordContent: {
    flex: 1,
  },
  word: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  def: {
    fontSize: 12,
    color: '#666',
  },
  distance: {
    fontSize: 11,
    color: '#999',
    paddingHorizontal: 8,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
});