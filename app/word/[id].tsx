import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { getRelatedWords, getWordById } from '../../src/services/dictionaryService';
import { useSearchStore } from '../../src/store/searchStore';
import { addSavedWord, removeSavedWord } from '../../src/services/storageService';
import { useSettingsStore } from '../../src/store/settingsStore';
import { getThemeColors } from '../../src/theme/colors';

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'beginner':
      return '#27AE60';
    case 'intermediate':
      return '#F39C12';
    case 'advanced':
      return '#E74C3C';
    default:
      return '#999';
  }
}

export default function WordDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const wordId = typeof id === 'string' ? id : '';
  const word = getWordById(wordId);
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
          <MaterialIcons name="info-outline" size={48} color={colors.iconInactive} />
          <Text style={styles.errorText}>Word not found</Text>
        </View>
      </View>
    );
  }

  const isSaved = savedWords.some((w) => w.id === word.id);
  const related = getRelatedWords(word.id);
  const metaTags = [
    ...(word.tags ?? []),
    word.category,
    word.difficulty,
    word.partOfSpeech,
  ].filter(Boolean) as string[];
  const uniqueMetaTags = [...new Set(metaTags.map((t) => t.toLowerCase()))];

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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.word}>{word.word}</Text>

          {!!word.pronunciation && (
            <Text style={styles.pronunciation}>{word.pronunciation}</Text>
          )}

          <View style={styles.badgeRow}>
            {!!word.partOfSpeech && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{word.partOfSpeech}</Text>
              </View>
            )}
            {!!word.difficulty && (
              <View
                style={[
                  styles.badge,
                  styles.difficultyBadge,
                  { borderColor: getDifficultyColor(word.difficulty) },
                ]}
              >
                <Text
                  style={[styles.badgeText, { color: getDifficultyColor(word.difficulty) }]}
                >
                  {word.difficulty}
                </Text>
              </View>
            )}
            {!!word.category && (
              <View style={[styles.badge, styles.categoryBadge]}>
                <Text style={styles.badgeText}>{word.category}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Definition</Text>
          <Text style={styles.definition}>{word.definition}</Text>
        </View>

        {!!word.example && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Example</Text>
            <View style={styles.exampleBox}>
              <Text style={styles.example}>"{word.example}"</Text>
            </View>
          </View>
        )}

        {uniqueMetaTags.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Tags</Text>
            <View style={styles.tagsContainer}>
              {uniqueMetaTags.map((tag) => (
                <View key={tag} style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {!!word.synonyms?.length && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Synonyms</Text>
            <View style={styles.tagsContainer}>
              {word.synonyms.map((synonym) => (
                <View key={synonym} style={[styles.tagPill, styles.synonymPill]}>
                  <Text style={[styles.tagText, styles.synonymText]}>{synonym}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {!!word.antonyms?.length && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Antonyms</Text>
            <View style={styles.tagsContainer}>
              {word.antonyms.map((antonym) => (
                <View key={antonym} style={[styles.tagPill, styles.antonymPill]}>
                  <Text style={[styles.tagText, styles.antonymText]}>{antonym}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {related.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Related Words</Text>
            <View style={styles.tagsContainer}>
              {related.map((rel) => (
                <TouchableOpacity
                  key={rel.id}
                  style={[styles.tagPill, styles.relatedPill]}
                  onPress={() => router.push(`/word/${rel.id}`)}
                >
                  <Text style={[styles.tagText, styles.relatedText]}>{rel.word}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {!!word.etymology && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Etymology</Text>
            <Text style={styles.bodyText}>{word.etymology}</Text>
          </View>
        )}

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
      paddingVertical: 20,
      marginTop: 12,
    },
    word: {
      fontSize: 40,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 6,
      textTransform: 'capitalize',
    },
    pronunciation: {
      fontSize: 16,
      color: colors.textSecondary,
      fontStyle: 'italic',
      marginBottom: 12,
    },
    badgeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
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
    difficultyBadge: {
      backgroundColor: colors.surface,
    },
    categoryBadge: {
      borderColor: colors.border,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
      textTransform: 'capitalize',
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 14,
      paddingVertical: 14,
      marginBottom: 12,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginBottom: 10,
    },
    definition: {
      fontSize: 17,
      lineHeight: 26,
      color: colors.textPrimary,
    },
    exampleBox: {
      backgroundColor: colors.surfaceMuted,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
      borderRadius: 6,
    },
    example: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textPrimary,
      fontStyle: 'italic',
    },
    bodyText: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textPrimary,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    tagPill: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.surfaceMuted,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tagText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    synonymPill: {
      borderColor: colors.primary,
      backgroundColor: colors.surface,
    },
    synonymText: {
      color: colors.primary,
    },
    antonymPill: {
      borderColor: '#E74C3C',
      backgroundColor: colors.surface,
    },
    antonymText: {
      color: '#E74C3C',
    },
    relatedPill: {
      borderColor: colors.primary,
    },
    relatedText: {
      color: colors.primary,
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
    bottomSpacing: {
      height: 40,
    },
  });
}
