import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSearchStore } from '../../src/store/searchStore';
import { useRouter } from 'expo-router';
import { colors } from '../../src/constants/theme';

export default function SavedScreen() {
  const savedWords = useSearchStore((state) => state.savedWords);
  const router = useRouter();

  if (savedWords.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Saved Words</Text>
        <Text style={styles.empty}>No saved words yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Words ({savedWords.length})</Text>
      <FlatList
        data={savedWords}
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
    padding: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  empty: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
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
});