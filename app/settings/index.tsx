import { useMemo } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { clearSearchHistory, saveSavedWords } from '../../src/services/storageService';
import { useSearchStore } from '../../src/store/searchStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { getThemeColors, ThemeMode } from '../../src/theme/colors';
import appConfig from '../../app.json';

export default function SettingsScreen() {
  const systemScheme = useColorScheme();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const clearHistory = useSearchStore((state) => state.clearHistory);
  const setSavedWords = useSearchStore((state) => state.setSavedWords);
  const colors = getThemeColors(themeMode, systemScheme);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleThemeModeChange = async (mode: ThemeMode) => {
    await setThemeMode(mode);
  };

  const confirmClearHistory = () => {
    Alert.alert(
      'Clear search history?',
      'This will remove all recent searches from the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearSearchHistory();
            clearHistory();
          },
        },
      ]
    );
  };

  const confirmClearSavedWords = () => {
    Alert.alert(
      'Clear saved words?',
      'This will remove all bookmarked words.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await saveSavedWords([]);
            setSavedWords([]);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Theme</Text>
        <View style={styles.modeRow}>
          {(['system', 'light', 'dark'] as ThemeMode[]).map((mode) => {
            const isActive = mode === themeMode;
            return (
              <TouchableOpacity
                key={mode}
                style={[styles.modeButton, isActive && styles.modeButtonActive]}
                onPress={() => handleThemeModeChange(mode)}
              >
                <Text style={[styles.modeText, isActive && styles.modeTextActive]}>
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Data</Text>
        <TouchableOpacity style={styles.actionButton} onPress={confirmClearHistory}>
          <Text style={styles.actionText}>Clear Search History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={confirmClearSavedWords}>
          <Text style={[styles.actionText, styles.dangerText]}>Clear Saved Words</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>About</Text>
        <Text style={styles.aboutText}>LexiSearch</Text>
        <Text style={styles.aboutSubtext}>Version {appConfig.expo.version}</Text>
        <Text style={styles.aboutSubtext}>Dictionary search with Trie + Levenshtein matching.</Text>
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof getThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 16,
    },
    section: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
    },
    sectionLabel: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
      marginBottom: 10,
    },
    modeRow: {
      flexDirection: 'row',
      gap: 8,
    },
    modeButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: 'center',
      backgroundColor: colors.surfaceMuted,
    },
    modeButtonActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    modeText: {
      color: colors.textPrimary,
      fontWeight: '600',
    },
    modeTextActive: {
      color: colors.surface,
    },
    actionButton: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    actionText: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '500',
    },
    dangerText: {
      color: colors.danger,
    },
    aboutText: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    aboutSubtext: {
      color: colors.textSecondary,
      fontSize: 13,
      marginBottom: 2,
    },
  });
}