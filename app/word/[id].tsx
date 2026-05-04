import { View, Text, ScrollView, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { getRelatedWords, getWordById } from '../../src/services/dictionaryService';
import { useSearchStore } from '../../src/store/searchStore';
import { addSavedWord, removeSavedWord } from '../../src/services/storageService';
import { useSettingsStore } from '../../src/store/settingsStore';
import { getThemeColors } from '../../src/theme/colors';

export default function WordDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const word = getWordById(typeof id === 'string' ? id : '');
  const savedWords = useSearchStore((state) => state.savedWords);
  const setSavedWords = useSearchStore((state) => state.setSavedWords);
  const systemScheme = useColorScheme();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const colors = getThemeColors(themeMode, systemScheme);
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!word) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
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
  const related = getRelatedWords(word.id);

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
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, isSaved && styles.saveButtonActive]}
          onPress={handleSave}
        >
          <MaterialIcons
            name={isSaved ? 'bookmark' : 'bookmark-border'}
            size={24}
            color={isSaved ? colors.primary : colors.iconInactive}
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
              <MaterialIcons name="lightbulb" size={14} color={colors.primary} /> Example
            </Text>
            <View style={styles.exampleBox}>
              <Text style={styles.example}>"{word.example}"</Text>
            </View>
          </View>
        )}

        {/* Related Words */}
        {related.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Related Words</Text>
            <View style={styles.relatedWordsContainer}>
              {related.map((rel) => (
                <TouchableOpacity
                  key={rel.id}
                  style={styles.relatedWordChip}
                  onPress={() => router.push(`/word/${rel.id}`)}
                >
                  <Text style={styles.relatedWordText}>{rel.word}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Etymology */}
        {!!word.etymology && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Etymology</Text>
            <Text style={styles.etymology}>{word.etymology}</Text>
          </View>
        )}

        {/* Tags */}
        {!!word.tags?.length && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tags</Text>
            <View style={styles.tagsContainer}>
              {word.tags.map((tag) => (
                <View key={tag} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
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

function createStyles(colors: ReturnType<typeof getThemeColors>) {
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  titleSection: {
    paddingVertical: 24,
    backgroundColor: colors.surface,
    marginTop: 12,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  word: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  pronunciation: {
    fontSize: 16,
    color: colors.textSecondary,
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
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  definition: {
    fontSize: 18,
    lineHeight: 28,
    color: colors.textPrimary,
    fontWeight: '400',
  },
  exampleBox: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderRadius: 4,
  },
  example: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    fontStyle: 'italic',
    fontWeight: '400',
  },
  infoSection: {
    backgroundColor: colors.surface,
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
    color: colors.textMuted,
    fontWeight: '400',
  },
  saveButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonActive: {
    backgroundColor: colors.surfaceMuted,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 12,
  },
  relatedWordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relatedWordChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  relatedWordText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  etymology: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '700',
    textTransform: 'lowercase',
  },
  bottomSpacing: {
    height: 40,
  },
});
}