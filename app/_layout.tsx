import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initDictionary } from '../src/services/dictionaryService';
import { useSearchStore } from '../src/store/searchStore';
import { getSavedWords, getSearchHistory } from '../src/services/storageService';

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initDictionary();

        const savedWords = await getSavedWords();
        useSearchStore.setState({ savedWords });

        const history = await getSearchHistory();
        useSearchStore.setState({ searchHistory: history });

        console.log('App initialization complete');
        setAppReady(true);
      } catch (error) {
        console.error('App initialization failed:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    initializeApp();
  }, []);

  if (!appReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0F6E56" />
      </View>
    );
  }

  if (initError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.error}>Error: {initError}</Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});