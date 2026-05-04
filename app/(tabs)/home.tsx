import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useWordOfDay } from '../../src/hooks/useWordOfDay';
import { useSearchStore } from '../../src/store/searchStore';
import { getAllWords } from '../../src/services/dictionaryService';
import { useSettingsStore } from '../../src/store/settingsStore';
import { getThemeColors } from '../../src/theme/colors';
import { useMemo } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const { word: wordOfDay } = useWordOfDay();
  const savedWords = useSearchStore((state) => state.savedWords);
  const allWords = getAllWords();

  const systemScheme = useColorScheme();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const colors = getThemeColors(themeMode, systemScheme);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const masterScore = allWords.length > 0 ? Math.round((savedWords.length / allWords.length) * 100) : 0;

  if (!wordOfDay) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learn Daily</Text>
        <TouchableOpacity onPress={() => router.push('/settings')} style={styles.headerIcon}>
          <MaterialIcons name="settings" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.scoreCard}>
        <View style={styles.scoreRow}>
          <MaterialIcons name="trending-up" size={24} color={colors.primary} />
          <View style={styles.scoreText}>
            <Text style={styles.scoreLabel}>Master Score</Text>
            <Text style={styles.scoreValue}>{masterScore}%</Text>
            <Text style={styles.scoreSubtext}>
              {savedWords.length} of {allWords.length} words saved
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.heroCard}
        onPress={() => router.push(`/word/${wordOfDay.id}`)}
        activeOpacity={0.9}
      >
        <View style={styles.heroHeader}>
          <Text style={styles.heroLabel}>WORD OF THE DAY</Text>
          <MaterialIcons name="arrow-forward" size={20} color={colors.surface} />
        </View>

        <Text style={styles.heroWord}>{wordOfDay.word}</Text>
        {!!wordOfDay.pronunciation && <Text style={styles.heroPronunciation}>{wordOfDay.pronunciation}</Text>}

        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>{wordOfDay.partOfSpeech}</Text>
        </View>

        <Text style={styles.heroDefinition}>{wordOfDay.definition}</Text>
        {!!wordOfDay.example && <Text style={styles.heroExample}>"{wordOfDay.example}"</Text>}
      </TouchableOpacity>

      <View style={styles.quickLinks}>
        <TouchableOpacity style={styles.quickLink} onPress={() => router.push('/(tabs)/saved')}>
          <MaterialIcons name="bookmark" size={26} color={colors.primary} />
          <Text style={styles.quickLinkText}>{savedWords.length} Saved</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickLink} onPress={() => router.push('/(tabs)/index')}>
          <MaterialIcons name="search" size={26} color={colors.primary} />
          <Text style={styles.quickLinkText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickLink} onPress={() => router.push('/(tabs)/collections')}>
          <MaterialIcons name="collections" size={26} color={colors.primary} />
          <Text style={styles.quickLinkText}>Collections</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function createStyles(colors: ReturnType<typeof getThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    center: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      paddingTop: 20,
      paddingHorizontal: 16,
      paddingBottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    headerIcon: {
      padding: 8,
    },
    scoreCard: {
      marginHorizontal: 16,
      marginBottom: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    scoreRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    scoreText: { flex: 1 },
    scoreLabel: {
      fontSize: 12,
      color: colors.textMuted,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    scoreValue: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.primary,
    },
    scoreSubtext: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    heroCard: {
      marginHorizontal: 16,
      marginBottom: 12,
      paddingHorizontal: 16,
      paddingVertical: 18,
      backgroundColor: colors.primary,
      borderRadius: 12,
    },
    heroHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    heroLabel: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.surface,
      textTransform: 'uppercase',
      letterSpacing: 1,
      opacity: 0.9,
    },
    heroWord: {
      fontSize: 40,
      fontWeight: '800',
      color: colors.surface,
      marginBottom: 4,
    },
    heroPronunciation: {
      fontSize: 14,
      color: colors.surface,
      opacity: 0.9,
      fontStyle: 'italic',
      marginBottom: 10,
    },
    heroBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 4,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 6,
      marginBottom: 10,
    },
    heroBadgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.surface,
      textTransform: 'capitalize',
    },
    heroDefinition: {
      fontSize: 16,
      lineHeight: 22,
      color: colors.surface,
      marginBottom: 10,
    },
    heroExample: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.surface,
      opacity: 0.9,
      fontStyle: 'italic',
    },
    quickLinks: {
      flexDirection: 'row',
      marginHorizontal: 16,
      gap: 8,
    },
    quickLink: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 8,
      backgroundColor: colors.surface,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    quickLinkText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textPrimary,
      textAlign: 'center',
    },
  });
}

