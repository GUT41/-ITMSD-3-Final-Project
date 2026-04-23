import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initDictionary } from '../src/services/dictionaryService';
import { useSearchStore } from '../src/store/searchStore';
import { useSettingsStore } from '../src/store/settingsStore';
import { getSavedWords, getSearchHistory } from '../src/services/storageService';

export default function WordLayout() {
  const hydrateSettings = useSettingsStore((state) => state.hydrateSettings);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initDictionary();
        const [savedWords, history] = await Promise.all([
          getSavedWords(),
          getSearchHistory(),
          hydrateSettings(),
        ]);
        useSearchStore.setState({
          savedWords,
          searchHistory: history,
        });
      } catch (error) {
        console.error('✗ App init failed:', error);
      }
    };
    initializeApp();
  }, [hydrateSettings]);

  return <Stack screenOptions={{ headerShown: false }} />;
}