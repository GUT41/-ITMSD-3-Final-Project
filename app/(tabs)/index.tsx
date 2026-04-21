import { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getAllWords, initDictionary, isDictionaryReady } from '../../src/services/dictionaryService';
import { useRouter } from 'expo-router';
import { colors } from '../../src/constants/theme';

export default function SearchScreen() {
  const router = useRouter();
  const [words, setWords] = useState(getAllWords());
  const [isRetrying, setIsRetrying] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reloadWords = useCallback(async () => {
    setIsRetrying(true);
    setLoadError(null);
    try {
      await initDictionary();
      setWords(getAllWords());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Dictionary initialization failed.';
      setLoadError(message);
    } finally {
      setIsRetrying(false);
    }
  }, []);

  useEffect(() => {
    if (isDictionaryReady()) {
      setWords(getAllWords());
      return;
    }
    reloadWords();
  }, [reloadWords]);

  if (!isDictionaryReady() || loadError) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>LexiSearch</Text>
        <Text style={styles.errorText}>
          {loadError ?? 'Dictionary failed to initialize. Retry to load words.'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={reloadWords} disabled={isRetrying}>
          <Text style={styles.retryButtonText}>{isRetrying ? 'Retrying...' : 'Retry Load'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.settingsLink} onPress={() => router.push('/settings')}>
        <Text style={styles.settingsLinkText}>Settings</Text>
      </TouchableOpacity>
      <Text style={styles.title}>LexiSearch</Text>
      <Text style={styles.count}>{words.length} words loaded ✓</Text>

      <FlatList
        data={words}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.wordRow}
            onPress={() => router.push(`/word/${item.id}`)}
          >
            <Text style={styles.word}>{item.word}</Text>
            <Text style={styles.def} numberOfLines={1}>{item.definition}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  count: {
    fontSize: 12,
    color: colors.primary,
    marginBottom: 16,
  },
  wordRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  word: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  def: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 14,
    color: colors.danger,
    marginBottom: 12,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
  settingsLink: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  settingsLinkText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});