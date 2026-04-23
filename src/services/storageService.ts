import AsyncStorage from '@react-native-async-storage/async-storage';
import { Word } from '../types/index';
import { ThemeMode } from '../theme/colors';

const SAVED_WORDS_KEY = '@lexisearch/savedWords';
const SEARCH_HISTORY_KEY = '@lexisearch/history';
const THEME_MODE_KEY = '@lexisearch/themeMode';

export async function getSavedWords(): Promise<Word[]> {
  try {
    const data = await AsyncStorage.getItem(SAVED_WORDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.warn('Storage error:', error);
    return [];
  }
}

export async function saveSavedWords(words: Word[]): Promise<void> {
  try {
    await AsyncStorage.setItem(SAVED_WORDS_KEY, JSON.stringify(words));
  } catch (error) {
    console.error('Error saving words:', error);
  }
}

export async function addSavedWord(word: Word): Promise<void> {
  const saved = await getSavedWords();
  const updated = [word, ...saved.filter((w) => w.id !== word.id)];
  await saveSavedWords(updated);
}

export async function removeSavedWord(wordId: string): Promise<void> {
  const saved = await getSavedWords();
  const updated = saved.filter((w) => w.id !== wordId);
  await saveSavedWords(updated);
}

export async function getSearchHistory(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

export async function addToSearchHistory(queries: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(queries));
  } catch (error) {
    console.error('Error saving history:', error);
  }
}

export async function clearSearchHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
}

export async function getThemeMode(): Promise<ThemeMode | null> {
  try {
    const mode = await AsyncStorage.getItem(THEME_MODE_KEY);
    if (mode === 'system' || mode === 'light' || mode === 'dark') {
      return mode;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_MODE_KEY, mode);
  } catch (error) {
    console.error('Error saving theme mode:', error);
  }
}

export async function saveSearchHistory(history: string[]): Promise<void> {
  await addToSearchHistory(history);
}