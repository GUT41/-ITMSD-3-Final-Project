import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { getWordById } from '../../src/services/dictionaryService';
import { useSearchStore } from '../../src/store/searchStore';
import { addSavedWord, removeSavedWord } from '../../src/services/storageService';

export default function WordDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const word = getWordById(typeof id === 'string' ? id : '');
  const savedWords = useSearchStore((state) => state.savedWords);
  const setSavedWords = useSearchStore((state) => state.setSavedWords);

  if (!word) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <MaterialIcons name="info-outline" size={48} color="#ddd" />
          <Text style={styles.errorText}>Word not found</Text>
        </View>
      </View>
    );
  }

  const isSaved = savedWords.some((w) => w.id === word.id);

  const handleSave = async () => {
    try {
      if (isSaved) {
        await removeSavedWord(word.id);
        setSavedWords(savedWords.filter((w) => w.id !== word.id));
      } else {
        await addSavedWord(word);
        setSavedWords([word, ...savedWords]);
      }
    } catch (error) {
      console.error('Error saving word:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, isSaved && styles.saveButtonActive]}
          onPress={handleSave}
        >
          <MaterialIcons
            name={isSaved ? 'bookmark' : 'bookmark-border'}
            size={24}
            color={isSaved ? '#0F6E56' : '#ccc'}
          />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Word Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.word}>{word.word}</Text>

          {word.pronunciation && (
            <Text style={styles.pronunciation}>{word.pronunciation}</Text>
          )}

          {/* Part of Speech Badge */}
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{word.partOfSpeech}</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Definition Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            <MaterialIcons name="description" size={14} color="#0F6E56" /> Definition
          </Text>
          <Text style={styles.definition}>{word.definition}</Text>
        </View>

        {/* Example Section */}
        {word.example && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              <MaterialIcons name="lightbulb" size={14} color="#0F6E56" /> Example
            </Text>
            <View style={styles.exampleBox}>
              <Text style={styles.example}>"{word.example}"</Text>
            </View>
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <MaterialIcons name="tag" size={14} color="#999" />
            <Text style={styles.infoText}>ID: {word.id}</Text>
          </View>
          {word.pronunciation && (
            <View style={styles.infoItem}>
              <MaterialIcons name="volume-up" size={14} color="#999" />
              <Text style={styles.infoText}>{word.pronunciation}</Text>
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  titleSection: {
    paddingVertical: 24,
    backgroundColor: '#fff',
    marginTop: 12,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  word: {
    fontSize: 40,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  pronunciation: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 12,
    fontWeight: '400',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e8f5f0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#0F6E56',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F6E56',
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  definition: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
    fontWeight: '400',
  },
  exampleBox: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#0F6E56',
    borderRadius: 4,
  },
  example: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    fontStyle: 'italic',
    fontWeight: '400',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    marginTop: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
  },
  saveButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonActive: {
    backgroundColor: '#f0f8f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  bottomSpacing: {
    height: 40,
  },
});