import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initDictionary } from '../src/services/dictionaryService';

export default function WordLayout() {
  useEffect(() => {
    initDictionary().catch((error) => {
      console.error('✗ Dictionary init failed:', error);
    });
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}