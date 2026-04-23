import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSearchStore } from '../../src/store/searchStore';
import { removeSavedWord } from '../../src/services/storageService';
import { useRouter } from 'expo-router';

export default function SavedScreen() {
  const router = useRouter();
  const savedWords = useSearchStore((state) => state.savedWords);
  const setSavedWords = useSearchStore((state) => state.setSavedWords);

  const handleRemove = async (wordId: string) => {
    try {
      await removeSavedWord(wordId);
      setSavedWords(savedWords.filter((w) => w.id !== wordId));
    } catch (error) {
      console.error('Error removing word:', error);
    }
  };

  if (savedWords.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Saved Words</Text>
        <View style={styles.emptyState}>
          <MaterialIcons name="bookmark-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No saved words yet</Text>
          <Text style={styles.emptySubtext}>Tap the bookmark icon to save words</Text>
        </View>
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
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemove(item.id)}
            >
              <MaterialIcons name="delete" size={24} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
      />
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
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
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});