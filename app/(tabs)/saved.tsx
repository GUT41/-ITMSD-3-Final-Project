import { View, Text, FlatList, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useSearchStore } from '../../src/store/searchStore';
import { removeSavedWord } from '../../src/services/storageService';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '../../src/store/settingsStore';
import { getThemeColors } from '../../src/theme/colors';

export default function SavedScreen() {
  const systemScheme = useColorScheme();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const colors = getThemeColors(themeMode, systemScheme);
  const styles = useMemo(() => createStyles(colors), [colors]);
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
          <MaterialIcons name="bookmark-outline" size={48} color={colors.iconInactive} />
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
              <MaterialIcons name="delete" size={24} color={colors.danger} />
            </TouchableOpacity>
          </View>
        )}
      />
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
      marginBottom: 16,
      color: colors.textPrimary,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
      marginTop: 16,
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textMuted,
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
    removeButton: {
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
  });
}