import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSearchStore } from '../../src/store/searchStore';
import { getAllWords } from '../../src/services/dictionaryService';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
  const router = useRouter();
  const allWords = getAllWords();
  const sampleWords = allWords.slice(0, 10);

  const handleWordTap = (wordId: string) => {
    router.push(`/word/${wordId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LexiSearch</Text>
      <Text style={styles.subtitle}>
        {allWords.length} words loaded ✓
      </Text>

      <Text style={styles.sectionTitle}>Sample Words</Text>

      <FlatList
        data={sampleWords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.wordRow}
            onPress={() => handleWordTap(item.id)}
          >
            <Text style={styles.wordName}>{item.word}</Text>
            <Text style={styles.wordDef} numberOfLines={1}>
              {item.definition}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#0F6E56',
    marginBottom: 20,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  wordRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0F6E56',
  },
  wordName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  wordDef: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});