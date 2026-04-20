import { Stack } from 'expo-router';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  useEffect(() => {
    console.log('App initialized');
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}