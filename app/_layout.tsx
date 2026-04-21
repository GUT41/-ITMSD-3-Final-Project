import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { initDictionary } from '../src/services/dictionaryService';
import { useSearchStore } from '../src/store/searchStore';
import { getSavedWords, getSearchHistory } from '../src/services/storageService';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { colors } from '../src/constants/theme';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const initApp = async () => {
    try {
      setInitError(null);
      await initDictionary();
      const [saved, history] = await Promise.all([getSavedWords(), getSearchHistory()]);
      useSearchStore.setState({ savedWords: saved, searchHistory: history });
      console.log('✓ App initialized');
      setIsReady(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'App initialization failed.';
      console.error('✗ Init failed:', error);
      setInitError(message);
      setIsReady(false);
    }
  };

  useEffect(() => {
    initApp();
  }, []);

  if (!isReady) {
    if (initError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Initialization Failed</Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 16, textAlign: 'center' }}>{initError}</Text>
          <TouchableOpacity
            onPress={initApp}
            style={{ backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 }}
          >
            <Text style={{ color: colors.onPrimary, fontWeight: '600' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="word/[id]" options={{ title: '', presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings', presentation: 'modal' }} />
      </Stack>
    </ErrorBoundary>
  );
}