import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getWordById } from '../../src/services/dictionaryService';
import { colors } from '../../src/constants/theme';

export default function WordDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const word = getWordById(typeof id === 'string' ? id : '');

  if (!word) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text>Word not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backButton}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.word}>{word.word}</Text>
      <Text style={styles.pronunciation}>{word.pronunciation}</Text>
      <Text style={styles.partOfSpeech}>{word.partOfSpeech}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Definition</Text>
        <Text style={styles.text}>{word.definition}</Text>
      </View>

      {word.example && (
        <View style={styles.section}>
          <Text style={styles.label}>Example</Text>
          <Text style={styles.text}>{word.example}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    paddingTop: 40,
  },
  word: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  backButton: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 12,
  },
  pronunciation: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  partOfSpeech: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
  },
});