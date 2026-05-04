import { View, Text, FlatList, TouchableOpacity, StyleSheet, useColorScheme, Alert } from 'react-native';
import { useMemo } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useSearchStore } from '../../src/store/searchStore';
import { clearSearchHistory } from '../../src/services/storageService';
import { useSettingsStore } from '../../src/store/settingsStore';
import { getThemeColors } from '../../src/theme/colors';

export default function HistoryScreen() {
  const history = useSearchStore((state) => state.searchHistory);
  const clearHistory = useSearchStore((state) => state.clearHistory);

  const systemScheme = useColorScheme();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const colors = getThemeColors(themeMode, systemScheme);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const confirmClear = () => {
    Alert.alert('Clear search history?', 'This will remove all recent searches from the app.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearSearchHistory();
          clearHistory();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <TouchableOpacity onPress={confirmClear} style={styles.clearButton} disabled={history.length === 0}>
          <MaterialIcons name="delete" size={22} color={history.length === 0 ? colors.iconInactive : colors.danger} />
        </TouchableOpacity>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="history" size={48} color={colors.iconInactive} />
          <Text style={styles.emptyText}>No searches yet</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, idx) => `${item}-${idx}`}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <MaterialIcons name="search" size={18} color={colors.textMuted} />
              <Text style={styles.rowText}>{item}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

function createStyles(colors: ReturnType<typeof getThemeColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 16, paddingTop: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    title: { fontSize: 28, fontWeight: '800', color: colors.textPrimary },
    clearButton: { padding: 8 },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { marginTop: 12, color: colors.textMuted, fontSize: 14 },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: colors.surface,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 8,
    },
    rowText: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  });
}

